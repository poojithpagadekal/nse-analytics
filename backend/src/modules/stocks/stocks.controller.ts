import { Request, Response } from "express";
import { stocksService } from "./stocks.service";
import { asyncHandler } from "../../lib/errorHandler";
import { createStockSchema, symbolParamSchema } from "./stocks.schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

type StockParams = {
  symbol: string;
};

const getAllStocks = asyncHandler(async (req: Request, res: Response) => {
  const stocks = await stocksService.getAllStocks();
  res.status(200).json(stocks);
});

const getStockBySymbol = asyncHandler(
  async (req: Request<StockParams>, res: Response) => {
    const { symbol } = symbolParamSchema.parse(req.params);
    const stock = await stocksService.getStockBySymbol(symbol);
    if (!stock) throw new NotFoundError(`Stock ${symbol}`);
    res.status(200).json(stock);
  },
);

const createStock = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createStockSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid request body",
    );
  }

  const stock = await stocksService.createStock(parsed.data);
  res.status(201).json(stock);
});

export const stocksController = {
  getAllStocks,
  getStockBySymbol,
  createStock,
};
