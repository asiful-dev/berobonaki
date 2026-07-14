export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')

  if (forwarded) {
    const ips = forwarded.split(',')
    return ips[0]?.trim() || 'unknown'
  }

  const realIp = request.headers.get('x-real-ip')

  if (realIp) {
    return realIp
  }

  return 'unknown'
}