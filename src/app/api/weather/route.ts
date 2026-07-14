import { locationQuerySchema } from '@/features/location/schemas/location.schema'
import { getQueryParams } from '@/lib/utils/parse-query'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { fetchWeather } from '@/lib/weather/fetch-weather'
import { calculateRainRisk } from '@/lib/decision-engine'

export async function GET(request: Request) {
  try {
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

    const weather = await fetchWeather(lat, lon)
    
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
  } catch (error) {
    console.error('Weather route failed', error)

    const message = error instanceof Error ? error.message : String(error);

    // map known errors
    if (message.includes('timeout')) {
      return errorResponse('Weather service timeout', 504)
    }

    if (message.includes('unavailable')) {
      return errorResponse('Weather service unavailable', 503)
    }

    if (message.includes('Invalid weather API key')) {
      return errorResponse('Server configuration error', 500)
    }

    return errorResponse('Internal server error', 500)
  }
}

export async function POST() {
  return errorResponse('Method not allowed', 405)
}