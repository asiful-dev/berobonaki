import { describe, it, expect } from "vitest";
import { normalizeWeather } from "@/lib/weather/normalize";

describe("normalizeWeather", () => {
  it("should normalize weather data correctly", () => {
    const input = {
      current: {
        temp: 30,
        feels_like: 32,
        humidity: 70,
        wind_speed: 5,
        weather: [{ main: "Rain", description: "light rain" }],
        rain: { "1h": 2 },
      },
    } as unknown as Parameters<typeof normalizeWeather>[0];

    const result = normalizeWeather(input);

    expect(result.temperature).toBe(30);
    expect(result.rain1h).toBe(2);
  });

  it("should fallback rain to 0 if missing", () => {
    const input = {
      current: {
        temp: 30,
        feels_like: 32,
        humidity: 70,
        wind_speed: 5,
        weather: [{ main: "Clear", description: "clear sky" }],
      },
    } as unknown as Parameters<typeof normalizeWeather>[0];

    const result = normalizeWeather(input);

    expect(result.rain1h).toBe(0);
  });
});
