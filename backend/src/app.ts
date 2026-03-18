import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { healthRouter } from "./lib/health";
import { stocksRouter } from "./modules/stocks/stocks.router";
import { errorHandler } from "./lib/errorHandler";
import { earningsRouter } from "./modules/earnings/earning.router";
import { alertsRouter } from "./modules/alerts/alerts.router";
import { ingestRouter } from "./lib/ingest.router";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/stocks", stocksRouter);
app.use("/earnings", earningsRouter);
app.use("/alerts", alertsRouter);
app.use("/ingest", ingestRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);
export default app;
