export function sanitizeStr(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, maxLen)
}

export function sanitizeUrl(val: unknown): string {
  if (typeof val !== 'string') return ''
  const trimmed = val.trim()
  if (!trimmed) return ''
  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return ''
    return trimmed.slice(0, 2048)
  } catch {
    return ''
  }
}

export function sanitizeInt(val: unknown, min = 0, max = 99999): number | null {
  const n = parseInt(String(val), 10)
  if (isNaN(n)) return null
  return Math.min(max, Math.max(min, n))
}
