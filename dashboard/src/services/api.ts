/**
 * Centralized API service with Firebase Admin SDK integration
 * Handles authentication, token refresh, error handling, and performance optimization
 */

import { auth } from "../utils/firebase";

// API Configuration
// Use environment variable or fallback based on environment
const getApiBaseUrl = () => {
  // Check if we're in production build
  if (import.meta.env.PROD) {
    // Check if running on Vercel or if VITE_API_URL contains a production domain
    const apiUrl = import.meta.env.VITE_API_URL;

    // If VITE_API_URL is set and it's not localhost, use it
    if (apiUrl && !apiUrl.includes("localhost")) {
      return `${apiUrl.replace(/\/+$/, "")}/api`;
    }

    // In production, use relative URLs (same domain) - perfect for Vercel
    return "/api";
  }

  // Development: use localhost or explicit VITE_API_URL
  return import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
    : "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();

console.log("🚀 API_BASE_URL configured as:", API_BASE_URL);
console.log("🚀 VITE_API_URL env var:", import.meta.env.VITE_API_URL);
console.log("🚀 import.meta.env.PROD:", import.meta.env.PROD);
console.log("🚀 Current environment mode:", import.meta.env.MODE);

// Request timeout (30 seconds)
const REQUEST_TIMEOUT = 30000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache for ID tokens to avoid frequent Firebase calls
let tokenCache: { token: string; expiresAt: number } | null = null;
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

/**
 * Get Firebase ID token with caching and automatic refresh
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("🚨 No authenticated user found");
      return null;
    }

    const now = Date.now();

    // Check if we have a valid cached token
    if (tokenCache && tokenCache.expiresAt > now + TOKEN_REFRESH_BUFFER) {
      console.log("🎯 Using cached Firebase ID token");
      return tokenCache.token;
    }

    console.log("🔄 Refreshing Firebase ID token...");
    const token = await currentUser.getIdToken(true); // Force refresh

    // Cache the token (Firebase tokens typically expire in 1 hour)
    tokenCache = {
      token,
      expiresAt: now + 60 * 60 * 1000, // 1 hour
    };

    console.log("✅ Firebase ID token refreshed and cached");
    return token;
  } catch (error) {
    console.error("❌ Failed to get Firebase ID token:", error);
    tokenCache = null; // Clear invalid cache
    return null;
  }
}

/**
 * Clear token cache (useful for logout)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  console.log("🧹 Token cache cleared");
}

/**
 * Create authenticated request headers
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  console.log("🔐 Getting auth headers...");
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("✅ Auth headers created with token");
  } else {
    console.log("❌ No token available for auth headers");
  }

  return headers;
}

/**
 * Enhanced fetch with timeout, retries, and error handling
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle specific error cases that might benefit from retry
    if (!response.ok) {
      const isServerError = response.status >= 500;
      const isNetworkError = response.status === 0;
      const shouldRetry =
        (isServerError || isNetworkError) && retryCount < MAX_RETRIES;

      if (shouldRetry) {
        console.warn(
          `⚠️ Request failed (${
            response.status
          }), retrying in ${RETRY_DELAY}ms... (attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount))
        ); // Exponential backoff
        return fetchWithRetry(url, options, retryCount + 1);
      }
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle network errors and timeouts
    if (error instanceof Error) {
      const isAbortError = error.name === "AbortError";
      const isNetworkError = error.message.includes("fetch");
      const shouldRetry =
        (isAbortError || isNetworkError) && retryCount < MAX_RETRIES;

      if (shouldRetry) {
        console.warn(
          `⚠️ Network error, retrying in ${RETRY_DELAY}ms... (attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount))
        );
        return fetchWithRetry(url, options, retryCount + 1);
      }
    }

    throw error;
  }
}

/**
 * Generic API request function with Firebase Admin SDK integration
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    skipAuth?: boolean;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, skipAuth = false } = options;

  try {
    console.log(`🌐 API Request: ${method} ${endpoint}`);
    console.log(`📍 API_BASE_URL: ${API_BASE_URL}`);

    // Get authenticated headers
    const authHeaders = skipAuth
      ? { "Content-Type": "application/json" }
      : await getAuthHeaders();

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...authHeaders,
        ...headers,
      },
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 Full URL: ${url}`);
    const response = await fetchWithRetry(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`❌ Response Status: ${response.status}`);
      console.log(`❌ Response Headers:`, response.headers);
      console.log(`❌ Raw Response Data:`, errorData.substring(0, 200) + "...");
      let parsedError: ApiResponse;

      try {
        parsedError = JSON.parse(errorData);
      } catch {
        parsedError = { error: errorData || `HTTP ${response.status}` };
      }

      const apiError: ApiError = new Error(
        parsedError.error || `API request failed with status ${response.status}`
      );
      apiError.status = response.status;
      apiError.details = parsedError;

      // Handle specific error cases
      if (response.status === 401) {
        console.warn("🔐 Authentication failed, clearing token cache");
        clearTokenCache();
        // Could trigger logout here if needed
      }

      throw apiError;
    }

    const responseText = await response.text();
    console.log(
      `📄 Response Text (first 200 chars):`,
      responseText.substring(0, 200) + "..."
    );
    if (!responseText) {
      return {} as T;
    }

    const data = JSON.parse(responseText);
    console.log(`✅ API Response: ${method} ${endpoint} - Success`);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${method} ${endpoint}`, error);
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: "GET", skipAuth }),

  post: <T>(endpoint: string, body?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: "POST", body, skipAuth }),

  put: <T>(endpoint: string, body?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: "PUT", body, skipAuth }),

  patch: <T>(endpoint: string, body?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: "PATCH", body, skipAuth }),

  delete: <T>(endpoint: string, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: "DELETE", skipAuth }),
};

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log("🏥 Starting health check...");
    await api.get("/health", true); // Skip auth for health check
    console.log("✅ Health check passed");
    return true;
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return false;
  }
}

// Current user data fetching
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  firebaseUid: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    console.log("🔍 getCurrentUser: Starting API call to /users/me");
    const user = await api.get<UserProfile>("/users/me");
    console.log("✅ getCurrentUser: API call successful, user data:", user);
    return user;
  } catch (error) {
    console.error("❌ getCurrentUser: Failed to fetch current user:", error);
    if (error instanceof Error && "status" in error) {
      const apiError = error as ApiError;
      console.error("❌ getCurrentUser: Error status:", apiError.status);
      console.error("❌ getCurrentUser: Error details:", apiError.details);
    }
    return null;
  }
}

// Export for external usage
export { API_BASE_URL, REQUEST_TIMEOUT, MAX_RETRIES };
