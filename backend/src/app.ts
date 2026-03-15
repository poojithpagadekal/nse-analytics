import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { healthRouter } from "./lib/health";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", healthRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
