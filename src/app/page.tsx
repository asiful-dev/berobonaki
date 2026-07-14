'use client'

import { useState } from 'react'
import { LocationInput } from '@/features/weather/components/location-input'
import { WeatherCard } from '@/features/weather/components/weather-card'

export default function HomePage() {
  const [coords, setCoords] = useState<{
    lat: number
    lon: number
  } | null>(null)

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Weather Risk Analyzer
      </h1>

      <LocationInput
        onSubmit={(lat, lon) =>
          setCoords({ lat, lon })
        }
      />

      {coords && (
        <WeatherCard
          lat={coords.lat}
          lon={coords.lon}
        />
      )}
    </main>
  )
}