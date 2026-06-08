'use client'
import { useState, useTransition } from 'react'
import { toggleBrandActive } from '@/actions/brands'
import { useRouter } from 'next/navigation'

export function BrandToggle({ brandId, isActive }: { brandId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      await toggleBrandActive(brandId, next)
      router.refresh()
    })
  }

  return (
    <button onClick={toggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${active ? 'bg-accent' : 'bg-white/10'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}
