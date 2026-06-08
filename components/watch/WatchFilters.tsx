'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { NICHE_LABELS } from '@/lib/constants'

interface Props {
  allNiches: string[]
}

export function WatchFilters({ allNiches }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeNiche = searchParams.get('niche') ?? ''
  const activeQ = searchParams.get('q') ?? ''

  const navigate = useCallback((niche: string, q?: string) => {
    const sp = new URLSearchParams()
    if (niche) sp.set('niche', niche)
    if (q) sp.set('q', q)
    const qs = sp.toString()
    router.push(`/watch${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router])

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.05]"
      style={{ background: 'rgba(6,8,15,0.85)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2">
        {/* All pill */}
        <button
          onClick={() => navigate('')}
          className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
            !activeNiche
              ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
              : 'text-white/30 border-white/[0.06] hover:border-white/[0.1] hover:text-white/50'
          }`}
        >
          All
        </button>

        {/* Niche pills */}
        {allNiches.map(niche => (
          <button
            key={niche}
            onClick={() => navigate(niche, activeQ || undefined)}
            className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              activeNiche === niche
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                : 'text-white/30 border-white/[0.06] hover:border-white/[0.1] hover:text-white/50'
            }`}
          >
            {NICHE_LABELS[niche] ?? niche}
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              defaultValue={activeQ}
              placeholder="Search…"
              onChange={e => {
                const val = e.target.value
                if (val === '') navigate(activeNiche)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigate(activeNiche, (e.target as HTMLInputElement).value || undefined)
                }
              }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-full pl-8 pr-4 py-1.5 text-[12px] text-white/60 placeholder-white/20 w-40 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.06] focus:w-52 transition-all"
            />
          </div>
          {(activeNiche || activeQ) && (
            <button
              onClick={() => navigate('')}
              className="text-[10px] text-white/25 hover:text-white/50 transition-colors px-2 py-1 rounded-full border border-white/[0.05] hover:border-white/[0.1]"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
