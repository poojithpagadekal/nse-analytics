import { Worker, Job } from "bullmq";
import { redisConfig } from "../config/redis";
import { BHAVCOPY_QUEUE } from "./queues/bhavcopy.queue";
import {
  processBhavcopyJob,
  BhavcopyJobData,
} from "./processors/bhavcopy.processor";
import { getSocket } from "../config/socket";

export const bhavcopyWorker = new Worker<BhavcopyJobData>(
  BHAVCOPY_QUEUE,
  async (job: Job<BhavcopyJobData>) => {
    console.log(`[Worker] Starting job ${job.id} for date ${job.data.date}`);

    await job.updateProgress(0);
    await processBhavcopyJob(job.data);
    await job.updateProgress(100);

    getSocket().emit(`prices:updated`, { date: job.data.date });
    console.log(`[Worker] Emitted prices:updated for ${job.data.date}`);

    console.log(`[Worker] Completed job ${job.id}`);
  },
  {
    connection: redisConfig,
    concurrency: 1,
  },
);

bhavcopyWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed for date ${job.data.date}`);
});

bhavcopyWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err.message);
});
