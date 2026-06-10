'use client'
import { useState, useEffect, useCallback } from 'react'

interface Frame {
  id: string
  file_url: string
  file_name: string
}

interface Props {
  frames: Frame[]
  accent?: string
}

export function Storyboard({ frames, accent = '#C8922A' }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen(i => (i !== null && i > 0 ? i - 1 : i)), [])
  const next = useCallback(() => setOpen(i => (i !== null && i < frames.length - 1 ? i + 1 : i)), [frames.length])

  useEffect(() => {
    if (open === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {frames.map((g, i) => (
          <button key={g.id} type="button" onClick={() => setOpen(i)}
            className="group relative block rounded-xl overflow-hidden aspect-square border border-white/[0.05] hover:border-white/[0.15] transition-all duration-300 cursor-pointer w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.file_url} alt={g.file_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ filter: 'brightness(0.8)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
            {/* Frame number */}
            <span className="absolute bottom-2 left-2.5 text-[9px] font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* Expand icon */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={close}>

          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />

          {/* Close */}
          <button onClick={close} type="button"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.09] flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[11px] text-white/30 font-mono">
            {open + 1} / {frames.length}
          </div>

          {/* Prev */}
          {open > 0 && (
            <button type="button" onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.08] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          )}

          {/* Next */}
          {open < frames.length - 1 && (
            <button type="button" onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.08] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="relative z-10 max-w-5xl max-h-[85vh] w-full mx-4 md:mx-20"
            onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frames[open]?.file_url}
              alt={frames[open]?.file_name}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
              style={{ maxHeight: '80vh' }}
            />
            {/* Caption */}
            <p className="text-center text-[11px] text-white/25 mt-3 font-mono">
              Frame {String(open + 1).padStart(2, '0')} — {frames[open]?.file_name}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
