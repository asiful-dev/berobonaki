import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/weather/route";

global.fetch = vi.fn();

describe("GET /api/weather", () => {
  it("should return weather data", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temp: 30,
          feels_like: 32,
          humidity: 70,
          wind_speed: 5,
          weather: [{ main: "Rain", description: "light rain" }],
        },
      }),
    });

    const request = new Request(
      "http://localhost:3000/api/weather?lat=23.8&lon=90.4",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.weather.temperature).toBe(30);
  });
});
