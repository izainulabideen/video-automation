export default function SettingsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.05]" />
      ))}
    </div>
  )
}
