import { useQuery } from '@tanstack/react-query'
import { getWeather } from '@/features/weather/api/get-weather'
import type { z } from 'zod'
import { WeatherResponseSchema } from '@/lib/weather/schemas/weather.schema'

type WeatherResponse = z.infer<typeof WeatherResponseSchema>

export function useWeather(lat: number, lon: number) {
  return useQuery<WeatherResponse>({
    queryKey: ['weather', lat.toFixed(3), lon.toFixed(3)],
    queryFn: () => getWeather(lat, lon),
    enabled: Number.isFinite(lat) && Number.isFinite(lon),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}