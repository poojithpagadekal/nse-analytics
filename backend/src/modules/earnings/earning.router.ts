import { Router } from "express";
import { earningsController } from "./earnings.controller";
import { authenticate } from "../../middlewares/authenticate";

export const earningsRouter = Router();

earningsRouter.get("/:symbol", earningsController.getEarningsBySymbol);
earningsRouter.post("/", authenticate, earningsController.createEarning);
