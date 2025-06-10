// Production configuration for PM2 (if deploying to VPS instead of Vercel)
module.exports = {
  apps: [{
    name: "gymbite-backend",
    script: "./dist/index.js",
    instances: "max", // Use all available CPU cores
    exec_mode: "cluster", // Enable cluster mode for better performance
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    },
    // Performance settings
    max_memory_restart: "1G", // Restart if memory usage exceeds 1GB
    min_uptime: "10s", // Minimum uptime before considering app stable
    max_restarts: 5, // Maximum restarts within unstable_restarts timeframe
    
    // Logging
    log_file: "./logs/combined.log",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    
    // Advanced settings
    watch: false, // Don't watch files in production
    ignore_watch: ["node_modules", "logs", "dist"],
    
    // Auto-restart settings
    cron_restart: "0 2 * * *", // Restart daily at 2 AM
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};
