export default function GraphicsLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
      ))}
    </div>
  )
}
