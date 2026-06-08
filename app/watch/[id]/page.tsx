import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import type { Metadata } from 'next'
import { NICHE_LABELS } from '@/lib/constants'
import { WatchClientActions } from '@/components/watch/WatchClientActions'

export const revalidate = 300

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: ps } = await supabase.from('public_settings').select('scenario_id, scenarios(title, hook)').eq('scenario_id', id).eq('is_public', true).single()
  const s = ps?.scenarios as unknown as { title: string; hook: string } | null
  return {
    title: s?.title ? `${s.title} — Veank Studio` : 'Veank Studio',
    description: s?.hook ?? undefined,
    openGraph: {
      title: s?.title ?? 'Veank Studio',
      description: s?.hook ?? 'Cinematic finance education.',
      type: 'article',
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: s?.title ?? 'Veank Studio',
      description: s?.hook ?? 'Cinematic finance education.',
    },
  }
}

export default async function WatchDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: ps } = await supabase
    .from('public_settings')
    .select('is_public, show_script, show_graphics, show_video, show_platform_links')
    .eq('scenario_id', id)
    .eq('is_public', true)
    .single()

  if (!ps) notFound()

  const [
    { data: scenario },
    { data: video },
    { data: graphics },
    { data: script },
  ] = await Promise.all([
    supabase.from('scenarios').select('id, title, niche, hook, status').eq('id', id).single(),
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

  const platforms = video?.platform_urls as Record<string, string> | null
  const platformLinks = ps.show_platform_links ? [
    { key: 'tiktok',   label: 'TikTok',   icon: 'T', url: platforms?.['tiktok'] },
    { key: 'youtube',  label: 'YouTube',  icon: 'Y', url: platforms?.['youtube'] },
    { key: 'reels',    label: 'Reels',    icon: 'R', url: platforms?.['reels'] },
  ].filter(p => p.url) : []

  const isPublished = scenario.status === 'published'
  const graphicsList = (graphics as { id: string; file_url: string; file_name: string }[] | null) ?? []
  const coverImage = graphicsList[0]?.file_url

  return (
    <div className="min-h-screen bg-[#06080F] text-white selection:bg-amber-400/20 selection:text-amber-200">

      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-5 flex items-center justify-between backdrop-blur-xl border-b border-white/[0.04]"
        style={{ background: 'linear-gradient(to bottom, rgba(6,8,15,0.95), rgba(6,8,15,0.7))' }}>
        <Link href="/watch"
          className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
              <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="text-[12px] font-semibold tracking-tight">Veank Studio</span>
          </div>
        </Link>
        <span className="text-[10px] tracking-[0.35em] uppercase text-white/20 hidden sm:block">
          {NICHE_LABELS[scenario.niche] ?? scenario.niche}
        </span>
      </nav>

      {/* ── Hero media ── */}
      <div className="pt-[60px]">
        {ps.show_video && isPublished && video?.file_url ? (
          <div className="relative w-full bg-black" style={{ maxHeight: '75vh', aspectRatio: '16/9' }}>
            <video
              src={video.file_url}
              controls
              className="w-full h-full object-contain"
              poster={coverImage}
            />
            {/* Vignette bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #06080F, transparent)' }} />
          </div>
        ) : coverImage && ps.show_graphics ? (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '75vh', aspectRatio: '16/9' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={scenario.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.55) contrast(1.1)' }} />
            {/* Overlays */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #06080F 0%, rgba(6,8,15,0.4) 50%, transparent 100%)' }} />
            {!isPublished && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl px-8 py-4 text-center">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-amber-400/60 mb-1">In Production</p>
                  <p className="text-white/50 text-sm">Coming soon</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center"
            style={{ height: '40vh', background: 'linear-gradient(135deg, #0a0c10 0%, #06080F 100%)' }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl border border-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/15">Coming Soon</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Niche + title */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-amber-400/60 mb-4">
            {NICHE_LABELS[scenario.niche] ?? scenario.niche}
          </p>
          <h1 className="font-black leading-[1.02] tracking-[-0.03em] text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {scenario.title}
          </h1>
          <p className="text-white/40 text-lg leading-relaxed font-light">{scenario.hook}</p>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-amber-400/30" />
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        {/* Platform links */}
        {platformLinks.length > 0 && (
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4">Watch on</p>
            <div className="flex flex-wrap gap-3">
              {platformLinks.map(p => (
                <a key={p.key} href={p.url!} target="_blank" rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.08] hover:border-amber-400/25 bg-white/[0.02] hover:bg-amber-400/[0.04] transition-all duration-300">
                  <span className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-amber-400 transition-colors">{p.icon}</span>
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors font-medium">{p.label}</span>
                  <svg className="w-3 h-3 text-white/20 group-hover:text-amber-400/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* View counter + social share */}
        <WatchClientActions
          scenarioId={id}
          title={scenario.title}
          shareUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/watch/${id}`}
        />

        {/* Script */}
        {ps.show_script && script?.body && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">Script</p>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <div className="relative rounded-2xl border border-white/[0.05] overflow-hidden">
              {/* Top accent line */}
              <div className="h-px w-full bg-gradient-to-r from-amber-400/30 via-amber-400/10 to-transparent" />
              <div className="p-7 bg-gradient-to-br from-[#0a0b0f] to-[#06080F]">
                <p className="text-white/50 text-[14px] leading-[1.9] whitespace-pre-wrap font-light tracking-wide">
                  {script.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Graphics storyboard */}
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
                  className="group relative block rounded-xl overflow-hidden aspect-square border border-white/[0.05] hover:border-amber-400/20 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.file_url} alt={g.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'brightness(0.8)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(6,8,15,0.8) 0%, transparent 50%)' }} />
                  <span className="absolute bottom-2 left-2 text-[9px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-12 px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/watch"
            className="group flex items-center gap-2 text-white/25 hover:text-white/60 transition-colors text-[12px] tracking-wide">
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            More from Veank Studio
          </Link>
          <p className="text-[10px] text-white/10 tracking-widest uppercase">{new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  )
}
