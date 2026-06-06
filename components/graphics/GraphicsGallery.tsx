import { GraphicCard } from './GraphicCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Database } from '@/types/database'

type Graphic = Database['public']['Tables']['graphics']['Row']

export function GraphicsGallery({ graphics, scenarioId }: { graphics: Graphic[]; scenarioId: string }) {
  if (!graphics.length) {
    return <EmptyState title="No graphics yet" description="Upload images for this scenario." />
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {graphics.map(g => <GraphicCard key={g.id} graphic={g} />)}
    </div>
  )
}
