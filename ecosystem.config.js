module.exports = {
  apps: [
    {
      name: 'scs-app',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/html/scs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err-1.log',
      out_file: './logs/out-1.log',
      log_file: './logs/combined-1.log',
      time: true
    }
  ]
} 