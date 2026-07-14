import { locationQuerySchema } from '@/features/location/schemas/location.schema'
import { getQueryParams } from '@/lib/utils/parse-query'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { fetchWeather } from '@/lib/weather/fetch-weather'
import { calculateRainRisk } from '@/lib/decision-engine'
import { getCachedWeather, setCachedWeather } from '@/lib/cache/weather-cache'
import { rateLimit } from '@/lib/rate-limit/rate-limit'
import { getClientIp } from '@/lib/utils/get-ip'

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request)

    const allowed = await rateLimit(ip)

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

    let weather = await getCachedWeather(lat, lon)

    if (!weather) {
      weather = await fetchWeather(lat, lon)
      await setCachedWeather(lat, lon, weather)
    }

    const decision = calculateRainRisk({
      rain1h: weather.rain1h,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      condition: weather.condition,
    })

    return successResponse({
      lat,
      lon,
      weather,
      decision,
    })
  } catch (error: unknown) {
    console.error('Weather route failed', error)

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