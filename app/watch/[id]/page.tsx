import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 300

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createAdminClient()
  // Only resolve metadata for publicly enabled scenarios
  const { data: ps } = await supabase.from('public_settings').select('scenario_id, scenarios(title, hook)').eq('scenario_id', id).eq('is_public', true).single()
  const s = ps?.scenarios as unknown as { title: string; hook: string } | null
  return {
    title: s?.title ?? 'Veank Studio',
    description: s?.hook ?? undefined,
  }
}

export default async function WatchDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  // Check public_settings first — gate the whole page
  const { data: ps } = await supabase
    .from('public_settings')
    .select('is_public, show_script, show_graphics, show_video, show_platform_links')
    .eq('scenario_id', id)
    .eq('is_public', true)
    .single()

  if (!ps) notFound()

  // Fetch only public-safe fields (no notes, palette, audience, emotion)
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
    { key: 'tiktok',  label: 'TikTok',   url: platforms?.['tiktok'] },
    { key: 'youtube', label: 'YouTube',  url: platforms?.['youtube'] },
    { key: 'reels',   label: 'Reels',    url: platforms?.['reels'] },
  ].filter(p => p.url) : []

  const isPublished = scenario.status === 'published'

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/watch" className="text-xs uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors font-medium">
          ← Veank Studio
        </Link>
        <p className="text-xs text-zinc-600 uppercase tracking-widest">{scenario.niche}</p>
      </nav>

      {/* Hero / Video */}
      <div className="pt-16">
        {ps.show_video && isPublished && video?.file_url ? (
          <div className="relative aspect-video max-h-[70vh] w-full bg-black">
            <video
              src={video.file_url}
              controls
              className="w-full h-full object-contain"
              poster={(graphics as { file_url: string }[] | null)?.[0]?.file_url ?? undefined}
            />
          </div>
        ) : ps.show_graphics && (graphics as { file_url: string; id: string; file_name: string }[] | null)?.[0] ? (
          <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={(graphics as { file_url: string }[] | null)?.[0]?.file_url ?? ''} alt={scenario.title}
              className="w-full h-full object-cover" />
            {!isPublished && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <span className="bg-black/60 backdrop-blur text-zinc-400 text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-zinc-700">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video max-h-[40vh] w-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
            <span className="text-zinc-700 text-sm uppercase tracking-widest">Coming Soon</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-accent text-xs uppercase tracking-widest font-semibold mb-3">{scenario.niche}</p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
          {scenario.title}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8">{scenario.hook}</p>

        {/* Platform Links */}
        {platformLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {platformLinks.map(p => (
              <a key={p.key} href={p.url!} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 text-sm text-white transition-colors">
                Watch on {p.label}
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Script */}
        {ps.show_script && script?.body && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-10">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Script</p>
            <p className="text-zinc-300 text-sm leading-loose whitespace-pre-wrap">{script.body}</p>
          </div>
        )}

        {/* Graphics / storyboard */}
        {ps.show_graphics && (graphics as { id: string; file_url: string; file_name: string }[] | null)?.length ? (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Visual Storyboard</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(graphics as { id: string; file_url: string; file_name: string }[]).map(g => (
                <a key={g.id} href={g.file_url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.file_url} alt={g.file_name}
                    className="rounded-lg aspect-square object-cover w-full border border-zinc-800 hover:border-zinc-600 transition" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-900 py-10 text-center">
        <Link href="/watch" className="text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">
          More from Veank Studio →
        </Link>
      </div>
    </div>
  )
}
