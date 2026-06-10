export default function WatchDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[16/9] bg-white/[0.04]" />
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <div className="h-4 w-24 rounded bg-white/[0.04]" />
        <div className="h-10 w-3/4 rounded-xl bg-white/[0.04]" />
        <div className="h-6 w-1/2 rounded-xl bg-white/[0.04]" />
        <div className="h-px bg-white/[0.04]" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  )
}
