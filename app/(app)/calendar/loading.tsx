export default function CalendarLoading() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-6 rounded bg-white/[0.04]" />
        ))}
      </div>
      {[...Array(5)].map((_, row) => (
        <div key={row} className="grid grid-cols-7 gap-1">
          {[...Array(7)].map((_, col) => (
            <div key={col} className="h-20 rounded-lg bg-white/[0.04] border border-white/[0.05]" />
          ))}
        </div>
      ))}
    </div>
  )
}
