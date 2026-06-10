'use client'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
export default function WatchError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
      {error.message && <p className="text-sm text-white/40 mb-6 max-w-sm">{error.message}</p>}
      <div className="flex gap-3">
        <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-white/[0.07] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-colors">Try again</button>
        <Link href="/watch" className="px-5 py-2.5 rounded-lg bg-[#C8922A] text-white text-sm font-semibold hover:bg-amber-500 transition-colors">Back to Watch</Link>
      </div>
    </div>
  )
}
