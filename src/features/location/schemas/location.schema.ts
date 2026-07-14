import { z } from "zod";

const requiredNumberFromQuery = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return value;
}, z.coerce.number());

export const locationQuerySchema = z.object({
  lat: requiredNumberFromQuery
    .refine((val) => Number.isFinite(val), {
      message: "Latitude must be a valid number",
    })
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90",
    }),

  lon: requiredNumberFromQuery
    .refine((val) => Number.isFinite(val), {
      message: "Longitude must be a valid number",
    })
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180",
    }),
});
