import { NormalizedWeather } from '@/lib/weather/types/weather.types'
import { RainDecision } from '@/lib/decision-engine/types/decision.types'

export type WeatherSuccessResponse = {
  status: 'ok'
  data: {
    lat: number
    lon: number
    weather: NormalizedWeather
    decision: RainDecision
  }
}

export type WeatherErrorResponse = {
  status: 'error'
  message: string
  errors?: Record<string, string[]>
}