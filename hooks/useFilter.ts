import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const getFilter = useCallback((key: string) => {
    return searchParams.get(key) ?? ''
  }, [searchParams])

  return { setFilter, getFilter }
}
