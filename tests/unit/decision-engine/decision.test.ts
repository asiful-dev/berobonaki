import { describe, it, expect } from 'vitest'
import { calculateRainRisk } from '@/lib/decision-engine'

describe('decision engine', () => {
  it('should return high risk', () => {
    const result = calculateRainRisk({
      rain1h: 10,
      humidity: 90,
      windSpeed: 30,
      condition: 'Rain',
    })
    expect(result.riskLevel).toBe('high')
  })

  it('should return low risk', () => {
    const result = calculateRainRisk({
      rain1h: 0,
      humidity: 30,
      windSpeed: 2,
      condition: 'Clear',
    })
    expect(result.riskLevel).toBe('low')
  })

  it('should include breakdown', () => {
    const result = calculateRainRisk({
      rain1h: 2,
      humidity: 60,
      windSpeed: 5,
      condition: 'Clouds',
    })
    expect(result.breakdown).toBeDefined()
  })
  it('should return moderate risk', () => {
    const result = calculateRainRisk({
      rain1h: 5,
      humidity: 70,
      windSpeed: 5,
      condition: 'Light rain',
    })

    expect(result.riskLevel).toBe('moderate')
  })

  it('should handle edge cases', () => {
    const result = calculateRainRisk({
      rain1h: 0,
      humidity: 0,
      windSpeed: 0,
      condition: 'Clear',
    })

    expect(result.riskLevel).toBe('low')
  })

  it('should calculate score correctly', () => {
    const result = calculateRainRisk({
      rain1h: 5,
      humidity: 80,
      windSpeed: 10,
      condition: 'Rain',
    })

    // Expected breakdown:
    // rainIntensityScore = 5 * 10 = 50
    // humidityScore = 80 * 0.3 = 24
    // windScore = 10 * 2 = 20
    // conditionScore = 80
    //
    // total = (50*0.4) + (24*0.2) + (20*0.2) + (80*0.2)
    // total = 20 + 4.8 + 4 + 16 = 44.8
    expect(result.score).toBe(44.8)
  })

  it('should return correct recommendation', () => {
    const result = calculateRainRisk({
      rain1h: 5,
      humidity: 80,
      windSpeed: 10,
      condition: 'Rain',
    })

    expect(result.recommendation).toBe('Carry an umbrella')
  })
})