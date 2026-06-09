'use client'
import { useState } from 'react'
import { toggleBrandActive } from '@/actions/brands'

export function BrandToggle({ id, initial }: { id: string; initial: boolean }) {
  const [active, setActive] = useState(initial)
  const [loading, setLoading] = useState(false)
  async function toggle() {
    setLoading(true)
    await toggleBrandActive(id, !active)
    setActive(a => !a)
    setLoading(false)
  }
  return (
    <button onClick={toggle} disabled={loading}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${active ? 'bg-emerald-500' : 'bg-white/10'} disabled:opacity-50`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

