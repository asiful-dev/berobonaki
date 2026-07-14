export function calculateRainIntensityScore(rain1h: number): number {
  return Math.min(rain1h * 10, 100)
}

export function calculateHumidityScore(humidity: number): number {
  return humidity * 0.3
}

export function calculateWindScore(windSpeed: number): number {
  return Math.min(windSpeed * 2, 100)
}

export function calculateConditionScore(condition: string): number {
  const normalized = condition.toLowerCase()

  if (normalized.includes('rain')) return 80
  if (normalized.includes('storm')) return 90
  if (normalized.includes('drizzle')) return 50

  return 0
}