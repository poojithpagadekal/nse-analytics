import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { redis } from "./config/redis";
import { initSocket } from "./config/socket";
import { bhavcopyWorker } from "./workers/bhavcopy.worker";
import { startBhavcopyCron } from "./workers/bhavcopy.cron";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  await prisma.$connect();
  console.log("Postgres connected");

  await redis.ping();
  console.log("Redis connected");

  const server = createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  startBhavcopyCron();

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} - shutting down`);
    server.close(async () => {
      try {
        await bhavcopyWorker.close();
        await prisma.$disconnect();
        redis.disconnect();
        console.log("Cleanup complete");
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
