import cron from "node-cron";
import { bhavcopyQueue } from "./queues/bhavcopy.queue";

const CRON_EXPRESSION = "0 19 * * 1-5";

export function startBhavcopyCron(): void {
  cron.schedule(
    CRON_EXPRESSION,
    async () => {
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(Date.now() + istOffset);
      const dateStr = istDate.toISOString().split("T")[0];
      const jobId = `bhavcopy-${dateStr}`;

      try {
        await bhavcopyQueue.add(
          "download-and-seed",
          { date: dateStr },
          { jobId },
        );
        console.log(`[BhavcopyCron] Job enqueued → ${jobId}`);
      } catch (err) {
        console.error("[BhavcopyCron] Failed to enqueue:", err);
      }
    },
    { timezone: "Asia/Kolkata" },
  );

  console.log(`[BhavcopyCron] Scheduled → "${CRON_EXPRESSION}" (IST, Mon–Fri)`);
}
