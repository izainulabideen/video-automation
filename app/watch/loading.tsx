export default function WatchLoading() {
  return (
    <div className="min-h-screen bg-[#06080F]">
      {/* Skeleton hero */}
      <div className="min-h-[92vh] flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-32 h-1 bg-white/[0.04] rounded-full animate-pulse" />
        <div className="space-y-3 text-center">
          <div className="h-16 w-72 bg-white/[0.04] rounded-xl mx-auto animate-pulse" />
          <div className="h-16 w-56 bg-white/[0.06] rounded-xl mx-auto animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-white/[0.03] rounded-full mx-auto animate-pulse" />
      </div>
      {/* Skeleton filter bar */}
      <div className="sticky top-0 border-b border-white/[0.05] bg-[#06080F]/85 px-6 py-3">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-white/[0.04] rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      {/* Skeleton grid */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-[#0D1117] border border-white/[0.04] overflow-hidden animate-pulse">
            <div className="aspect-video bg-white/[0.03]" />
            <div className="p-5 space-y-2">
              <div className="h-2 w-16 bg-white/[0.05] rounded-full" />
              <div className="h-4 w-full bg-white/[0.05] rounded-lg" />
              <div className="h-3 w-3/4 bg-white/[0.03] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
