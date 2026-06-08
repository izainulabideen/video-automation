'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NICHE_COLORS } from '@/lib/constants'

type CalEvent = {
  id: string
  date: string
  type: 'due' | 'publish'
  title: string
  niche: string
  status: string
  href: string
  sub?: string
}

interface Props {
  year: number
  month: number
  events: CalEvent[]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function CalendarGrid({ year, month, events }: Props) {
  const router = useRouter()

  function nav(delta: number) {
    let m = month + delta
    let y = year
    if (m > 12) { m = 1;  y++ }
    if (m < 1)  { m = 12; y-- }
    router.push(`/calendar?year=${y}&month=${m}`, { scroll: false })
  }

  const firstDay  = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date().toISOString().slice(0, 10)

  // Build grid cells: leading empty + actual days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsForDay(day: number): CalEvent[] {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => e.date === dateStr)
  }

  return (
    <div>
      {/* Nav header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => nav(-1)}
          className="p-2 rounded-lg border border-white/[0.08] text-brand-400 hover:text-white hover:border-white/[0.18] transition-all">
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-lg font-bold text-white">{MONTHS[month - 1]} {year}</h2>
        <button onClick={() => nav(1)}
          className="p-2 rounded-lg border border-white/[0.08] text-brand-400 hover:text-white hover:border-white/[0.18] transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 px-1">
        <div className="flex items-center gap-1.5 text-[11px] text-brand-400">
          <div className="w-2.5 h-2.5 rounded-sm bg-danger/60" />
          Due date
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-brand-400">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" />
          Publish date
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-brand-600 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.06]">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-[#080B14] min-h-[96px]" />
          const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isToday = dateStr === today
          const dayEvents = eventsForDay(day)

          return (
            <div key={dateStr}
              className={`bg-[#0A0E15] min-h-[96px] p-2 ${isToday ? 'bg-accent/[0.04]' : ''}`}>
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1.5 ${
                isToday
                  ? 'bg-accent text-white font-bold'
                  : 'text-brand-500'
              }`}>
                {day}
              </span>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(ev => (
                  <Link key={ev.id} href={ev.href}
                    className={`block px-1.5 py-1 rounded-md text-[10px] leading-snug truncate transition-opacity hover:opacity-80 ${
                      ev.type === 'due'
                        ? 'bg-danger/20 text-danger border border-danger/25'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}
                    title={`${ev.type === 'due' ? 'Due' : 'Publish'}: ${ev.title}${ev.sub ? ` — ${ev.sub}` : ''}`}>
                    <span className="font-medium truncate block">{ev.title}</span>
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[9px] text-brand-600 px-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Events list for month */}
      {events.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">This Month ({events.length} events)</h3>
          <div className="space-y-2">
            {events.sort((a,b) => a.date.localeCompare(b.date)).map(ev => (
              <Link key={ev.id} href={ev.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-[#0D1117] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ev.type === 'due' ? 'bg-danger' : 'bg-emerald-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white group-hover:text-accent transition-colors truncate">{ev.title}</p>
                  {ev.sub && <p className="text-[11px] text-brand-500">{ev.sub}</p>}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  ev.type === 'due'
                    ? 'text-danger bg-danger/10 border-danger/20'
                    : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                }`}>
                  {ev.type === 'due' ? 'Due' : 'Publish'} · {new Date(ev.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`text-[11px] hidden sm:block px-2 py-0.5 rounded-full border ${NICHE_COLORS[ev.niche] ?? 'text-brand-500 bg-white/[0.03] border-white/[0.06]'}`}>
                  {ev.niche?.replace(/_/g, ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="mt-8 text-center py-10 text-brand-600 text-sm">
          No events this month. Set due dates on scenarios or publish dates on videos.
        </div>
      )}
    </div>
  )
}
