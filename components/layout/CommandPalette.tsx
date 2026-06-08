'use client'
import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clapperboard, FileText, Hash, Film, ArrowRight, Loader2, X } from 'lucide-react'
import { NICHE_LABELS } from '@/lib/constants'

type ResultType = 'scenario' | 'script' | 'prompt'

type SearchResult = {
  id: string
  type: ResultType
  title: string
  sub: string
  href: string
  niche?: string
  status?: string
}

async function globalSearch(q: string): Promise<SearchResult[]> {
  if (!q.trim()) return []
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
  if (!res.ok) return []
  return res.json()
}

const TYPE_ICONS: Record<ResultType, React.ElementType> = {
  scenario: Clapperboard,
  script:   FileText,
  prompt:   Hash,
}

const STATUS_COLORS: Record<string, string> = {
  published:     'text-emerald-400',
  in_production: 'text-amber-400',
  draft:         'text-brand-500',
}

export function CommandPalette() {
  const router  = useRouter()
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState(0)
  const [, startTransition]   = useTransition()
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery(''); setResults([]); setSelected(0)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const r = await globalSearch(query)
        setResults(r)
        setSelected(0)
        setLoading(false)
      })
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  // Arrow key nav
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) {
        router.push(results[selected].href)
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, selected, router])

  if (!open) {
    return (
      <>
        {/* Desktop: full search bar */}
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-brand-500 hover:text-brand-300 hover:border-white/[0.14] transition-all"
        >
          <Search size={12} />
          <span>Search…</span>
          <kbd className="ml-2 text-[10px] bg-white/[0.06] border border-white/[0.1] rounded px-1.5 py-0.5 font-mono text-brand-600">⌘K</kbd>
        </button>
        {/* Mobile: icon only */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg border border-white/[0.08] text-brand-500 hover:text-brand-300 hover:border-white/[0.14] transition-all"
        >
          <Search size={16} />
        </button>
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-[#0D1117] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
          {loading
            ? <Loader2 size={15} className="text-brand-500 shrink-0 animate-spin" />
            : <Search size={15} className="text-brand-500 shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search scenarios, scripts, prompts…"
            className="flex-1 bg-transparent text-sm text-white placeholder-brand-600 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }}
              className="text-brand-600 hover:text-brand-300 transition-colors shrink-0">
              <X size={14} />
            </button>
          )}
          <kbd className="text-[10px] bg-white/[0.05] border border-white/[0.08] rounded px-1.5 py-0.5 font-mono text-brand-600 shrink-0">Esc</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto py-2">
            {/* Group by type */}
            {(['scenario', 'script', 'prompt'] as ResultType[]).map(type => {
              const group = results.filter(r => r.type === type)
              if (!group.length) return null
              const Icon = TYPE_ICONS[type]
              return (
                <div key={type}>
                  <div className="px-4 py-1.5 flex items-center gap-2">
                    <Icon size={10} className="text-brand-600" />
                    <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">
                      {type === 'scenario' ? 'Scenarios' : type === 'script' ? 'Scripts' : 'Prompts'}
                    </span>
                  </div>
                  {group.map(r => {
                    const idx = results.indexOf(r)
                    const isSelected = idx === selected
                    const RIcon = TYPE_ICONS[r.type]
                    return (
                      <button key={r.id} onClick={() => { router.push(r.href); setOpen(false) }}
                        onMouseEnter={() => setSelected(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? 'bg-accent/10' : 'hover:bg-white/[0.03]'}`}>
                        <div className={`w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0`}>
                          <RIcon size={12} className="text-brand-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{r.title}</p>
                          <p className="text-[11px] text-brand-500 truncate">{r.sub}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {r.niche && (
                            <span className="text-[10px] text-brand-500 hidden sm:block">
                              {NICHE_LABELS[r.niche] ?? r.niche}
                            </span>
                          )}
                          {r.status && (
                            <span className={`text-[10px] font-medium ${STATUS_COLORS[r.status] ?? 'text-brand-500'}`}>
                              {r.status.replace('_', ' ')}
                            </span>
                          )}
                          {isSelected && <ArrowRight size={12} className="text-accent" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {query && !loading && results.length === 0 && (
          <div className="flex flex-col items-center py-10 gap-2">
            <Film size={20} className="text-brand-700" />
            <p className="text-sm text-brand-500">No results for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {/* Hint */}
        {!query && (
          <div className="px-4 py-6 text-center">
            <p className="text-[11px] text-brand-600">Type to search across all scenarios, scripts and prompts</p>
          </div>
        )}

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-4">
            <span className="text-[10px] text-brand-700 flex items-center gap-1"><kbd className="font-mono bg-white/[0.05] border border-white/[0.08] rounded px-1 py-0.5">↑↓</kbd> navigate</span>
            <span className="text-[10px] text-brand-700 flex items-center gap-1"><kbd className="font-mono bg-white/[0.05] border border-white/[0.08] rounded px-1 py-0.5">↵</kbd> open</span>
            <span className="text-[10px] text-brand-700 ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  )
}
