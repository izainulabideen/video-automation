import { createAdminClient } from '@/lib/supabase/admin'
import { GraphicCard } from '@/components/graphics/GraphicCard'
import { EmptyState } from '@/components/shared/EmptyState'

export const revalidate = 300

export default async function GraphicsPage() {
  const supabase = createAdminClient()
  const { data: graphics } = await supabase
    .from('graphics')
    .select('id, file_url, file_name, scene_type, caption_word, sort_order, scenario_id, prompt_id, file_size_kb, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Graphics Gallery</h1>
      {!graphics?.length ? (
        <EmptyState title="No graphics yet" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {graphics.map(g => <GraphicCard key={g.id} graphic={g as any} />)}
        </div>
      )}
    </div>
  )
}
