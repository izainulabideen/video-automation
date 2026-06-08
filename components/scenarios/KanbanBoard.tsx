'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateScenarioStatus } from '@/actions/scenarios'
import { NICHE_LABELS, NICHE_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

type Status = 'draft' | 'in_production' | 'published'

type Scenario = {
  id: string
  title: string
  hook: string | null
  niche: string
  status: string
  created_at: string
  assigned_to?: string | null
  due_date?: string | null
}

const COLUMNS: { status: Status; label: string; color: string; dot: string; border: string; headerBg: string }[] = [
  { status: 'draft',         label: 'Draft',         color: 'text-brand-400',   dot: 'bg-brand-500',    border: 'border-white/[0.07]',     headerBg: 'bg-white/[0.02]' },
  { status: 'in_production', label: 'In Production', color: 'text-amber-400',   dot: 'bg-amber-400',    border: 'border-amber-400/15',     headerBg: 'bg-amber-400/[0.04]' },
  { status: 'published',     label: 'Published',     color: 'text-emerald-400', dot: 'bg-emerald-400',  border: 'border-emerald-400/15',   headerBg: 'bg-emerald-400/[0.04]' },
]

function KanbanCard({ s, onDragStart }: { s: Scenario; onDragStart: () => void }) {
  const isOverdue = s.due_date && new Date(s.due_date) < new Date()
  return (
    <Link href={`/scenarios/${s.id}`}
      draggable
      onDragStart={onDragStart}
      className="block bg-[#0D1117] border border-white/[0.07] hover:border-white/[0.14] rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-black/30 group select-none">
      <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors leading-snug mb-1.5 line-clamp-2">
        {s.title}
      </p>
      {s.hook && (
        <p className="text-[11px] text-brand-500 line-clamp-2 leading-relaxed mb-2.5">{s.hook}</p>
      )}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${NICHE_COLORS[s.niche] ?? 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'}`}>
          {NICHE_LABELS[s.niche] ?? s.niche}
        </span>
        {s.assigned_to && (
          <span className="text-[10px] text-brand-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
            {s.assigned_to}
          </span>
        )}
        {s.due_date && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isOverdue ? 'text-danger bg-danger/10 border-danger/25' : 'text-brand-500 bg-white/[0.03] border-white/[0.06]'}`}>
            {isOverdue ? 'Overdue' : new Date(s.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      <p className="text-[10px] text-brand-700 mt-2">{formatDate(s.created_at)}</p>
    </Link>
  )
}

interface Props {
  scenarios: Scenario[]
}

export function KanbanBoard({ scenarios: initial }: Props) {
  const router = useRouter()
  const [scenarios, setScenarios] = useState(initial)
  const [dragging, setDragging]   = useState<string | null>(null)
  const [dragOver, setDragOver]   = useState<Status | null>(null)
  const [, startTransition]       = useTransition()

  function handleDrop(targetStatus: Status) {
    if (!dragging) return
    const s = scenarios.find(x => x.id === dragging)
    if (!s || s.status === targetStatus) { setDragging(null); setDragOver(null); return }

    // Optimistic update
    setScenarios(prev => prev.map(x => x.id === dragging ? { ...x, status: targetStatus } : x))
    setDragging(null); setDragOver(null)

    startTransition(async () => {
      await updateScenarioStatus(s.id, targetStatus)
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(col => {
        const cards = scenarios.filter(s => s.status === col.status)
        const isOver = dragOver === col.status
        return (
          <div key={col.status}
            onDragOver={e => { e.preventDefault(); setDragOver(col.status) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(col.status)}
            className={`rounded-xl border transition-all duration-150 ${col.border} ${isOver ? 'ring-2 ring-accent/30 border-accent/40 bg-accent/[0.02]' : 'bg-[#0A0E15]'}`}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-b ${col.border} ${col.headerBg}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                <span className="text-[11px] text-brand-600 bg-white/[0.05] rounded-full px-2 py-0.5 tabular-nums">
                  {cards.length}
                </span>
              </div>
              <Link href={`/scenarios/new`}
                className="p-1 rounded-md text-brand-600 hover:text-brand-300 hover:bg-white/[0.05] transition-all">
                <Plus size={12} />
              </Link>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-2.5 min-h-[120px]">
              {cards.map(s => (
                <KanbanCard key={s.id} s={s} onDragStart={() => setDragging(s.id)} />
              ))}
              {cards.length === 0 && (
                <div className={`flex items-center justify-center h-20 rounded-xl border-2 border-dashed transition-all ${isOver ? 'border-accent/40 bg-accent/[0.04]' : 'border-white/[0.05]'}`}>
                  <p className="text-[11px] text-brand-700">{isOver ? 'Drop here' : 'Empty'}</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
