import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import type { Metadata } from 'next'
import { WatchClientActions } from '@/components/watch/WatchClientActions'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import type { BrandTheme } from '@/types/brand'

export const revalidate = 60

// Default theme fallback (Finance)
const DEFAULT_THEME: BrandTheme = {
  accent: '#C8922A', accentH: '#E8B84B', accentDim: '#92400e',
  bg: '#06080F', surface: '#0D1117', border: 'rgba(200,146,42,0.15)',
  mood: 'dark', heroStyle: 'cinematic', fontWeight: 'black',
  tagline: 'Finance · Education',
  aiTone: 'authoritative, educational',
  niches: [], nicheLabels: {},
}

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: ps } = await supabase.from('public_settings').select('scenario_id, scenarios(title, hook)').eq('scenario_id', id).eq('is_public', true).single()
  const s = ps?.scenarios as unknown as { title: string; hook: string } | null
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://veank.studio'
  const canonical = `${base}/watch/${id}`
  const title = s?.title ?? 'Veank Studio'
  const description = s?.hook ?? 'Cinematic education. Real insights, no noise.'
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'Veank Studio',
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
  }
}

export default async function WatchDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: ps } = await supabase
    .from('public_settings')
    .select('is_public, show_script, show_graphics, show_video, show_platform_links')
    .eq('scenario_id', id).eq('is_public', true).single()

  if (!ps) notFound()

  const [
    { data: scenario },
    { data: video },
    { data: graphics },
    { data: script },
  ] = await Promise.all([
    supabase.from('scenarios').select('id, title, niche, hook, status, brand_id').eq('id', id).single(),
    ps.show_video
      ? supabase.from('videos').select('file_url, platform_urls, status').eq('scenario_id', id).single()
      : Promise.resolve({ data: null }),
    ps.show_graphics
      ? supabase.from('graphics').select('id, file_url, file_name, sort_order').eq('scenario_id', id).order('sort_order')
      : Promise.resolve({ data: [] }),
    ps.show_script
      ? supabase.from('scripts').select('body').eq('scenario_id', id).single()
      : Promise.resolve({ data: null }),
  ])

  if (!scenario) notFound()

  // Load brand theme
  let theme = DEFAULT_THEME
  if (scenario.brand_id) {
    const { data: brand } = await supabase.from('brands').select('theme_config, name').eq('id', scenario.brand_id).single()
    if (brand?.theme_config) theme = brand.theme_config as BrandTheme
  }

  const platforms = video?.platform_urls as Record<string, string> | null
  const platformLinks = ps.show_platform_links ? [
    { key: 'youtube', label: 'YouTube', icon: 'YT', url: platforms?.['youtube'] },
    { key: 'tiktok',  label: 'TikTok',  icon: 'TT', url: platforms?.['tiktok'] },
    { key: 'reels',   label: 'Reels',   icon: 'IG', url: platforms?.['reels'] },
  ].filter(p => p.url) : []

  // Only direct file URLs — no third-party embeds
  const embedSrc = video?.file_url || null

  const isPublished  = scenario.status === 'published'
  const graphicsList = (graphics as { id: string; file_url: string; file_name: string }[] | null) ?? []
  const coverImage   = graphicsList[0]?.file_url

  const nicheLabel = theme.nicheLabels?.[scenario.niche] ?? scenario.niche

  // Hero style variants
  const heroGlow: Record<string, string> = {
    horror:    `radial-gradient(ellipse, ${theme.accentDim}80 0%, transparent 70%)`,
    cinematic: `radial-gradient(ellipse, ${theme.accentDim}40 0%, transparent 70%)`,
    mystical:  `radial-gradient(ellipse at 30% 50%, ${theme.accentDim}60 0%, transparent 60%)`,
    minimal:   'none',
    clinical:  `radial-gradient(ellipse, ${theme.accentDim}20 0%, transparent 70%)`,
    epic:      `radial-gradient(ellipse, ${theme.accentDim}50 0%, transparent 60%)`,
    tech:      `radial-gradient(ellipse, ${theme.accentDim}30 0%, transparent 70%)`,
    warm:      `radial-gradient(ellipse, ${theme.accentDim}50 0%, transparent 60%)`,
  }

  const headingWeight: Record<string, number> = {
    bold: 700, extrabold: 800, black: 900,
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://veank.studio'
  const jsonLd = embedSrc
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: scenario.title,
        description: scenario.hook,
        contentUrl: embedSrc,
        thumbnailUrl: coverImage ?? `${base}/og-default.png`,
        uploadDate: new Date().toISOString(),
        publisher: { '@type': 'Organization', name: 'Veank Studio', url: base },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: scenario.title,
        description: scenario.hook,
        image: coverImage ?? `${base}/og-default.png`,
        publisher: { '@type': 'Organization', name: 'Veank Studio', url: base },
        url: `${base}/watch/${scenario.id}`,
      }

  return (
    <div className="min-h-screen text-white selection:bg-amber-400/20 selection:text-amber-200"
      style={{ background: theme.bg }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-5 flex items-center justify-between backdrop-blur-xl border-b"
        style={{
          borderColor: theme.accent + '15',
          background: `linear-gradient(to bottom, ${theme.bg}F0, ${theme.bg}B0)`,
        }}>
        <Link href="/watch"
          className="group flex items-center gap-3 transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${theme.accentH}, ${theme.accent})` }}>
              <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="text-[12px] font-semibold tracking-tight text-white/70 group-hover:text-white transition-colors">Veank Studio</span>
          </div>
        </Link>
        <span className="text-[10px] tracking-[0.35em] uppercase hidden sm:block"
          style={{ color: theme.accent + '60' }}>
          {nicheLabel}
        </span>
      </nav>

      {/* Hero media */}
      <div className="pt-[60px]">
        {ps.show_video && isPublished && embedSrc ? (
          <div className="relative w-full bg-black">
            <VideoPlayer src={embedSrc} poster={coverImage} title={scenario.title} />
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${theme.bg}, transparent)` }} />
          </div>
        ) : coverImage && ps.show_graphics ? (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '75vh', aspectRatio: '16/9' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={scenario.title} className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.5) contrast(1.1)' }} />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${theme.bg} 0%, rgba(0,0,0,0.4) 50%, transparent 100%)` }} />
            {!isPublished && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="backdrop-blur-md bg-black/40 border rounded-2xl px-8 py-4 text-center"
                  style={{ borderColor: theme.accent + '20' }}>
                  <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: theme.accent + '80' }}>In Production</p>
                  <p className="text-white/50 text-sm">Coming soon</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Cinematic title card — shown when no video/graphics yet */
          <div className="relative w-full overflow-hidden flex items-end"
            style={{
              minHeight: '52vh',
              background: `linear-gradient(145deg, ${theme.accent}28 0%, ${theme.bg}dd 45%, ${theme.bg} 100%)`,
            }}>
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{background:`radial-gradient(ellipse at 25% 40%, ${theme.accent}25 0%, transparent 60%)`}}/>
            {/* Noise grain */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{backgroundImage:'repeating-linear-gradient(60deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'18px 18px'}}/>
            {/* Glow from heroStyle */}
            <div className="absolute inset-0 pointer-events-none"
              style={{background: heroGlow[theme.heroStyle] ?? 'none'}}/>
            {/* Content */}
            <div className="relative z-10 w-full px-6 md:px-12 pb-10 md:pb-14 pt-24">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4 font-medium"
                style={{color: theme.accent + '80'}}>{nicheLabel}</p>
              <h1 className="font-black leading-[1.0] tracking-tight text-white max-w-3xl"
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                  fontWeight: headingWeight[theme.fontWeight] ?? 900,
                }}>
                {scenario.title}
              </h1>
              <p className="mt-4 text-white/35 text-base leading-relaxed max-w-xl">{scenario.hook}</p>
              {!isPublished && (
                <span className="inline-flex items-center gap-2 mt-6 text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border"
                  style={{borderColor: theme.accent + '30', color: theme.accent + '70', background: theme.accent + '0f'}}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: theme.accent + '80'}}/>
                  In Production
                </span>
              )}
            </div>
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{background:`linear-gradient(to top, ${theme.bg}, transparent)`}}/>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Niche + title */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: theme.accent + '80' }}>
            {nicheLabel}
          </p>
          <h1 className="leading-[1.02] tracking-[-0.03em] text-white mb-5"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: headingWeight[theme.fontWeight] ?? 900,
            }}>
            {scenario.title}
          </h1>
          <p className="text-white/40 text-lg leading-relaxed font-light">{scenario.hook}</p>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px" style={{ background: theme.accent + '50' }} />
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        {/* Platform links */}
        {platformLinks.length > 0 && (
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4">Watch on</p>
            <div className="flex flex-wrap gap-3">
              {platformLinks.map(p => (
                <a key={p.key} href={p.url!} target="_blank" rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300"
                  style={{ border: `1px solid ${theme.accent}20`, background: `${theme.accent}05` }}>
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                    {p.icon}
                  </span>
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors font-medium">{p.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share + view counter */}
        <WatchClientActions
          scenarioId={id}
          title={scenario.title}
          shareUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/watch/${id}`}
          accent={theme.accent}
        />

        {/* Script */}
        {ps.show_script && script?.body && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">Script</p>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${theme.accent}10` }}>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}50, ${theme.accent}15, transparent)` }} />
              <div className="p-7" style={{ background: `linear-gradient(135deg, ${theme.surface}90, ${theme.bg})` }}>
                <p className="text-white/50 text-[14px] leading-[1.9] whitespace-pre-wrap font-light tracking-wide">
                  {script.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Graphics */}
        {ps.show_graphics && graphicsList.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">Visual Storyboard</p>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-[10px] text-white/15">{graphicsList.length} frames</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {graphicsList.map((g, i) => (
                <a key={g.id} href={g.file_url} target="_blank" rel="noreferrer"
                  className="group relative block rounded-xl overflow-hidden aspect-square transition-all duration-300"
                  style={{ border: `1px solid ${theme.accent}10` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.file_url} alt={g.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'brightness(0.8)' }} />
                  <span className="absolute bottom-2 left-2 text-[9px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Hero glow pulse — mood-specific */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none opacity-10 blur-3xl"
          style={{ background: heroGlow[theme.heroStyle] ?? heroGlow.cinematic }} />

      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-8" style={{ borderColor: theme.accent + '10' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/watch" className="group flex items-center gap-2 transition-colors text-[12px] tracking-wide"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            More from Veank Studio
          </Link>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.1)' }}>
            {theme.tagline} · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
