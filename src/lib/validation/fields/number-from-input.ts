import { z } from "zod";

export function numberFromInput(field: string) {
  return z
    .string()
    .trim()
    .min(1, { message: `${field} is required` })
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), {
      message: `${field} must be a valid number`,
    })
    .refine((val) => Number.isFinite(val), {
      message: `${field} must be finite`,
    });
}
