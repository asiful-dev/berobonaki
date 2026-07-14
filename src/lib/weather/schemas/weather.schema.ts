import { z } from "zod";

export const weatherApiResponseSchema = z.object({
  current: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
    wind_speed: z.number(),
    weather: z.array(
      z.object({
        main: z.string(),
        description: z.string(),
      }),
    ),
    rain: z
      .object({
        "1h": z.number().optional(),
      })
      .optional(),
  }),
});

export type WeatherApiResponse = z.infer<typeof weatherApiResponseSchema>;
