const { Worker } = require("bullmq");
const { redisConnection } = require("../config/messageQueueConnection");
const vectorWorker = new Worker(
  "VectorPush",
  async (job) => {
    try {
      const { fileUrl, fileType, subjectId } = job.data;
      return { success: true, message: "Embeddings generated" };
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
