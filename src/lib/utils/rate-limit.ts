const rateLimit = new Map<string, { count: number; timestamp: number }>()

export function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || now - entry.timestamp > windowMs) {
    rateLimit.set(key, { count: 1, timestamp: now })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
