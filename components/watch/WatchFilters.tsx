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
    <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.05] bg-black/70">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {/* All pill */}
        <button
          onClick={() => navigate('')}
          className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
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
            className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
              activeNiche === niche
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                : 'text-white/30 border-white/[0.06] hover:border-white/[0.1] hover:text-white/50'
            }`}
          >
            {NICHE_LABELS[niche] ?? niche}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1 min-w-4 shrink-0" />

        {/* Search */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              defaultValue={activeQ}
              placeholder="Search…"
              onChange={e => {
                if (e.target.value === '') navigate(activeNiche)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigate(activeNiche, (e.target as HTMLInputElement).value || undefined)
                }
              }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-full pl-8 pr-4 py-1.5 text-[12px] text-white/60 placeholder-white/20 w-32 sm:w-40 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.06] focus:w-44 sm:focus:w-52 transition-all"
            />
          </div>
          {(activeNiche || activeQ) && (
            <button
              onClick={() => navigate('')}
              className="text-[10px] text-white/25 hover:text-white/50 transition-colors px-2 py-1 rounded-full border border-white/[0.05] hover:border-white/[0.1] shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
