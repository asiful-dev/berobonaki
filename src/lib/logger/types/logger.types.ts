export type LogLevel = 'info' | 'warn' | 'error'

export type LogMeta = Record<string, unknown> & {
  requestId?: string
}