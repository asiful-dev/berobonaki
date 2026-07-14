'use client'

import { useState } from 'react'
import { LocationInput } from '@/features/weather/components/location-input'
import { WeatherCard } from '@/features/weather/components/weather-card'
import { useWeather } from '@/features/weather/hooks/use-weather'

export default function HomePage() {
  const [coords, setCoords] = useState<{
    lat: number
    lon: number
  } | null>(null)

  const query = useWeather(
    coords?.lat ?? NaN,
    coords?.lon ?? NaN
  )

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Weather Risk Analyzer
        </h1>

        <LocationInput
          onSubmit={(lat, lon) =>
            setCoords({ lat, lon })
          }
          isLoading={query.isLoading}
        />
        {!coords && (
  <p className="text-center text-gray-500">
    Enter coordinates to see weather insights
  </p>
)}
        {coords && <WeatherCard query={query} />}
      </div>
    </main>
  )
}