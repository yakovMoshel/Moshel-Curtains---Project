// PM2 process definition for running the built Next.js app in production.
//
// IMPORTANT: instances MUST stay at 1. The AI-visualization rate limiter
// (src/app/api/visualize/rateLimiter.ts) and the OpenAI request handling in
// src/app/api/visualize/route.ts keep their state in memory, per-process.
// Running this under PM2 cluster mode (or any instances > 1) would split
// traffic across multiple independent processes, each with its own copy of
// the rate limiter — silently multiplying the effective per-IP limit instead
// of enforcing it.
module.exports = {
  apps: [
    {
      name: "moshel-curtains",
      script: "npm",
      args: "start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      max_memory_restart: "500M",
      restart_delay: 3000,
    },
  ],
};
