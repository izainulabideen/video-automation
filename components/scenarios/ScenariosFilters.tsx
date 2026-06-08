'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { Search } from 'lucide-react'

const statuses = [
  { value: '',              label: 'All' },
  { value: 'draft',         label: 'Draft' },
  { value: 'in_production', label: 'In Production' },
  { value: 'published',     label: 'Published' },
]

const sortColumns = [
  { key: 'created_at', label: 'Date ↓' },
  { key: 'title',      label: 'Title' },
  { key: 'status',     label: 'Status' },
  { key: 'niche',      label: 'Niche' },
]

export function ScenariosFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const activeStatus = searchParams.get('status') ?? ''
  const activeSort   = searchParams.get('sort') ?? 'created_at'
  const activeQ      = searchParams.get('q') ?? ''

  const navigate = useCallback((overrides: { status?: string; sort?: string; q?: string }) => {
    const sp = new URLSearchParams()
    const status = overrides.status ?? activeStatus
    const sort   = overrides.sort   ?? activeSort
    const q      = overrides.q      !== undefined ? overrides.q : activeQ
    if (status) sp.set('status', status)
    if (sort && sort !== 'created_at') sp.set('sort', sort)
    if (q) sp.set('q', q)
    const qs = sp.toString()
    router.push(`/scenarios${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router, activeStatus, activeSort, activeQ])

  return (
    <div className="space-y-3 mb-5">
      {/* Status + search row */}
      <div className="flex items-center gap-2 flex-wrap">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => navigate({ status: s.value })}
            className={`text-[12px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeStatus === s.value
                ? 'bg-accent/15 text-accent border-accent/30 font-medium'
                : 'border-white/[0.08] text-brand-400 hover:bg-white/[0.04] hover:text-brand-200'
            }`}
          >
            {s.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" />
            <input
              ref={inputRef}
              type="text"
              defaultValue={activeQ}
              placeholder="Search stories…"
              onChange={e => { if (e.target.value === '') navigate({ q: '' }) }}
              onKeyDown={e => {
                if (e.key === 'Enter') navigate({ q: (e.target as HTMLInputElement).value })
              }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-brand-200 placeholder-brand-500 w-44 focus:border-accent/40 focus:bg-white/[0.06] focus:w-56 outline-none transition-all"
            />
          </div>
          {(activeStatus || activeQ) && (
            <button
              onClick={() => { navigate({ status: '', q: '' }); if (inputRef.current) inputRef.current.value = '' }}
              className="text-[11px] text-brand-500 hover:text-brand-300 border border-white/[0.06] hover:border-white/[0.1] px-2.5 py-1.5 rounded-lg transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-brand-600 mr-1">Sort:</span>
        {sortColumns.map(col => (
          <button
            key={col.key}
            onClick={() => navigate({ sort: col.key })}
            className={`text-[11px] px-3 py-1 rounded-full border transition-all cursor-pointer ${
              activeSort === col.key
                ? 'text-accent border-accent/30 bg-accent/10 font-medium'
                : 'text-brand-500 border-white/[0.06] hover:border-white/[0.1] hover:text-brand-300'
            }`}
          >
            {col.label}
          </button>
        ))}
      </div>
    </div>
  )
}
