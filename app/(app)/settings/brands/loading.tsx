export default function BrandsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
      ))}
    </div>
  )
}
