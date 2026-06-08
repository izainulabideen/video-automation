'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { duplicateScenario } from '@/actions/scenarios'
import { Copy } from 'lucide-react'

export function DuplicateScenarioButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDuplicate() {
    setLoading(true)
    const result = await duplicateScenario(id)
    if (result.success && result.data) {
      router.push(`/scenarios/${result.data.id}`)
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-[11px] text-brand-400 hover:text-brand-200 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-lg px-2.5 py-1.5 transition-all disabled:opacity-40"
    >
      <Copy size={12} />
      {loading ? 'Duplicating…' : 'Duplicate'}
    </button>
  )
}
