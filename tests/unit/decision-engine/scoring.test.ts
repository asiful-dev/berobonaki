import { describe, it, expect } from 'vitest'
import {
  calculateRainIntensityScore,
  calculateHumidityScore,
  calculateWindScore,
  calculateConditionScore,
} from '@/lib/decision-engine/scoring'

describe('scoring functions', () => {
  it('should calculate rain intensity score', () => {
    expect(calculateRainIntensityScore(5)).toBe(50)
  })

  it('should cap rain intensity score at 100', () => {
    expect(calculateRainIntensityScore(20)).toBe(100)
  })

  it('should calculate humidity score', () => {
    expect(calculateHumidityScore(80)).toBe(24)
  })

  it('should calculate wind score', () => {
    expect(calculateWindScore(10)).toBe(20)
  })

  it('should detect rain condition', () => {
    expect(calculateConditionScore('Rain')).toBe(80)
  })
})