import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06080F] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl border border-white/[0.06] flex items-center justify-center mb-6">
        <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[10px] tracking-[0.4em] uppercase text-amber-400/40 mb-3">404</p>
      <h1 className="text-2xl font-black text-white mb-3 tracking-tight">Page not found</h1>
      <p className="text-white/30 text-sm max-w-xs leading-relaxed mb-8">
        This page doesn&apos;t exist or has been removed.
      </p>
      <Link href="/watch"
        className="text-sm px-5 py-2.5 rounded-xl border border-amber-400/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-400/60 transition-all">
        Back to Veank Studio
      </Link>
    </div>
  )
}
