import { z } from "zod";
export const createStockSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .transform((s) => s.toUpperCase()),
  name: z.string().min(1),
  sector: z
    .string()
    .optional()
    .transform((v) => v ?? null),
  industry: z
    .string()
    .optional()
    .transform((v) => v ?? null),
});

export const symbolParamSchema = z.object({
  symbol: z.string().min(1),
});

export const priceQuerySchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "from must be YYYY-MM-DD")
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "to must be YYYY-MM-DD")
    .optional(),
});

export type CreateStockInput = z.infer<typeof createStockSchema>;
export type SymbolParam = z.infer<typeof symbolParamSchema>;
export type PriceQuery = z.infer<typeof priceQuerySchema>;
