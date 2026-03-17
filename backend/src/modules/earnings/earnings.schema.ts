import { z } from "zod";

export const createEarningSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .transform((s) => s.toUpperCase()),
  quarter: z.string().min(1),
  revenue: z
    .number()
    .positive()
    .optional()
    .transform((v) => v ?? null),
  netProfit: z
    .number()
    .optional()
    .transform((v) => v ?? null),
  eps: z
    .number()
    .optional()
    .transform((v) => v ?? null),
  yoyGrowth: z
    .number()
    .optional()
    .transform((v) => v ?? null),
  announcedAt: z.string().datetime(),
});

export const earningQuerySchema = z.object({
  quarter: z.string().optional(),
});

export const earningParamSchema = z.object({
  symbol: z.string().min(1),
});

export type createEarningInput = z.infer<typeof createEarningSchema>;
export type EarningsQuery = z.infer<typeof earningQuerySchema>;
export type EarningParam = z.infer<typeof earningParamSchema>;
