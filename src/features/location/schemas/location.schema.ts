import { z } from "zod";

import { numberFromInput } from "@/lib/validation/fields/number-from-input";

export const locationQuerySchema = z.object({
  lat: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Latitude must be a valid number",
    })
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90",
    }),

  lon: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Longitude must be a valid number",
    })
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180",
    }),
});

export type LocationQuery = z.infer<typeof locationQuerySchema>;

export const locationInputSchema = z.object({
  lat: numberFromInput("Latitude")
    .refine((val) => val >= -90, {
      message: "Latitude must be >= -90",
    })
    .refine((val) => val <= 90, {
      message: "Latitude must be <= 90",
    }),

  lon: numberFromInput("Longitude")
    .refine((val) => val >= -180, {
      message: "Longitude must be >= -180",
    })
    .refine((val) => val <= 180, {
      message: "Longitude must be <= 180",
    }),
});

export type LocationInput = z.infer<typeof locationInputSchema>;
