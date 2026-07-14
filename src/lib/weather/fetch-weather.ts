import { env } from "@/config/env";
import { weatherApiResponseSchema } from "./schemas/weather.schema";
import { normalizeWeather } from "./normalize";
import type { NormalizedWeather } from "./types/weather.types";

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<NormalizedWeather> {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${env.WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const json = await response.json();

  const parsed = weatherApiResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalid weather API response");
  }

  return normalizeWeather(parsed.data);
}
