import { describe, it, expect, vi } from 'vitest'
import { logger } from '@/lib/logger'

describe('logger', () => {
  it('should log info', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    logger.info('test', { key: 'value' })

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('should log error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    logger.error('error_test', { key: 'value' })

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})