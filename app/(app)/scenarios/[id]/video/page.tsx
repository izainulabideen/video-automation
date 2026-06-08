import { createAdminClient } from '@/lib/supabase/admin'
import { VideoForm } from '@/components/videos/VideoForm'

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioVideoPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('scenario_id', id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Video</h1>
      <VideoForm scenarioId={id} video={video ?? undefined} />
    </div>
  )
}
