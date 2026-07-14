import { z } from "zod";

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
  lat: z
    .number()
    .min(-90)
    .max(90),
  lon: z
    .number()
    .min(-180)
    .max(180),
})
