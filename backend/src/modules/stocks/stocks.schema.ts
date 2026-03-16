import { symbol, z } from "zod";
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

export type CreateStockInput = z.infer<typeof createStockSchema>;
export type SymbolParam = z.infer<typeof symbolParamSchema>;
