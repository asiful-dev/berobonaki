import { getRedisClient } from '../redis/client'
import type { NormalizedWeather } from '../weather/types/weather.types'

const TTL_SECONDS = 300

function getCacheKey(lat: number, lon: number): string {
  return `weather:${lat}:${lon}`
}

export async function getCachedWeather(
  lat: number,
  lon: number
): Promise<NormalizedWeather | null> {
  const redis = getRedisClient()

  const data = await redis.get<NormalizedWeather>(
    getCacheKey(lat, lon)
  )

  return data ?? null
}

export async function setCachedWeather(
  lat: number,
  lon: number,
  weather: NormalizedWeather
): Promise<void> {
  const redis = getRedisClient()

  await redis.set(getCacheKey(lat, lon), weather, {
    ex: TTL_SECONDS,
  })
}