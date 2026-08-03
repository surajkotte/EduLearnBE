const { Worker } = require("bullmq");
const { redisConnection } = require("../config/messageQueueConnection");
const vectorWorker = new Worker(
  "VectorPush",
  async (job) => {
    try {
      const { documentId, fileType, subjectId, learningModuleId, objectKey } =
        job.data;
      console.log(`Processing job with id ${job.id} and data:`, job.data);
      return { messageType: "S", message: "Embeddings generated" };
    } catch (error) {
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);

vectorWorker.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

vectorWorker.on("failed", (job, err) => {
  console.log(`Job with id ${job.id} has failed with error ${err.message}`);
});

module.exports = { vectorWorker };
