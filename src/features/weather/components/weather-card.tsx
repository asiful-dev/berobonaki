'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'
import { getRiskColor } from '../utils/risk-style'
import type { UseQueryResult } from '@tanstack/react-query'
import type { z } from 'zod'
import { WeatherResponseSchema } from '@/lib/weather/schemas/weather.schema'

type WeatherResponse = z.infer<typeof WeatherResponseSchema>

export function WeatherCard({
  query,
}: {
  query: UseQueryResult<WeatherResponse>
}) {
  const { data, isLoading, isError, error } = query

  if (isLoading) {
    return (
      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </Card>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        {(error as Error).message}
      </Alert>
    )
  }

  if (!data) {
    return null
  }

  const { weather, decision } = data.data

  return (
    <Card className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">
        Weather Overview
      </h2>

      <p>Temperature: {weather.temperature}°C</p>
      <p>Feels Like: {weather.feelsLike}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.windSpeed} m/s</p>
      <p>Condition: {weather.description}</p>

      <div className="pt-3">
        <p>
          Risk Level:{' '}
          <strong className={getRiskColor(decision.riskLevel)}>
            {decision.riskLevel}
          </strong>
        </p>
        <p>Score: {decision.score.toFixed(2)}</p>
      </div>
    </Card>
  )
}