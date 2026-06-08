import { createAdminClient } from '@/lib/supabase/admin'
import { GraphicsGallery } from '@/components/graphics/GraphicsGallery'
import { GraphicsUploader } from '@/components/graphics/GraphicsUploader'

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioGraphicsPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: graphics } = await supabase
    .from('graphics')
    .select('id, file_url, file_name, scene_type, caption_word, sort_order, scenario_id, prompt_id, file_size_kb, created_at')
    .eq('scenario_id', id)
    .order('sort_order')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Graphics</h1>
      <GraphicsUploader scenarioId={id} />
      <GraphicsGallery graphics={graphics ?? []} scenarioId={id} />
    </div>
  )
}
