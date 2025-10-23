
const redis = require("redis");

const config = {
  redis: {
    host: "redis",
    port: 6379
  }
};

const db = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: config.redis.port,
  retry_strategy: () => {
    return new Error('Retry time exhausted');
  },
});

process.on('SIGINT', function() {
  db.quit();
});

module.exports = db;
