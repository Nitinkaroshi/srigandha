module.exports = {
  apps: [
    {
      name: 'srigandha-api',
      script: './server.js',
      instances: 1,
      exec_mode: 'cluster',

      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // Restart on crash
      min_uptime: '10s',
      max_restarts: 10,

      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000
      },

      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,

      // Merge logs from all instances
      merge_logs: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
