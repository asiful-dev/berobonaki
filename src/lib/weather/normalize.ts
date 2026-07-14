import { WeatherApiResponse } from "./schemas/weather.schema";
import { NormalizedWeather } from "./types/weather.types";

export function normalizeWeather(data: WeatherApiResponse): NormalizedWeather {
  return {
    temperature: data.current.temp,
    feelsLike: data.current.feels_like,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_speed,
    condition: data.current.weather[0]?.main ?? "Unknown",
    description: data.current.weather[0]?.description ?? "Unknown",
    rain1h: data.current.rain?.["1h"] ?? 0,
  };
}
