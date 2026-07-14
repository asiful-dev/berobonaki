import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/weather/route'
import { getRedisClient } from '@/lib/redis/client'

describe('cache behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use cached data on second request', async () => {
    const redis = getRedisClient()

    vi.mocked(redis.get)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        temperature: 30,
        feelsLike: 32,
        humidity: 80,
        windSpeed: 10,
        condition: 'Rain',
        description: 'light rain',
        rain1h: 5,
      })

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          current: {
            temp: 30,
            feels_like: 32,
            humidity: 80,
            wind_speed: 10,
            weather: [{ main: 'Rain', description: 'light rain' }],
            rain: { '1h': 5 },
          },
        }),
        { status: 200 }
      )
    )

    global.fetch = mockFetch as unknown as typeof fetch

    const url =
      'http://localhost:3000/api/weather?lat=23.8&lon=90.4'

    await GET(new Request(url))
    await GET(new Request(url))

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})