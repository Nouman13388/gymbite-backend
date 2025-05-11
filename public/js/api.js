// API Configuration
const API_BASE = '/api/users';

// Debug Logger
const debugLogger = {
    log(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
        if (data) {
            console.log('Data:', data);
        }
        this.addToDebugLog('info', message, data);
    },
    error(message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`);
        if (error) {
            console.error('Error details:', error);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
        this.addToDebugLog('error', message, error);
    },
    success(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] SUCCESS: ${message}`);
        if (data) {
            console.log('Data:', data);
        }
        this.addToDebugLog('success', message, data);
    },
    addToDebugLog(type, message, data = null) {
        const debugLog = document.getElementById('debugLog');
        if (!debugLog) return;

        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;

        const timestamp = document.createElement('span');
        timestamp.className = 'debug-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        entry.appendChild(timestamp);

        const messageSpan = document.createElement('span');
        messageSpan.className = 'debug-message';
        messageSpan.textContent = message;
        entry.appendChild(messageSpan);

        if (data) {
            const dataDiv = document.createElement('div');
            dataDiv.className = 'debug-data';
            if (typeof data === 'object') {
                dataDiv.textContent = JSON.stringify(data, null, 2);
            } else {
                dataDiv.textContent = String(data);
            }
            entry.appendChild(dataDiv);
        }

        debugLog.appendChild(entry);
        debugLog.scrollTop = debugLog.scrollHeight;
    },
    clear() {
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            debugLog.innerHTML = '';
        }
    }
};

// Make debugLogger available globally
window.debugLogger = debugLogger;

// API Service
class UserApiService {
    constructor() {
        this.requestCount = 0;
        debugLogger.log('API Service initialized');
    }

    generateRequestId() {
        return `req_${++this.requestCount}_${Date.now()}`;
    }

    async request(endpoint, options = {}) {
        const requestId = this.generateRequestId();
        const startTime = performance.now();

        debugLogger.log(`Starting request ${requestId}`, {
            endpoint,
            method: options.method || 'GET',
            headers: options.headers,
            body: options.body ? JSON.parse(options.body) : undefined
        });

        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Request-ID': requestId,
                    ...options.headers
                }
            });

            const responseTime = performance.now() - startTime;
            debugLogger.log(`Response received for request ${requestId}`, {
                status: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime.toFixed(2)}ms`
            });

            // Handle 204 No Content responses
            if (response.status === 204) {
                debugLogger.success(`Request ${requestId} completed successfully (No Content)`);
                return null;
            }

            const data = await response.json();
            debugLogger.log(`Response data for request ${requestId}`, data);

            if (!response.ok) {
                let errorMessage;
                if (response.status === 500 && data.error?.includes('Unique constraint failed')) {
                    errorMessage = 'This email address is already registered. Please use a different email.';
                } else {
                    errorMessage = `API Error: ${response.status} ${JSON.stringify(data)}`;
                }

                debugLogger.error(`Request ${requestId} failed`, {
                    status: response.status,
                    error: data,
                    message: errorMessage
                });

                throw new Error(errorMessage);
            }

            debugLogger.success(`Request ${requestId} completed successfully`);
            return data;
        } catch (error) {
            debugLogger.error(`Request ${requestId} failed with exception`, error);
            throw error;
        }
    }

    async getUsers() {
        debugLogger.log('Fetching all users');
        try {
            const users = await this.request(API_BASE);
            debugLogger.success('Users fetched successfully', users);
            return users;
        } catch (error) {
            debugLogger.error('Failed to fetch users', error);
            throw error;
        }
    }

    async createUser(userData) {
        debugLogger.log('Creating new user', userData);
        try {
            const newUser = await this.request(API_BASE, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            debugLogger.success('User created successfully', newUser);
            return newUser;
        } catch (error) {
            debugLogger.error('Failed to create user', error);
            throw error;
        }
    }

    async updateUser(id, userData) {
        debugLogger.log('Updating user', { id, userData });
        try {
            const updatedUser = await this.request(`${API_BASE}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
            debugLogger.success('User updated successfully', updatedUser);
            return updatedUser;
        } catch (error) {
            debugLogger.error('Failed to update user', error);
            throw error;
        }
    }

    async deleteUser(id) {
        debugLogger.log('Deleting user', { id });
        try {
            await this.request(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });
            debugLogger.success('User deleted successfully');
            return true;
        } catch (error) {
            debugLogger.error('Failed to delete user', error);
            throw error;
        }
    }
}

// Export the service
export const userApi = new UserApiService(); 