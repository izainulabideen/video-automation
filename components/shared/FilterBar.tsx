'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface FilterBarProps {
  filters: { key: string; label: string; options: { value: string; label: string }[] }[]
  search?: boolean
}

export function FilterBar({ filters, search }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {search && (
        <input
          defaultValue={searchParams.get('q') ?? ''}
          onChange={e => setParam('q', e.target.value)}
          placeholder="Search…"
          className="border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
        />
      )}
      {filters.map(f => (
        <select
          key={f.key}
          value={searchParams.get(f.key) ?? ''}
          onChange={e => setParam(f.key, e.target.value)}
          className="border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="">{f.label}: All</option>
          {f.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
    </div>
  )
}
