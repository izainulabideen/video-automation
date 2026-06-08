import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { WatchFilters } from '@/components/watch/WatchFilters'
import type { BrandTheme } from '@/types/brand'

export const revalidate = 300

const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<{ brand?: string; niche?: string; q?: string; page?: string }>
}

type ScenarioRow = {
  id: string; title: string; niche: string; hook: string
  created_at: string; status: string; brand_id: string | null
}
type BrandRow = {
  id: string; name: string; slug: string; theme_config: BrandTheme
}

export default async function WatchPage({ searchParams }: Props) {
  const params = await searchParams
  const page   = Math.max(1, parseInt(params.page ?? '1', 10))
  const supabase = createAdminClient()

  // Fetch all active brands
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, theme_config')
    .eq('is_active', true)
    .order('name')

  const allBrands: BrandRow[] = brands ?? []

  // Fetch all public scenarios with brand info
  const { data: rows } = await supabase
    .from('public_settings')
    .select('scenario_id, scenarios(id, title, niche, hook, created_at, status, brand_id)')
    .eq('is_public', true)

  let scenarios = ((rows ?? [])
    .flatMap(r => (Array.isArray(r.scenarios) ? r.scenarios : r.scenarios ? [r.scenarios] : []))
    .filter(Boolean)) as ScenarioRow[]

  // Filters
  if (params.brand) scenarios = scenarios.filter(s => {
    const b = allBrands.find(b => b.id === s.brand_id)
    return b?.slug === params.brand
  })
  if (params.niche) scenarios = scenarios.filter(s => s.niche === params.niche)
  if (params.q) {
    const q = params.q.toLowerCase()
    scenarios = scenarios.filter(s => s.title.toLowerCase().includes(q) || s.hook?.toLowerCase().includes(q))
  }

  const totalPages = Math.ceil(scenarios.length / PAGE_SIZE)
  const paginated  = scenarios.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const published  = paginated.filter(s => s.status === 'published')
  const upcoming   = paginated.filter(s => s.status !== 'published')

  // Selected brand for theming
  const activeBrand = params.brand
    ? allBrands.find(b => b.slug === params.brand)
    : null

  const accent   = activeBrand?.theme_config?.accent   ?? '#C8922A'
  const accentH  = activeBrand?.theme_config?.accentH  ?? '#E8B84B'
  const bg       = activeBrand?.theme_config?.bg        ?? '#06080F'
  const tagline  = activeBrand?.theme_config?.tagline   ?? 'Premium · Stories'
  const heroName = activeBrand?.name ?? 'All Stories'

  // All niches from visible scenarios for filter bar
  const allNiches = Array.from(new Set(scenarios.map(s => s.niche).filter(Boolean)))

  // Brand lookup map
  const brandMap = Object.fromEntries(allBrands.map(b => [b.id, b]))

  return (
    <div className="min-h-screen text-white selection:bg-white/10"
      style={{ background: bg }}>

      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-white/[0.04]"
        style={{ background: bg + 'cc' }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accentH})` }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="text-[13px] font-bold tracking-tight text-white">Veank</span>
        </div>

        {/* Brand pills in nav */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link href="/watch"
            className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
            style={!params.brand ? {
              borderColor: accent + '50',
              background: accent + '15',
              color: accentH,
            } : {
              borderColor: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.35)',
            }}>
            All
          </Link>
          {allBrands.map(b => (
            <Link key={b.id}
              href={`/watch?brand=${b.slug}`}
              className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
              style={params.brand === b.slug ? {
                borderColor: b.theme_config.accent + '50',
                background: b.theme_config.accent + '15',
                color: b.theme_config.accentH,
              } : {
                borderColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.35)',
              }}>
              {b.name}
            </Link>
          ))}
        </div>

        <span className="text-[11px] tracking-[0.25em] uppercase text-white/30">{tagline}</span>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-20 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse, ${accent}60 0%, transparent 70%)` }} />

        <div className="relative z-10 flex items-center gap-4 mb-10">
          <div className="w-12 h-px transition-colors" style={{ background: accent + '66' }} />
          <span className="text-[10px] tracking-[0.4em] uppercase font-medium transition-colors" style={{ color: accent + '99' }}>Veank Studio</span>
          <div className="w-12 h-px transition-colors" style={{ background: accent + '66' }} />
        </div>

        <h1 className="relative z-10 font-black leading-[0.92] tracking-[-0.04em] mb-8"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}>
          <span className="block text-white">{activeBrand?.name ?? 'Premium'}</span>
          <span className="block" style={{
            background: `linear-gradient(135deg, ${accentH} 0%, ${accent} 40%, ${accent}88 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Stories</span>
        </h1>

        <p className="relative z-10 text-white/40 text-lg max-w-sm mx-auto leading-relaxed font-light tracking-wide">
          {activeBrand
            ? activeBrand.theme_config.tagline + '.'
            : 'Cinematic education.\nReal insights, no noise.'}
        </p>

        {/* Brand pills (mobile) */}
        {allBrands.length > 1 && (
          <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-10 md:hidden">
            <Link href="/watch"
              className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
              style={!params.brand ? { borderColor: accent + '50', background: accent + '15', color: accentH } : { borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
              All
            </Link>
            {allBrands.map(b => (
              <Link key={b.id} href={`/watch?brand=${b.slug}`}
                className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
                style={params.brand === b.slug ? { borderColor: b.theme_config.accent + '50', background: b.theme_config.accent + '15', color: b.theme_config.accentH } : { borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}>
                {b.name}
              </Link>
            ))}
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/60" />
          <span className="text-[9px] tracking-[0.35em] uppercase text-white/50">Scroll</span>
        </div>
      </section>

      {/* Sticky filter bar */}
      <WatchFilters allNiches={allNiches} />

      {/* Content */}
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
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/30">Available Now</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                  <span className="text-[10px] text-white/20">{published.length} stories</span>
                </div>

                {/* Featured card */}
                {published[0] && (() => {
                  const b = brandMap[published[0].brand_id ?? '']
                  const a = b?.theme_config?.accent ?? accent
                  const aH = b?.theme_config?.accentH ?? accentH
                  return (
                    <Link href={`/watch/${published[0].id}`}
                      className="group relative block mb-4 rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-500"
                      style={{ ['--hover-border' as string]: a + '33' }}
                      onMouseEnter={undefined}>
                      <div className="aspect-[21/7] relative overflow-hidden flex items-end p-10"
                        style={{ background: `linear-gradient(135deg, ${a}18 0%, ${bg} 60%)` }}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{ background: `radial-gradient(ellipse at 30% 50%, ${a}20 0%, transparent 60%)` }} />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm bg-white/[0.03] group-hover:scale-110 transition-all duration-300"
                          style={{ ['--tw-border-opacity' as string]: '1' }}>
                          <svg className="w-6 h-6 ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24" style={{ color: a + '66' }}>
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="relative z-10">
                          {b && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase mb-2 px-2 py-0.5 rounded-full border"
                              style={{ borderColor: a + '30', color: a, background: a + '10' }}>
                              <span className="w-1 h-1 rounded-full" style={{ background: a }} />
                              {b.name}
                            </span>
                          )}
                          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-2xl group-hover:text-white/90 transition-colors mt-2">
                            {published[0].title}
                          </h2>
                          <p className="mt-3 text-white/30 text-base max-w-xl leading-relaxed">{published[0].hook}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `linear-gradient(90deg, transparent, ${aH}50, transparent)` }} />
                      </div>
                    </Link>
                  )
                })()}

                {published.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {published.slice(1).map(s => (
                      <StoryCard key={s.id} s={s} brand={brandMap[s.brand_id ?? '']} defaultAccent={accent} />
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
                    <StoryCard key={s.id} s={s} brand={brandMap[s.brand_id ?? '']} defaultAccent={accent} dimmed />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-12">
          {page > 1 && (
            <a href={`/watch?${new URLSearchParams({ ...(params.brand ? { brand: params.brand } : {}), ...(params.niche ? { niche: params.niche } : {}), ...(params.q ? { q: params.q } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white transition-all">
              ← Prev
            </a>
          )}
          <span className="text-[11px] text-white/20">{page} / {totalPages}</span>
          {page < totalPages && (
            <a href={`/watch?${new URLSearchParams({ ...(params.brand ? { brand: params.brand } : {}), ...(params.niche ? { niche: params.niche } : {}), ...(params.q ? { q: params.q } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white transition-all">
              Next →
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accentH})` }}>
              <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="text-[11px] text-white/30 tracking-wider">Veank Studio</span>
          </div>
          <p className="text-[10px] text-white/15 tracking-widest uppercase">{tagline} · {new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  )
}

function StoryCard({
  s, brand, defaultAccent, dimmed
}: {
  s: ScenarioRow
  brand?: BrandRow
  defaultAccent: string
  dimmed?: boolean
}) {
  const a  = brand?.theme_config?.accent  ?? defaultAccent
  const aH = brand?.theme_config?.accentH ?? defaultAccent
  const nicheLabel = brand?.theme_config?.nicheLabels?.[s.niche] ?? s.niche

  return (
    <Link href={`/watch/${s.id}`}
      className={`group relative block rounded-2xl overflow-hidden border border-white/[0.05] transition-all duration-400 ${dimmed ? 'opacity-50' : ''}`}>
      <div className="aspect-video relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${a}12 0%, #06080F 100%)` }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${a}15 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        {s.status === 'published' ? (
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm bg-black/20">
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: aH }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        ) : (
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/15">Soon</span>
        )}
      </div>

      <div className="p-5" style={{ background: '#08090E' }}>
        <div className="flex items-center gap-2 mb-2">
          {brand && (
            <span className="text-[9px] tracking-[0.25em] uppercase px-1.5 py-0.5 rounded border"
              style={{ borderColor: a + '30', color: a, background: a + '10' }}>
              {brand.name}
            </span>
          )}
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/25">
            {nicheLabel}
          </span>
        </div>
        <h3 className="text-white/90 font-bold text-[15px] leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
          {s.title}
        </h3>
        <p className="text-white/25 text-xs leading-relaxed line-clamp-2">{s.hook}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${a}50, transparent)` }} />
    </Link>
  )
}
