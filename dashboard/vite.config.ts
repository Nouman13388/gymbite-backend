import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from both current directory and parent directory
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");
  const parentEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");

  // Merge environment variables (parent takes precedence)
  const mergedEnv = { ...env, ...parentEnv };

  // Debug: Log the loaded environment variables
  console.log("🔧 Vite config - Loaded env variables:", {
    VITE_FIREBASE_API_KEY: mergedEnv.VITE_FIREBASE_API_KEY
      ? "✅ Loaded"
      : "❌ Missing",
    VITE_FIREBASE_AUTH_DOMAIN: mergedEnv.VITE_FIREBASE_AUTH_DOMAIN
      ? "✅ Loaded"
      : "❌ Missing",
    VITE_FIREBASE_PROJECT_ID: mergedEnv.VITE_FIREBASE_PROJECT_ID
      ? "✅ Loaded"
      : "❌ Missing",
  });

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: mergedEnv.VITE_API_URL || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, "../public"),
      emptyOutDir: true,
      sourcemap: mode !== "production",
    },
    // Define environment variables explicitly for the build
    define: {
      "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify(
        mergedEnv.VITE_FIREBASE_API_KEY
      ),
      "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(
        mergedEnv.VITE_FIREBASE_AUTH_DOMAIN
      ),
      "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(
        mergedEnv.VITE_FIREBASE_PROJECT_ID
      ),
      "import.meta.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(
        mergedEnv.VITE_FIREBASE_STORAGE_BUCKET
      ),
      "import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
        mergedEnv.VITE_FIREBASE_MESSAGING_SENDER_ID
      ),
      "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify(
        mergedEnv.VITE_FIREBASE_APP_ID
      ),
      "import.meta.env.VITE_API_URL": JSON.stringify(mergedEnv.VITE_API_URL),
    },
  };
});
