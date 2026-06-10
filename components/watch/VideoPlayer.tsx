'use client'
import { useState } from 'react'

interface Props {
  src: string
  poster?: string
  title?: string
}

export function VideoPlayer({ src, poster, title }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full flex items-center justify-center bg-black/50"
        style={{ aspectRatio: '16/9' }}>
        <p className="text-white/30 text-sm">Video unavailable</p>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
      <video
        src={src}
        controls
        poster={poster}
        title={title}
        onError={() => setError(true)}
        className="absolute inset-0 w-full h-full object-contain"
        preload="metadata"
      />
    </div>
  )
}
