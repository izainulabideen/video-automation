'use client'
import Image from 'next/image'
import { Film, ImageIcon, Hash } from 'lucide-react'

type Prompt = {
  id: string
  scene_type: string | null
  prompt_text: string
  ai_tool: string | null
  caption_word: string | null
  sort_order: number
}

type Graphic = {
  id: string
  file_url: string
  file_name: string
  media_type?: string | null
  scene_type?: string | null
  sort_order: number
}

interface Props {
  prompts: Prompt[]
  graphics: Graphic[]
}

function MediaThumb({ g }: { g: Graphic }) {
  const isClip = g.media_type === 'clip' || g.file_name?.match(/\.(mp4|mov|webm|avi)$/i)
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-white/[0.08] bg-[#0A0E15]">
      {isClip ? (
        <>
          <video src={g.file_url} className="w-full h-full object-cover opacity-70" muted />
          <div className="absolute inset-0 flex items-center justify-center">
            <Film size={16} className="text-white/50" />
          </div>
        </>
      ) : (
        <Image src={g.file_url} alt={g.file_name} fill sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover" />
      )}
      <p className="absolute bottom-0 left-0 right-0 text-[9px] text-white/70 bg-black/60 px-1.5 py-1 truncate">
        {g.file_name}
      </p>
    </div>
  )
}

export function StoryboardView({ prompts, graphics }: Props) {
  // Try to match graphics to prompts by scene_type
  function graphicsForPrompt(p: Prompt): Graphic[] {
    if (p.scene_type) {
      const matched = graphics.filter(g => g.scene_type === p.scene_type)
      if (matched.length) return matched
    }
    return []
  }

  const unmatched = graphics.filter(g => {
    if (!g.scene_type) return true
    return !prompts.some(p => p.scene_type === g.scene_type)
  })

  if (!prompts.length && !graphics.length) {
    return (
      <div className="flex flex-col items-center py-12 gap-2 text-center">
        <Hash size={20} className="text-brand-700" />
        <p className="text-sm text-brand-500">No prompts or graphics yet</p>
        <p className="text-[11px] text-brand-700">Add prompts and upload graphics to see the storyboard</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prompts.map((p, i) => {
        const matched = graphicsForPrompt(p)
        return (
          <div key={p.id} className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.025] transition-colors">
            {/* Prompt side */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold text-brand-600 tabular-nums">#{i + 1}</span>
                {p.scene_type && (
                  <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wide">{p.scene_type.replace(/_/g, ' ')}</span>
                )}
                {p.caption_word && (
                  <span className="text-[10px] font-bold bg-accent/15 text-accent border border-accent/25 px-2 py-0.5 rounded-full">{p.caption_word}</span>
                )}
                {p.ai_tool && (
                  <span className="text-[10px] text-brand-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">{p.ai_tool}</span>
                )}
              </div>
              <p className="text-xs font-mono text-brand-400 leading-relaxed bg-black/20 rounded-lg px-3 py-2 border border-white/[0.04]">
                {p.prompt_text}
              </p>
            </div>

            {/* Graphics side */}
            <div className="flex flex-col gap-2">
              {matched.length > 0 ? (
                <div className={`grid gap-1.5 ${matched.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {matched.slice(0, 4).map(g => <MediaThumb key={g.id} g={g} />)}
                </div>
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-white/[0.06] flex flex-col items-center justify-center gap-1.5">
                  <ImageIcon size={16} className="text-brand-700" />
                  <p className="text-[10px] text-brand-700 text-center px-2">No graphic matched</p>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Unmatched graphics */}
      {unmatched.length > 0 && (
        <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.01]">
          <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-wider mb-3">Unassigned Graphics ({unmatched.length})</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {unmatched.map(g => <MediaThumb key={g.id} g={g} />)}
          </div>
        </div>
      )}
    </div>
  )
}
