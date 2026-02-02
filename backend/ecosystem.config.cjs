module.exports = {
  apps: [
    {
      name: "checkers-backend",
      script: "./dist/server.js", // путь к собранному JS
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
