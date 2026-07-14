'use client'

import { useState } from 'react'
import { locationInputSchema } from '@/features/location/schemas/location.schema'

export function LocationInput({
  onSubmit,
}: {
  onSubmit: (lat: number, lon: number) => void
}) {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    const parsed = locationInputSchema.safeParse({
      lat: Number(lat),
      lon: Number(lon),
    })

    if (!parsed.success) {
      setError('Invalid latitude or longitude')
      return
    }

    setError(null)
    onSubmit(parsed.data.lat, parsed.data.lon)
  }

  return (
    <div className="space-y-2">
      <input
        placeholder="Latitude (-90 to 90)"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        placeholder="Longitude (-180 to 180)"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        className="border p-2 w-full"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Get Weather
      </button>
    </div>
  )
}