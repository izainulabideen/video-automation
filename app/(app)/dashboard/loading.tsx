export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
    </div>
  )
}
