import { Router } from "express";
import { stocksController } from "./stocks.controller";
import { authenticate } from "../../middlewares/authenticate";

export const stocksRouter = Router();

stocksRouter.get("/", stocksController.getAllStocks);
stocksRouter.get("/:symbol", stocksController.getStockBySymbol);
stocksRouter.get("/:symbol/prices", stocksController.getDailyPrices);
stocksRouter.post("/", authenticate, stocksController.createStock);
