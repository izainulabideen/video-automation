'use client'
import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    // TikTok
    const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)
    if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`
    // Instagram Reels
    if (u.hostname.includes('instagram.com')) return null // Instagram doesn't allow embeds
    // Direct video file
    if (url.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i)) return url
    return null
  } catch { return null }
}

function isDirectVideo(url: string) {
  return url.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i)
}

interface Props {
  url: string
  label?: string
}

export function VideoEmbed({ url, label }: Props) {
  const [show, setShow] = useState(false)
  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <a href={url} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent-2 transition-colors">
        <ExternalLink size={12} />
        {label ?? 'Open video'}
      </a>
    )
  }

  if (!show) {
    return (
      <button onClick={() => setShow(true)}
        className="group relative w-full aspect-video rounded-xl overflow-hidden bg-[#0A0E15] border border-white/[0.08] hover:border-accent/30 transition-all flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-all">
          <Play size={22} className="text-accent ml-1" fill="currentColor" />
        </div>
        {label && (
          <p className="absolute bottom-3 left-3 text-[11px] text-brand-400">{label}</p>
        )}
      </button>
    )
  }

  if (isDirectVideo(url)) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black">
        <video src={url} controls autoPlay className="w-full aspect-video" />
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black">
      <iframe
        src={embedUrl}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
