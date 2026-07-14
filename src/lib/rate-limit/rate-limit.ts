import { getRedisClient } from '../redis/client'

const WINDOW_SIZE = 60
const MAX_REQUESTS = 20

export async function rateLimit(ip: string): Promise<boolean> {
  const redis = getRedisClient()

  const key = `rate:${ip}`

  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, WINDOW_SIZE)
  }

  return current <= MAX_REQUESTS
}