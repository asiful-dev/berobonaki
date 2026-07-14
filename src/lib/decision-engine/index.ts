import { rainInputSchema } from './schemas/rain.schema'
import {
  calculateRainIntensityScore,
  calculateHumidityScore,
  calculateWindScore,
  calculateConditionScore,
} from './scoring'
import type {
  RainDecision,
  RainScoreBreakdown,
} from './types/decision.types'

export function calculateRainRisk(input: unknown): RainDecision {
  const parsed = rainInputSchema.parse(input)

  const rainIntensityScore = calculateRainIntensityScore(parsed.rain1h)
  const humidityScore = calculateHumidityScore(parsed.humidity)
  const windScore = calculateWindScore(parsed.windSpeed)
  const conditionScore = calculateConditionScore(parsed.condition)

  const totalScore =
    rainIntensityScore * 0.4 +
    humidityScore * 0.2 +
    windScore * 0.2 +
    conditionScore * 0.2

  let riskLevel: RainDecision['riskLevel']
  let recommendation: string

  if (totalScore >= 70) {
    riskLevel = 'high'
    recommendation = 'Avoid going outside without protection'
  } else if (totalScore >= 40) {
    riskLevel = 'moderate'
    recommendation = 'Carry an umbrella'
  } else {
    riskLevel = 'low'
    recommendation = 'Safe to go outside'
  }

  const breakdown: RainScoreBreakdown = {
    rainIntensityScore,
    humidityScore,
    windScore,
    conditionScore,
  }

  return {
    score: Number(totalScore.toFixed(2)),
    riskLevel,
    recommendation,
    breakdown,
  }
}