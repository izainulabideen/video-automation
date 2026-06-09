'use client'
import { useState, useTransition } from 'react'
import { createWebhook, deleteWebhook, toggleWebhook } from '@/actions/webhooks'
import { Trash2, Plus, Webhook } from 'lucide-react'

const EVENTS = [
  { value: 'scenario.published', label: 'Scenario Published' },
  { value: 'scenario.created',   label: 'Scenario Created' },
  { value: 'scenario.assigned',  label: 'Scenario Assigned' },
]

type WebhookRow = {
  id: string
  url: string
  secret: string
  events: string[]
  is_active: boolean
  label: string | null
  created_at: string
}

interface Props {
  webhooks: WebhookRow[]
}

export function WebhooksList({ webhooks: initial }: Props) {
  const [webhooks, setWebhooks] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  function toggleEvent(val: string) {
    setSelectedEvents(prev =>
      prev.includes(val) ? prev.filter(e => e !== val) : [...prev, val]
    )
  }

  async function handleCreate(fd: FormData) {
    setError('')
    selectedEvents.forEach(e => fd.append('events', e))
    const res = await createWebhook(fd)
    if (!res.success) { setError(res.error); return }
    setSelectedEvents([])
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteWebhook(id)
      if (res.success) setWebhooks(prev => prev.filter(w => w.id !== id))
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleWebhook(id, !current)
      if (res.success) setWebhooks(prev => prev.map(w => w.id === id ? { ...w, is_active: !current } : w))
    })
  }

  const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'
  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Add form */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={14} className="text-accent" />
          Add Webhook
        </h2>
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className={labelCls}>URL</label>
            <input name="url" type="url" required placeholder="https://example.com/webhook" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Label (optional)</label>
            <input name="label" type="text" placeholder="My webhook" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Events</label>
            <div className="flex flex-col gap-2 mt-1">
              {EVENTS.map(ev => (
                <label key={ev.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(ev.value)}
                    onChange={() => toggleEvent(ev.value)}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-sm text-brand-200 group-hover:text-white transition-colors">{ev.label}</span>
                  <span className="text-[11px] text-brand-500 font-mono">{ev.value}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={isPending}
            className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
            Add Webhook
          </button>
        </form>
      </div>

      {/* List */}
      {webhooks.length === 0 ? (
        <div className="text-center py-10 text-brand-500 text-sm">
          <Webhook size={32} className="mx-auto mb-3 opacity-30" />
          No webhooks configured yet.
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map(w => (
            <div key={w.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {w.label && <span className="text-sm font-semibold text-white">{w.label}</span>}
                    <span className="text-xs text-brand-400 font-mono truncate">{w.url}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {w.events.map(ev => (
                      <span key={ev} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {ev}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-brand-600 mt-2 font-mono">
                    secret: {w.secret.slice(0, 8)}***
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(w.id, w.is_active)}
                    disabled={isPending}
                    className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${
                      w.is_active
                        ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                        : 'bg-white/[0.04] text-brand-400 border-white/[0.08] hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                    }`}
                  >
                    {w.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    disabled={isPending}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-brand-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
