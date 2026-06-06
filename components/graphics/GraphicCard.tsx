import Image from 'next/image'
import type { Database } from '@/types/database'

type Graphic = Database['public']['Tables']['graphics']['Row']

export function GraphicCard({ graphic }: { graphic: Graphic }) {
  return (
    <div className="bg-white rounded-lg border border-brand-300 overflow-hidden">
      <div className="relative aspect-video">
        <Image src={graphic.file_url} alt={graphic.file_name} fill className="object-cover" />
      </div>
      <div className="p-3">
        <p className="text-xs text-brand-700 truncate">{graphic.file_name}</p>
        {graphic.scene_type && (
          <p className="text-xs text-brand-500 mt-0.5">{graphic.scene_type}</p>
        )}
      </div>
    </div>
  )
}
