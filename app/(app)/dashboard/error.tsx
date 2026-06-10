'use client'

import { AlertTriangle } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
      {error.message && (
        <p className="text-sm text-brand-400 mb-6 max-w-md">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-lg bg-[#C8922A] hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
