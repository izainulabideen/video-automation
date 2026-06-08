'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { List, LayoutGrid } from 'lucide-react'

export function ViewToggle() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const view         = searchParams.get('view') ?? 'list'

  function setView(v: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', v)
    router.push(`/scenarios?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-lg p-1">
      <button onClick={() => setView('list')}
        className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-accent/15 text-accent' : 'text-brand-500 hover:text-brand-300'}`}
        title="List view">
        <List size={13} />
      </button>
      <button onClick={() => setView('kanban')}
        className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-accent/15 text-accent' : 'text-brand-500 hover:text-brand-300'}`}
        title="Kanban view">
        <LayoutGrid size={13} />
      </button>
    </div>
  )
}
