import { getRedisClient } from '../redis/client'
import { logger } from '../logger'

const WINDOW_SIZE = 60
const MAX_REQUESTS = 20

export async function rateLimit(
  ip: string,
  requestId?: string
): Promise<boolean> {
  try {
    const redis = getRedisClient()

    const key = ip === 'unknown' ? 'rate:global' : `rate:${ip}`

    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, WINDOW_SIZE)
    }

    return current <= MAX_REQUESTS
  } catch (error: unknown) {
    logger.error('rate_limit_failed', { requestId, error })
    return true
  }
}