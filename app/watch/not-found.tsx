import Link from 'next/link'

export default function WatchNotFound() {
  return (
    <div className="min-h-screen bg-[#06080F] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="text-[13px] font-bold tracking-tight">Veank Studio</span>
        </div>

        <p className="text-[10px] tracking-[0.4em] uppercase text-amber-400/40 mb-4">Story not found</p>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">This story isn&apos;t available</h1>
        <p className="text-white/25 text-sm max-w-xs leading-relaxed mb-10">
          It may have been removed or made private.
        </p>
        <Link href="/watch"
          className="text-sm px-6 py-3 rounded-xl border border-amber-400/25 text-amber-400/60 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300">
          Browse all stories
        </Link>
      </div>
    </div>
  )
}
