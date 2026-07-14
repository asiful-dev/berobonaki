import { Redis } from '@upstash/redis'
import { env } from '@/config/env'

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (redis) return redis

  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  return redis
}