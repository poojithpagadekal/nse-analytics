import { Router } from "express";
import { earningsController } from "./earnings.controller";

export const earningsRouter = Router();

earningsRouter.get("/:symbol", earningsController.getEarningsBySymbol);
earningsRouter.post("/", earningsController.createEarning);
