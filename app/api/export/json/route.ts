import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NICHE_LABELS } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 10, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value
  const session = sessionToken ? await verifySessionToken(sessionToken) : null
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const db = createAdminClient()
  const [
    { data: scenario },
    { data: prompts },
    { data: script },
    { data: graphics },
    { data: video },
    { data: checklist },
  ] = await Promise.all([
    db.from('scenarios').select('*').eq('id', id).single(),
    db.from('prompts').select('*').eq('scenario_id', id).order('sort_order'),
    db.from('scripts').select('*').eq('scenario_id', id).single(),
    db.from('graphics').select('id,file_name,file_url,media_type,sort_order,scene_type,caption_word').eq('scenario_id', id).order('sort_order'),
    db.from('videos').select('*').eq('scenario_id', id).single(),
    db.from('checklist_items').select('label,is_done,done_by,done_at').eq('scenario_id', id).order('sort_order'),
  ])

  if (!scenario) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const payload = {
    exported_at: new Date().toISOString(),
    scenario: {
      id: scenario.id,
      title: scenario.title,
      hook: scenario.hook,
      niche: scenario.niche,
      niche_label: NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche,
      audience: scenario.audience,
      emotion: scenario.emotion,
      palette: scenario.palette,
      notes: scenario.notes,
      status: scenario.status,
      created_at: scenario.created_at,
    },
    script: script ? { body: script.body, word_count: script.body?.trim().split(/\s+/).length, duration_sec: script.duration_sec } : null,
    prompts: (prompts ?? []).map(p => ({
      scene_type: p.scene_type,
      ai_tool: p.ai_tool,
      caption_word: p.caption_word,
      prompt_text: p.prompt_text,
    })),
    graphics: (graphics ?? []).map(g => ({
      file_name: g.file_name,
      file_url: g.file_url,
      media_type: g.media_type,
      scene_type: g.scene_type,
      caption_word: g.caption_word,
    })),
    video: video ? {
      file_url: video.file_url,
      duration_sec: video.duration_sec,
      status: video.status,
      platform_urls: video.platform_urls,
      publish_date: video.publish_date,
    } : null,
    checklist: (checklist ?? []).map(c => ({
      label: c.label,
      is_done: c.is_done,
      done_by: c.done_by,
    })),
  }

  const slug = scenario.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? id
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${slug}.json"`,
    },
  })
}
