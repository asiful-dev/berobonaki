import { getRedisClient } from '../redis/client'

const WINDOW_SIZE = 60
const MAX_REQUESTS = 20

export async function rateLimit(ip: string): Promise<boolean> {
  try {
    const redis = getRedisClient()

    const key = ip === 'unknown' ? 'rate:global' : `rate:${ip}`

    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, WINDOW_SIZE)
    }

    return current <= MAX_REQUESTS
  } catch (error: unknown) {
    console.error('Rate limit failed, allowing request', error)

    // fail open: never block user due to infra failure
    return true
  }
}