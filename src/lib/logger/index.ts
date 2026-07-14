import type { LogLevel, LogMeta } from './types/logger.types'

function serializeMeta(meta?: LogMeta): LogMeta | undefined {
  if (!meta) return undefined

  const serialized: LogMeta = {}

  for (const key in meta) {
    const value = meta[key]

    if (value instanceof Error) {
      serialized[key] = {
        message: value.message,
        stack: value.stack,
        name: value.name,
      }
    } else {
      serialized[key] = value
    }
  }

  return serialized
}

function log(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...serializeMeta(meta),
  }

  const serialized = JSON.stringify(payload)

  if (level === 'error') {
    console.error(serialized)
    return
  }

  if (level === 'warn') {
    console.warn(serialized)
    return
  }

  console.log(serialized)
}

export const logger = {
  info: (message: string, meta?: LogMeta) =>
    log('info', message, meta),

  warn: (message: string, meta?: LogMeta) =>
    log('warn', message, meta),

  error: (message: string, meta?: LogMeta) =>
    log('error', message, meta),
}