import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const revalidate = 300

export default async function WatchPage() {
  const supabase = createAdminClient()
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('id, title, niche, hook, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4 font-medium">Veank Studio</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            Finance Stories
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            Cinematic finance education. Real insights, no noise.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {!scenarios?.length ? (
          <p className="text-center text-zinc-600 py-20">No published videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map(s => (
              <Link key={s.id} href={`/watch/${s.id}`}
                className="group block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all hover:-translate-y-0.5">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                  <span className="text-zinc-600 text-xs uppercase tracking-widest">Watch</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-accent uppercase tracking-widest font-medium mb-1">{s.niche}</p>
                  <h3 className="text-white font-semibold leading-snug mb-2">{s.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{s.hook}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
