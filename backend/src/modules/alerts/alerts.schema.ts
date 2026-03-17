import { z } from "zod";

export const AlertType = z.enum([
  "EPS_GROWTH",
  "REVENUE_GROWTH",
  "PATTERN_DETECTED",
  "PRICE_CHANGE",
]);

export const AlertCondition = z.enum(["GT", "LT", "EQ"]);

export const createAlertSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .transform((s) => s.toUpperCase()),
  type: AlertType,
  condition: AlertCondition,
  threshold: z.number(),
});

export const alertParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const alertQuerySchema = z.object({
  symbol: z.string().optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type AlertParam = z.infer<typeof alertParamSchema>;
export type AlertQuery = z.infer<typeof alertQuerySchema>;
