'use client'
import { useState } from 'react'
import { Download, FileJson, Archive, FileText, ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react'

interface Props {
  scenarioId: string
  title: string
}

type ExportType = 'json' | 'zip' | 'pdf'

export function ExportPanel({ scenarioId, title }: Props) {
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState<ExportType | null>(null)
  const [done, setDone]     = useState<ExportType | null>(null)

  async function handleExport(type: ExportType) {
    setLoading(type); setDone(null)
    const url = `/api/export/${type}?id=${scenarioId}`
    if (type === 'pdf') {
      window.open(url, '_blank')
      setLoading(null); setDone('pdf')
      setTimeout(() => setDone(null), 2000)
      return
    }
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = type === 'zip'
        ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-export.zip`
        : `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.json`
      a.click()
      URL.revokeObjectURL(a.href)
      setDone(type)
      setTimeout(() => setDone(null), 2000)
    } finally {
      setLoading(null)
    }
  }

  const exports = [
    {
      type: 'pdf'  as ExportType,
      icon: FileText,
      label: 'Production Brief',
      desc: 'Printable PDF with all details, script, prompts & graphics',
      color: 'text-rose-400',
      bg: 'bg-rose-400/10 border-rose-400/20',
    },
    {
      type: 'json' as ExportType,
      icon: FileJson,
      label: 'JSON Data',
      desc: 'Structured data export — all fields, prompts, script, URLs',
      color: 'text-sky-400',
      bg: 'bg-sky-400/10 border-sky-400/20',
    },
    {
      type: 'zip'  as ExportType,
      icon: Archive,
      label: 'Full ZIP Package',
      desc: 'README + script + prompts.md + data.json + all graphics files',
      color: 'text-violet-400',
      bg: 'bg-violet-400/10 border-violet-400/20',
    },
  ]

  return (
    <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
            <Download size={12} className="text-brand-300" />
          </div>
          <span className="text-sm font-semibold text-white">Export</span>
        </div>
        {open
          ? <ChevronUp size={14} className="text-brand-500 shrink-0" />
          : <ChevronDown size={14} className="text-brand-500 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-white/[0.05] p-5 space-y-3">
          {exports.map(e => {
            const Icon = e.icon
            const isLoading = loading === e.type
            const isDone    = done    === e.type
            return (
              <button key={e.type} onClick={() => handleExport(e.type)} disabled={isLoading}
                className="w-full flex items-start gap-3.5 p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all text-left disabled:opacity-50 group">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${e.bg}`}>
                  <Icon size={14} className={e.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-200 group-hover:text-white transition-colors">{e.label}</p>
                  <p className="text-[11px] text-brand-500 mt-0.5 leading-snug">{e.desc}</p>
                </div>
                <div className="shrink-0 mt-1">
                  {isLoading
                    ? <Loader2 size={14} className="animate-spin text-brand-500" />
                    : isDone
                      ? <Check size={14} className="text-success" />
                      : <Download size={14} className="text-brand-600 group-hover:text-brand-300 transition-colors" />
                  }
                </div>
              </button>
            )
          })}
          <p className="text-[10px] text-brand-700 pt-1">
            ZIP includes all uploaded graphics. Large packages may take a few seconds.
          </p>
        </div>
      )}
    </div>
  )
}
