import { Router, Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "./errorHandler";
import { ValidationError } from "./errors";
import { bhavcopyQueue } from "../workers/queues/bhavcopy.queue";
import { authenticate } from "../middlewares/authenticate";

const ingestSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const ingestRouter = Router();

ingestRouter.post(
  "/bhavcopy",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = ingestSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    const job = await bhavcopyQueue.add("ingest-bhavcopy", {
      date: parsed.data.date,
    });

    res.status(202).json({
      message: "Bhavcopy ingestion job queued",
      jobId: job.id,
      date: parsed.data.date,
    });
  }),
);
