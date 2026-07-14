import { WeatherApiResponse } from './schemas/weather.schema'
import { NormalizedWeather } from './types/weather.types'

export function normalizeWeather(data: WeatherApiResponse): NormalizedWeather {
  const weather = data.current.weather?.[0]

  return {
    temperature: data.current.temp,
    feelsLike: data.current.feels_like,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_speed,
    condition: weather?.main ?? 'Unknown',
    description: weather?.description ?? 'Unknown',
    rain1h: data.current.rain?.['1h'] ?? 0,
  }
}