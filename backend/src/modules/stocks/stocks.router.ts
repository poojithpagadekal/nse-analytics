import { Router } from "express";
import { stocksController } from "./stocks.controller";

export const stocksRouter = Router();

stocksRouter.get("/", stocksController.getAllStocks);
stocksRouter.get("/:symbol", stocksController.getStockBySymbol);
stocksRouter.post("/", stocksController.createStock);
stocksRouter.get("/:symbol/prices",stocksController.getDailyPrices);