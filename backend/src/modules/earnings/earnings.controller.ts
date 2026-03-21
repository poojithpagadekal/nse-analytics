import { Request, Response } from "express";
import { asyncHandler } from "../../lib/errorHandler";
import { ValidationError } from "../../lib/errors";
import { earningsService } from "./earnings.service";
import {
  createEarningSchema,
  earningParamSchema,
  earningQuerySchema,
} from "./earnings.schema";

const getEarningsBySymbol = asyncHandler(
  async (req: Request, res: Response) => {
    const { symbol } = earningParamSchema.parse(req.params);
    const { quarter } = earningQuerySchema.parse(req.query);

    const earnings = await earningsService.getEarningsBySymbol(symbol, quarter);
    res.status(200).json(earnings);
  },
);

const createEarning = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createEarningSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid request body",
    );
  }

  const earning = await earningsService.createEarning(parsed.data);
  res.status(201).json(earning);
});

export const earningsController = {
  getEarningsBySymbol,
  createEarning,
};
