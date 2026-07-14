import { z } from 'zod'

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

export const WeatherResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    lat: z.number(),
    lon: z.number(),
    weather: z.object({
      temperature: z.number(),
      feelsLike: z.number(),
      humidity: z.number(),
      windSpeed: z.number(),
      condition: z.string(),
      description: z.string(),
      rain1h: z.number(),
    }),
    decision: z.object({
      riskLevel: z.enum(['low', 'moderate', 'high']),
      score: z.number(),
    }),
  }),
})