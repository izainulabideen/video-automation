export default function DocsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
      ))}
    </div>
  )
}
