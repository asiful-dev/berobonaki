import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getWeather } from "@/features/weather/api/get-weather";
import type { z } from "zod";
import { WeatherResponseSchema } from "@/lib/weather/schemas/weather.schema";

type WeatherResponse = z.infer<typeof WeatherResponseSchema>;

function normalizeCoord(value: number) {
  if (!Number.isFinite(value)) return NaN;
  return Number(value.toFixed(3));
}

export function useWeather(lat: number, lon: number) {
  const normalizedLat = normalizeCoord(lat);
  const normalizedLon = normalizeCoord(lon);

  return useQuery<WeatherResponse>({
    queryKey: ["weather", normalizedLat, normalizedLon],
    queryFn: () => getWeather(normalizedLat, normalizedLon),

    enabled: Number.isFinite(normalizedLat) && Number.isFinite(normalizedLon),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    placeholderData: keepPreviousData,

    retry: (failureCount, error) => {
      if (error instanceof Error) {
        if (error.message.includes("400")) return false;
        if (error.message.includes("429")) return false;
      }
      return failureCount < 2;
    },
  });
}
