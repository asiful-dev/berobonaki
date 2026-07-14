'use client'

import { useWeather } from '@/features/weather/hooks/use-weather'

export function WeatherCard({
  lat,
  lon,
}: {
  lat: number
  lon: number
}) {
  const { data, isLoading, isError, error } = useWeather(lat, lon)

  if (isLoading) {
    return <div>Loading weather data...</div>
  }

  if (isError) {
    return (
      <div className="text-red-500">
        {(error as Error).message}
      </div>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  const { weather, decision } = data.data

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h2 className="text-xl font-semibold">
        Weather Overview
      </h2>

      <p>Temperature: {weather.temperature}°C</p>
      <p>Feels Like: {weather.feelsLike}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.windSpeed} m/s</p>
      <p>Condition: {weather.description}</p>

      <div className="mt-4">
        <p>
          Risk Level:{' '}
          <strong>{decision.riskLevel}</strong>
        </p>
        <p>Score: {decision.score.toFixed(2)}</p>
      </div>
    </div>
  )
}