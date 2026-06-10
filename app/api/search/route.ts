import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 30, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const db = createAdminClient()
  const like = `%${q}%`

  const [
    { data: scenarios },
    { data: scripts },
    { data: prompts },
  ] = await Promise.all([
    db.from('scenarios')
      .select('id, title, hook, niche, status')
      .or(`title.ilike.${like},hook.ilike.${like},notes.ilike.${like}`)
      .limit(8),
    db.from('scripts')
      .select('scenario_id, body, scenarios!inner(id, title, niche, status)')
      .ilike('body', like)
      .limit(5),
    db.from('prompts')
      .select('id, prompt_text, scene_type, ai_tool, scenario_id, scenarios!inner(id, title, niche, status)')
      .or(`prompt_text.ilike.${like},scene_type.ilike.${like},caption_word.ilike.${like}`)
      .limit(5),
  ])

  type ScenarioRef = { id: string; title: string; niche: string; status: string }

  const results = [
    ...(scenarios ?? []).map(s => ({
      id:     s.id,
      type:   'scenario',
      title:  s.title,
      sub:    s.hook ?? '',
      href:   `/scenarios/${s.id}`,
      niche:  s.niche,
      status: s.status,
    })),
    ...(scripts ?? []).map((s: { scenario_id: string; body: string; scenarios: ScenarioRef | ScenarioRef[] | null }) => {
      const sc = Array.isArray(s.scenarios) ? s.scenarios[0] : s.scenarios
      const excerpt = s.body.length > 80 ? s.body.slice(0, 80) + '…' : s.body
      return {
        id:     `script-${s.scenario_id}`,
        type:   'script',
        title:  sc?.title ?? 'Script',
        sub:    excerpt,
        href:   `/scenarios/${s.scenario_id}`,
        niche:  sc?.niche,
        status: sc?.status,
      }
    }),
    ...(prompts ?? []).map((p: { id: string; prompt_text: string; scene_type: string; ai_tool: string; scenario_id: string; scenarios: ScenarioRef | ScenarioRef[] | null }) => {
      const sc = Array.isArray(p.scenarios) ? p.scenarios[0] : p.scenarios
      const excerpt = p.prompt_text.length > 80 ? p.prompt_text.slice(0, 80) + '…' : p.prompt_text
      return {
        id:     p.id,
        type:   'prompt',
        title:  sc?.title ?? 'Prompt',
        sub:    `[${p.scene_type}] ${excerpt}`,
        href:   `/scenarios/${p.scenario_id}`,
        niche:  sc?.niche,
        status: sc?.status,
      }
    }),
  ]

  return NextResponse.json(results)
}
