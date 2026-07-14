import { locationQuerySchema } from '@/features/location/schemas/location.schema'
import { getQueryParams } from '@/lib/utils/parse-query'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { fetchWeather } from '@/lib/weather/fetch-weather'
import { calculateRainRisk } from '@/lib/decision-engine'
import { getCachedWeather, setCachedWeather } from '@/lib/cache/weather-cache'
import { rateLimit } from '@/lib/rate-limit/rate-limit'
import { getClientIp } from '@/lib/utils/get-ip'
import { logger } from '@/lib/logger'
import { generateRequestId } from '@/lib/utils/request-id'

export async function GET(request: Request) {
  const requestId = generateRequestId()
  const start = Date.now()

  try {
    const ip = getClientIp(request)

    logger.info('weather_request_received', {
      requestId,
      ip,
      url: request.url,
    })

    const allowed = await rateLimit(ip, requestId)

    if (!allowed) {
      return errorResponse('Too many requests', 429)
    }

    const rawParams = getQueryParams(request.url)

    if (!rawParams.lat || !rawParams.lon) {
      return errorResponse(
        'Missing required query parameters: lat and lon',
        400
      )
    }

    const parsed = locationQuerySchema.safeParse(rawParams)

    if (!parsed.success) {
      return errorResponse(
        'Invalid query parameters',
        400,
        parsed.error.flatten().fieldErrors
      )
    }

    const { lat, lon } = parsed.data

    let weather = await getCachedWeather(lat, lon, requestId)

    if (!weather) {
      weather = await fetchWeather(lat, lon, requestId)
      setCachedWeather(lat, lon, weather, requestId).catch((e) => 
        logger.error('cache_set_failed', { requestId, error: e })
      )
    }

    const decision = calculateRainRisk({
      rain1h: weather.rain1h,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      condition: weather.condition,
    })

    const duration = Date.now() - start

    logger.info('weather_request_completed', {
      requestId,
      duration,
    })

    return successResponse({
      lat,
      lon,
      weather,
      decision,
    })
  } catch (error: unknown) {
    const duration = Date.now() - start

    logger.error('weather_request_failed', {
      requestId,
      duration,
      error,
    })

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return errorResponse('Weather service timeout', 504)
      }

      if (error.message.includes('unavailable')) {
        return errorResponse('Weather service unavailable', 503)
      }
    }

    return errorResponse('Internal server error', 500)
  }
}

export async function POST() {
  return errorResponse('Method not allowed', 405)
}