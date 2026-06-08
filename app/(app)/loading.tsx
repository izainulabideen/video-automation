export default function AppLoading() {
  return (
    <div className="space-y-4 py-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl bg-[#0D1117] animate-pulse h-20 border border-white/[0.05]" />
      ))}
    </div>
  )
}
