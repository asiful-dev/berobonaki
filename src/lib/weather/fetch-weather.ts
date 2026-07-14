import { env } from "@/config/env"
import { weatherApiResponseSchema } from "./schemas/weather.schema"
import { normalizeWeather } from "./normalize"
import type { NormalizedWeather } from "./types/weather.types"
import { logger } from "@/lib/logger"

async function fetchWithRetry(
  fn: () => Promise<Response>,
  retries = 2
): Promise<Response> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    return fetchWithRetry(fn, retries - 1)
  }
}

export async function fetchWeather(
  lat: number,
  lon: number,
  requestId?: string
): Promise<NormalizedWeather> {

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${env.WEATHER_API_KEY}&units=metric`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  let response: Response

  try {
    response = await fetchWithRetry(() =>
      fetch(url, { signal: controller.signal })
    )
  } catch (error) {
    logger.error('weather_api_timeout', {
      requestId,
      lat,
      lon,
      error,
    })
    throw new Error('Weather API request timeout')
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid weather API key')
    }

    if (response.status >= 500) {
      throw new Error('Weather service unavailable')
    }

    throw new Error('Failed to fetch weather data')
  }

  const json = await response.json()

  const parsed = weatherApiResponseSchema.safeParse(json)

  if (!parsed.success) {
    logger.error('weather_schema_invalid', {
      requestId,
      lat,
      lon,
      errors: parsed.error.flatten(),
    })

    throw new Error('Invalid weather API response')
  }

  logger.info('weather_fetched', {
    requestId,
    lat,
    lon,
  })

  return normalizeWeather(parsed.data)
}