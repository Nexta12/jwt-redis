const redis = require("redis");

// conect to redis
const redis_client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

redis_client.on("connect", () => {
  console.log("Redis client Connected");
});

module.exports = redis_client;
