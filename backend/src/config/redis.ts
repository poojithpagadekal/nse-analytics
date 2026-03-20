import Redis from "ioredis";
import { env } from "./env";

export const redisConfig = {
  host: env.REDIS_HOST ?? "localhost",
  port: parseInt(process.env.REDIS_PORT ?? "6379"),
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConfig);
export const createRedisConnection = () => new Redis(redisConfig);

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("Redis connected"));
