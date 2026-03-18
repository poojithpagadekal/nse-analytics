import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { redis } from "./config/redis";
import { bhavcopyWorker } from "./workers/bhavcopy.worker";

async function bootstrap() {
  await prisma.$connect();
  console.log("Postgres connected");

  await redis.ping();
  console.log("Redis connected");

  const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} - shutting down`);
    server.close(async () => {
      try {
        await bhavcopyWorker.close();
        await prisma.$disconnect();
        redis.disconnect();
      } catch (err) {
        console.error("Error during cleanup:", err);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
