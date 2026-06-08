'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, CheckSquare, Square, Loader2, ChevronDown } from 'lucide-react'
import { updateScenarioStatus } from '@/actions/scenarios'
import { createAdminClient } from '@/lib/supabase/admin'

// Client-side bulk delete — calls API route
async function bulkDeleteScenarios(ids: string[]): Promise<void> {
  await fetch('/api/scenarios/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
}

type Scenario = { id: string; title: string; hook: string | null; niche: string; status: string; created_at: string }

interface Props {
  scenarios: Scenario[]
  renderRow: (s: Scenario, selected: boolean, toggle: () => void) => React.ReactNode
}

export function BulkScenarioActions({ scenarios, renderRow }: Props) {
  const router = useRouter()
  const [selected, setSelected]     = useState<Set<string>>(new Set())
  const [deleting, setDeleting]     = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [, startTransition]         = useTransition()

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(prev => prev.size === scenarios.length ? new Set() : new Set(scenarios.map(s => s.id)))
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} scenario${selected.size !== 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    await bulkDeleteScenarios(Array.from(selected))
    setSelected(new Set())
    setDeleting(false)
    router.refresh()
  }

  function handleBulkStatus(status: string) {
    const ids = Array.from(selected)
    setStatusOpen(false)
    startTransition(async () => {
      await Promise.all(ids.map(id => updateScenarioStatus(id, status as never)))
      setSelected(new Set())
      router.refresh()
    })
  }

  const allSelected = selected.size === scenarios.length && scenarios.length > 0

  return (
    <div>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl bg-accent/[0.06] border border-accent/20">
          <span className="text-xs text-accent font-semibold">{selected.size} selected</span>
          <button onClick={() => setSelected(new Set())}
            className="text-[11px] text-brand-500 hover:text-brand-300 transition-colors">
            Deselect all
          </button>

          {/* Status change dropdown */}
          <div className="relative ml-auto">
            <button onClick={() => setStatusOpen(o => !o)}
              className="flex items-center gap-1.5 text-[11px] text-brand-300 border border-white/[0.09] hover:border-white/[0.18] px-3 py-1.5 rounded-lg transition-all">
              Set status <ChevronDown size={11} />
            </button>
            {statusOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#0D1117] border border-white/[0.1] rounded-xl shadow-xl z-20 py-1 min-w-[140px]">
                {[
                  { value: 'draft',         label: 'Draft',         dot: 'bg-brand-500' },
                  { value: 'in_production', label: 'In Production', dot: 'bg-amber-400' },
                  { value: 'published',     label: 'Published',     dot: 'bg-emerald-400' },
                ].map(s => (
                  <button key={s.value} onClick={() => handleBulkStatus(s.value)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-brand-200 hover:bg-white/[0.05] transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleBulkDelete} disabled={deleting}
            className="flex items-center gap-1.5 text-[11px] text-danger border border-danger/20 hover:border-danger/40 hover:bg-danger/[0.06] px-3 py-1.5 rounded-lg transition-all disabled:opacity-40">
            {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
            Delete {selected.size}
          </button>
        </div>
      )}

      {/* Select-all header */}
      <div className="flex items-center gap-3 px-5 py-2 mb-1">
        <button onClick={toggleAll}
          className="text-brand-600 hover:text-brand-400 transition-colors">
          {allSelected
            ? <CheckSquare size={14} className="text-accent" />
            : <Square size={14} />}
        </button>
        <span className="text-[10px] text-brand-700 uppercase tracking-wider">
          {allSelected ? 'Deselect all' : 'Select all'}
        </span>
      </div>

      {/* Rows */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117]">
        {scenarios.map(s => renderRow(s, selected.has(s.id), () => toggle(s.id)))}
      </div>
    </div>
  )
}
