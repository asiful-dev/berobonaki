export type RainInput = {
  rain1h: number
  humidity: number
  windSpeed: number
  condition: string
}

export type RainScoreBreakdown = {
  rainIntensityScore: number
  humidityScore: number
  windScore: number
  conditionScore: number
}

export type RainDecision = {
  score: number
  riskLevel: "low" | "moderate" | "high";
  recommendation: string;
  breakdown: RainScoreBreakdown;
};