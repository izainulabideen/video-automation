'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { History, RotateCcw, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { restoreScriptVersion } from '@/actions/scripts'
import type { ScriptVersion } from '@/actions/scripts'

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m    = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (m < 1)    return 'just now'
  if (m < 60)   return `${m}m ago`
  if (h < 24)   return `${h}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString()
}

interface Props {
  scenarioId: string
  versions: ScriptVersion[]
  onRestore: (body: string) => void
}

export function ScriptHistory({ scenarioId, versions, onRestore }: Props) {
  const router = useRouter()
  const [open, setOpen]           = useState(false)
  const [preview, setPreview]     = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [, startTransition]       = useTransition()

  if (!versions.length) return null

  async function handleRestore(v: ScriptVersion) {
    setRestoring(v.id)
    startTransition(async () => {
      await restoreScriptVersion(scenarioId, v.body)
      onRestore(v.body)
      setRestoring(null)
      setPreview(null)
      router.refresh()
    })
  }

  return (
    <div className="mt-3">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[11px] text-brand-600 hover:text-brand-400 transition-colors">
        <History size={11} />
        {versions.length} saved version{versions.length !== 1 ? 's' : ''}
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      {open && (
        <div className="mt-2 border border-white/[0.07] rounded-xl overflow-hidden">
          {versions.map((v, i) => (
            <div key={v.id}
              className={`${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${preview === v.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                onClick={() => setPreview(preview === v.id ? null : v.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-brand-300">{timeAgo(v.created_at)}</span>
                    {v.saved_by && <span className="text-[10px] text-brand-600">{v.saved_by}</span>}
                  </div>
                  <p className="text-[10px] text-brand-600 mt-0.5">{v.word_count ?? 0} words</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleRestore(v) }}
                  disabled={!!restoring}
                  className="flex items-center gap-1 text-[10px] text-brand-500 hover:text-accent border border-white/[0.08] hover:border-accent/25 px-2 py-1 rounded-lg transition-all disabled:opacity-40">
                  {restoring === v.id
                    ? <Loader2 size={9} className="animate-spin" />
                    : <RotateCcw size={9} />}
                  Restore
                </button>
              </div>

              {preview === v.id && (
                <div className="px-3 pb-3">
                  <p className="text-[11px] font-mono text-brand-500 bg-black/20 rounded-lg px-3 py-2.5 border border-white/[0.04] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {v.body}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
