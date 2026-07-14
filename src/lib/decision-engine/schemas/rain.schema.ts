import { z } from 'zod'

export const rainInputSchema = z.object({
  rain1h: z.number().min(0),
  humidity: z.number().min(0).max(100),
  windSpeed: z.number().min(0),
  condition: z.string(),
})

export type RainInputSchema = z.infer<typeof rainInputSchema>