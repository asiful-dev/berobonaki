import { loadEnvConfig } from "@next/env";
import { vi } from "vitest";

process.env.NODE_ENV = "development";
loadEnvConfig(process.cwd());

vi.mock('@/lib/redis/client', () => {
  const mockRedis = {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
  }
  return {
    getRedisClient: vi.fn(() => mockRedis)
  }
});
