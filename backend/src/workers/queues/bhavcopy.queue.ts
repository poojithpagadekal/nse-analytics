import { Queue } from 'bullmq';
import { createRedisConnection, redisConfig } from '../../config/redis';

export const BHAVCOPY_QUEUE = 'bhavcopy-ingestion';

export const bhavcopyQueue = new Queue(BHAVCOPY_QUEUE, {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});