export default function VideosLoading() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
      ))}
    </div>
  )
}
