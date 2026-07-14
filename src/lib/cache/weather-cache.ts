import { getRedisClient } from '../redis/client'
import type { NormalizedWeather } from '../weather/types/weather.types'
import { logger } from '../logger'

const TTL_SECONDS = 300

function normalizeCoord(value: number): number {
  return Number(value.toFixed(3))
}

function getCacheKey(lat: number, lon: number): string {
  const nLat = normalizeCoord(lat)
  const nLon = normalizeCoord(lon)
  return `weather:${nLat}:${nLon}`
}


export async function getCachedWeather(
  lat: number,
  lon: number,
  requestId?: string
): Promise<NormalizedWeather | null> {
  try {
    const redis = getRedisClient()

    const data = await redis.get<NormalizedWeather>(
      getCacheKey(lat, lon)
    )

    if (data) {
      logger.info('cache_hit', { requestId, lat, lon })
    } else {
      logger.info('cache_miss', { requestId, lat, lon })
    }

    return data ?? null
  } catch (error: unknown) {
    logger.error('redis_cache_error', { requestId, error })
    return null
  }
}

export async function setCachedWeather(
  lat: number,
  lon: number,
  weather: NormalizedWeather,
  requestId?: string
): Promise<void> {
  try {
    const redis = getRedisClient()

    await redis.set(getCacheKey(lat, lon), weather, {
      ex: TTL_SECONDS,
    })
  } catch (error: unknown) {
    logger.error('redis_cache_error', { requestId, error })
  }
}