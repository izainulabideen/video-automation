import { createAdminClient } from '@/lib/supabase/admin'
import { ScriptEditor } from '@/components/scripts/ScriptEditor'

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioScriptPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: script } = await supabase
    .from('scripts')
    .select('*')
    .eq('scenario_id', id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Script</h1>
      <ScriptEditor scenarioId={id} script={script ?? undefined} />
    </div>
  )
}
