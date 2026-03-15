import Redis from "ioredis";
import { env } from "./env";

const redisConfig = {
  host: "localhost",
  port: 6379,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConfig);

export const createRedisConnection = () => new Redis(redisConfig);

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("Redis connected"));
