const { Queue } = require("bullmq");
const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

const vectorPushQueue = new Queue("VectorPush", {
  connection: redisConnection,
});

module.exports = {
  redisConnection,
  vectorPushQueue,
};