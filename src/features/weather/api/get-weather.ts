import { WeatherResponseSchema } from "@/lib/weather/schemas/weather.schema"

export async function getWeather(lat: number, lon: number) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch weather')
  }

  const parsed = WeatherResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw new Error('Invalid API response')
  }

  return parsed.data
}