export default function ScenariosLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="rounded-md bg-[#0D1117] animate-pulse h-5 w-28" />
          <div className="rounded-md bg-[#0D1117] animate-pulse h-3 w-16" />
        </div>
        <div className="rounded-lg bg-[#0D1117] animate-pulse h-9 w-28" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex items-center gap-2 mb-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-full bg-[#0D1117] animate-pulse h-7 w-20" />
        ))}
      </div>

      {/* List skeleton */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08] shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="rounded bg-white/[0.06] animate-pulse h-3.5 w-3/5" />
              <div className="rounded bg-white/[0.04] animate-pulse h-2.5 w-4/5" />
            </div>
            <div className="rounded-full bg-white/[0.04] animate-pulse h-6 w-20 hidden md:block" />
            <div className="rounded-full bg-white/[0.04] animate-pulse h-6 w-16" />
            <div className="rounded bg-white/[0.04] animate-pulse h-3 w-16 hidden lg:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
