'use client'
import { useState, useTransition } from 'react'
import { toggleChecklistItem, addChecklistItem, deleteChecklistItem, renameChecklistItem } from '@/actions/checklist'
import type { ChecklistItem } from '@/actions/checklist'
import { Check, Plus, Loader2, Trash2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  scenarioId: string
  items: ChecklistItem[]
}

export function ScenarioChecklist({ scenarioId, items: initial }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [pending, startTransition] = useTransition()
  const [toggling, setToggling] = useState<string | null>(null)
  const [addingItem, setAddingItem] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const done = items.filter(i => i.is_done).length
  const pct  = items.length ? Math.round((done / items.length) * 100) : 0

  function toggle(item: ChecklistItem) {
    const next = !item.is_done
    setToggling(item.id)
    setItems(prev => prev.map(i => i.id === item.id
      ? { ...i, is_done: next, done_by: next ? 'You' : null, done_at: next ? new Date().toISOString() : null }
      : i
    ))
    startTransition(async () => {
      await toggleChecklistItem(item.id, scenarioId, next)
      setToggling(null)
      router.refresh()
    })
  }

  function startEdit(item: ChecklistItem) {
    setEditingId(item.id)
    setEditLabel(item.label)
  }

  function submitRename(id: string) {
    if (!editLabel.trim()) return
    const label = editLabel.trim()
    setItems(prev => prev.map(i => i.id === id ? { ...i, label } : i))
    setEditingId(null)
    startTransition(async () => {
      await renameChecklistItem(id, scenarioId, label)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
    startTransition(async () => {
      await deleteChecklistItem(id, scenarioId)
      router.refresh()
    })
  }

  function submitAdd() {
    if (!newLabel.trim()) return
    const label = newLabel.trim()
    setNewLabel('')
    setAddingItem(false)
    setItems(prev => [...prev, {
      id: 'temp-' + Date.now(),
      scenario_id: scenarioId,
      label,
      is_done: false,
      done_by: null,
      done_at: null,
      sort_order: prev.length,
    }])
    startTransition(async () => {
      await addChecklistItem(scenarioId, label)
      router.refresh()
    })
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #10B981, #059669)'
                : 'linear-gradient(90deg, #C8922A, #E8B84B)',
            }}
          />
        </div>
        <span className={`text-[11px] font-semibold tabular-nums shrink-0 ${pct === 100 ? 'text-success' : 'text-brand-400'}`}>
          {done}/{items.length}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all group ${
            item.is_done
              ? 'bg-success/[0.04] border-success/15'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
          }`}>
            {/* Checkbox */}
            <button
              onClick={() => toggle(item)}
              disabled={toggling === item.id}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                item.is_done
                  ? 'bg-success border-success'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {toggling === item.id
                ? <Loader2 size={10} className="animate-spin text-white/40" />
                : item.is_done && <Check size={11} strokeWidth={3} className="text-white" />
              }
            </button>

            {/* Label / edit input */}
            {editingId === item.id ? (
              <input
                autoFocus
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitRename(item.id); if (e.key === 'Escape') setEditingId(null) }}
                onBlur={() => submitRename(item.id)}
                className="flex-1 bg-transparent text-sm text-white outline-none border-b border-accent/50"
              />
            ) : (
              <span
                className={`text-sm flex-1 transition-colors ${item.is_done ? 'text-brand-500 line-through' : 'text-brand-200'}`}
              >
                {item.label}
              </span>
            )}

            {/* Done by */}
            {item.is_done && item.done_by && editingId !== item.id && (
              <span className="text-[10px] text-brand-600 shrink-0 hidden sm:block">
                {item.done_by} · {item.done_at ? new Date(item.done_at).toLocaleDateString() : ''}
              </span>
            )}

            {/* Actions */}
            {editingId !== item.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="p-1 rounded hover:bg-white/10 text-brand-600 hover:text-brand-300 transition-colors"
                  title="Rename"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded hover:bg-danger/10 text-brand-600 hover:text-danger transition-colors"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="mt-3">
        {addingItem ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitAdd(); if (e.key === 'Escape') setAddingItem(false) }}
              placeholder="New checklist item…"
              className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-sm text-white placeholder-brand-500 focus:border-accent/50 outline-none transition-all"
            />
            <button onClick={submitAdd}
              className="bg-accent/20 text-accent border border-accent/25 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent/30 transition-all">
              Add
            </button>
            <button onClick={() => setAddingItem(false)}
              className="text-brand-500 hover:text-brand-300 text-xs px-2 py-2 transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setAddingItem(true)}
            className="flex items-center gap-1.5 text-[11px] text-brand-600 hover:text-brand-400 transition-colors mt-1">
            <Plus size={12} />
            Add item
          </button>
        )}
      </div>
    </div>
  )
}
