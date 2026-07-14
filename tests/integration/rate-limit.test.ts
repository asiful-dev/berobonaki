import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/weather/route'
import { getRedisClient } from '@/lib/redis/client'

describe('rate limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should block after limit', async () => {
    const redis = getRedisClient()

    let count = 0
    vi.mocked(redis.incr).mockImplementation(async () => {
      count++
      return count
    })

    vi.mocked(redis.get).mockResolvedValue({
      temperature: 30,
      feelsLike: 32,
      humidity: 80,
      windSpeed: 10,
      condition: 'Rain',
      description: 'light rain',
      rain1h: 5,
    })

    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 })
    )
    const url =
      'http://localhost:3000/api/weather?lat=23.8&lon=90.4'

    let lastResponse: Response | null = null

    for (let i = 0; i < 25; i++) {
      lastResponse = await GET(new Request(url))
    }

    expect(lastResponse?.status).toBe(429)
  })
})