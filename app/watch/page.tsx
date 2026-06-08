import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { NICHE_LABELS, NICHE_COLORS } from '@/lib/constants'
import { WatchFilters } from '@/components/watch/WatchFilters'

export const revalidate = 300

const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<{ niche?: string; q?: string; page?: string }>
}

export default async function WatchPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const supabase = createAdminClient()

  let query = supabase
    .from('public_settings')
    .select('scenario_id, scenarios(id, title, niche, hook, created_at, status)')
    .eq('is_public', true)
    .order('scenario_id')

  if (params.niche) {
    query = query.eq('scenarios.niche' as never, params.niche as never)
  }

  const { data: rows } = await query

  type ScenarioRow = { id: string; title: string; niche: string; hook: string; created_at: string; status: string }
  let scenarios = (rows ?? [])
    .flatMap(r => (Array.isArray(r.scenarios) ? r.scenarios : r.scenarios ? [r.scenarios] : []))
    .filter(Boolean) as ScenarioRow[]

  // Client-side niche filter (in case the join filter above doesn't work for all Supabase versions)
  if (params.niche) {
    scenarios = scenarios.filter(s => s.niche === params.niche)
  }

  // Title search filter
  if (params.q) {
    const q = params.q.toLowerCase()
    scenarios = scenarios.filter(s => s.title.toLowerCase().includes(q))
  }

  const totalScenarios = scenarios.length
  const totalPages = Math.ceil(totalScenarios / PAGE_SIZE)
  const paginatedScenarios = scenarios.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const published = paginatedScenarios.filter(s => s.status === 'published')
  const upcoming  = paginatedScenarios.filter(s => s.status !== 'published')

  // Build niche pills from the full unfiltered set for nav
  const { data: allRows } = await supabase
    .from('public_settings')
    .select('scenario_id, scenarios(niche)')
    .eq('is_public', true)

  const allNiches = Array.from(new Set(
    (allRows ?? [])
      .flatMap(r => (Array.isArray(r.scenarios) ? r.scenarios : r.scenarios ? [r.scenarios] : []))
      .filter(Boolean)
      .map((s: { niche: string }) => s.niche)
      .filter(Boolean)
  ))

  return (
    <div className="min-h-screen bg-[#06080F] text-white selection:bg-amber-400/20 selection:text-amber-200">

      {/* ── Film grain overlay ── */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-white/[0.04] transition-all"
        style={{ background: 'rgba(6,8,15,0.8)' }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="text-[13px] font-bold tracking-tight text-white">Veank</span>
        </div>
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/30">Finance · Education</span>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">

        {/* Background glow pools */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #92400e 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #1c1917 0%, transparent 70%)' }} />

        {/* Horizontal rule */}
        <div className="relative z-10 flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-amber-400/40" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-amber-400/60 font-medium">Veank Studio</span>
          <div className="w-12 h-px bg-amber-400/40" />
        </div>

        {/* Giant headline */}
        <h1 className="relative z-10 font-black leading-[0.92] tracking-[-0.04em] mb-8"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}>
          <span className="block text-white">Finance</span>
          <span className="block" style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 40%, #92400e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Stories</span>
        </h1>

        <p className="relative z-10 text-white/40 text-lg max-w-sm mx-auto leading-relaxed font-light tracking-wide">
          Cinematic education.<br />Real insights, no noise.
        </p>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/60" />
          <span className="text-[9px] tracking-[0.35em] uppercase text-white/50">Scroll</span>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <WatchFilters allNiches={allNiches} />

      {/* ── Published content ── */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        {!scenarios.length ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.06] flex items-center justify-center">
              <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/20 text-sm tracking-widest uppercase">No content yet</p>
          </div>
        ) : (
          <>
            {published.length > 0 && (
              <div className="mb-20">
                {/* Section label */}
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/30">Available Now</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                  <span className="text-[10px] text-white/20">{published.length} stories</span>
                </div>

                {/* Featured first card — large */}
                {published[0] && (
                  <Link href={`/watch/${published[0].id}`}
                    className="group relative block mb-4 rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/20 transition-all duration-500">
                    <div className="aspect-[21/7] bg-gradient-to-br from-[#0f0c05] via-[#1a130a] to-[#06080F] relative overflow-hidden flex items-end p-10">
                      {/* Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(180,100,10,0.12) 0%, transparent 60%)' }} />
                      {/* Play button */}
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm bg-white/[0.03] group-hover:scale-110 group-hover:border-amber-400/30 transition-all duration-300">
                        <svg className="w-6 h-6 text-white/40 group-hover:text-amber-400 ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <p className="text-[10px] tracking-[0.35em] uppercase text-amber-400/60 mb-3">
                          {NICHE_LABELS[published[0].niche] ?? published[0].niche}
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-2xl group-hover:text-amber-50 transition-colors">
                          {published[0].title}
                        </h2>
                        <p className="mt-3 text-white/30 text-base max-w-xl leading-relaxed">{published[0].hook}</p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Remaining grid */}
                {published.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {published.slice(1).map(s => (
                      <StoryCard key={s.id} s={s} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {upcoming.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/20">Coming Soon</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcoming.map(s => (
                    <StoryCard key={s.id} s={s} dimmed />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-12">
          {page > 1 && (
            <a href={`/watch?${new URLSearchParams({ ...(params.niche ? { niche: params.niche } : {}), ...(params.q ? { q: params.q } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white hover:border-amber-400/25 transition-all">
              ← Prev
            </a>
          )}
          <span className="text-[11px] text-white/20">{page} / {totalPages}</span>
          {page < totalPages && (
            <a href={`/watch?${new URLSearchParams({ ...(params.niche ? { niche: params.niche } : {}), ...(params.q ? { q: params.q } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white hover:border-amber-400/25 transition-all">
              Next →
            </a>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-12 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="text-[11px] text-white/30 tracking-wider">Veank Studio</span>
          </div>
          <p className="text-[10px] text-white/15 tracking-widest uppercase">Finance · Education · {new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  )
}

function StoryCard({ s, dimmed }: { s: { id: string; title: string; niche: string; hook: string; status: string }; dimmed?: boolean }) {
  return (
    <Link href={`/watch/${s.id}`}
      className={`group relative block rounded-2xl overflow-hidden border border-white/[0.05] hover:border-amber-400/15 transition-all duration-400 ${dimmed ? 'opacity-50' : ''}`}>
      {/* Thumbnail area */}
      <div className="aspect-video bg-gradient-to-br from-[#0d0a05] to-[#06080F] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(161,87,10,0.08) 0%, transparent 70%)' }} />

        {/* Diagonal line pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        {s.status === 'published' ? (
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm bg-black/20">
            <svg className="w-4 h-4 text-amber-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        ) : (
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/15">Soon</span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 bg-[#08090E]">
        <p className={`text-[10px] tracking-[0.3em] uppercase mb-2 ${NICHE_COLORS[s.niche] ?? 'text-amber-400/50'} opacity-50`}>
          {NICHE_LABELS[s.niche] ?? s.niche}
        </p>
        <h3 className="text-white/90 font-bold text-[15px] leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
          {s.title}
        </h3>
        <p className="text-white/25 text-xs leading-relaxed line-clamp-2">{s.hook}</p>
      </div>

      {/* Bottom border reveal */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  )
}
