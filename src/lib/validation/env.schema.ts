import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  // Weather API
  WEATHER_API_KEY: z.string().min(1, "WEATHER_API_KEY is required"),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Optional (if you add later)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
