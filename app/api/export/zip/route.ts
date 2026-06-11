import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NICHE_LABELS } from '@/lib/constants'
import JSZip from 'jszip'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 5, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
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
    db.from('checklist_items').select('label,is_done,done_by').eq('scenario_id', id).order('sort_order'),
  ])

  if (!scenario) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const zip = new JSZip()
  const slug = scenario.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ?? id

  // 1. README / brief as plain text
  const done  = (checklist ?? []).filter(c => c.is_done).length
  const total = (checklist ?? []).length
  let brief = `VEANK STUDIO — PRODUCTION BRIEF\n${'='.repeat(40)}\n\n`
  brief += `Title:    ${scenario.title}\n`
  brief += `Hook:     ${scenario.hook}\n`
  brief += `Niche:    ${NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche}\n`
  if (scenario.audience) brief += `Audience: ${scenario.audience}\n`
  if (scenario.emotion)  brief += `Emotion:  ${scenario.emotion}\n`
  if (scenario.palette)  brief += `Palette:  ${scenario.palette}\n`
  if (scenario.notes)    brief += `\nNotes:\n${scenario.notes}\n`
  brief += `\nStatus:   ${scenario.status?.toUpperCase()}\n`
  brief += `Created:  ${new Date(scenario.created_at).toLocaleDateString()}\n`
  brief += `\nCHECKLIST (${done}/${total} done)\n${'-'.repeat(30)}\n`
  for (const c of checklist ?? []) {
    brief += `${c.is_done ? '✓' : '○'} ${c.label}${c.done_by ? ` (${c.done_by})` : ''}\n`
  }
  zip.file('README.txt', brief)

  // 2. Script
  if (script?.body) {
    const wordCount = script.body.trim().split(/\s+/).length
    let scriptTxt = `VOICEOVER SCRIPT\n${'='.repeat(40)}\n`
    scriptTxt += `~${wordCount} words · ~${script.duration_sec}s\n\n`
    scriptTxt += script.body
    zip.file('script.txt', scriptTxt)
  }

  // 3. Prompts as markdown
  if ((prompts ?? []).length > 0) {
    let md = `# AI Prompts\n\n`
    for (const p of prompts ?? []) {
      md += `## Scene: ${p.scene_type}\n`
      md += `**Tool:** ${p.ai_tool}  \n`
      if (p.caption_word) md += `**Caption:** ${p.caption_word}  \n`
      md += `\n\`\`\`\n${p.prompt_text}\n\`\`\`\n\n`
    }
    zip.file('prompts.md', md)
  }

  // 4. JSON data export
  const jsonPayload = {
    exported_at: new Date().toISOString(),
    scenario: { id: scenario.id, title: scenario.title, hook: scenario.hook, niche: scenario.niche, status: scenario.status },
    script: script ? { body: script.body, duration_sec: script.duration_sec } : null,
    prompts: prompts ?? [],
    graphics: (graphics ?? []).map(g => ({ file_name: g.file_name, file_url: g.file_url, media_type: g.media_type })),
    video: video ?? null,
  }
  zip.file('data.json', JSON.stringify(jsonPayload, null, 2))

  // 5. Graphics list (we can't proxy-download from storage here without auth, so include a manifest)
  if ((graphics ?? []).length > 0) {
    const folder = zip.folder('graphics')!
    let manifest = `GRAPHICS MANIFEST\n${'='.repeat(40)}\n\n`
    for (const g of graphics ?? []) {
      manifest += `[${g.media_type?.toUpperCase() ?? 'IMAGE'}] ${g.file_name}\n`
      manifest += `  Scene: ${g.scene_type ?? 'n/a'}  Caption: ${g.caption_word ?? 'n/a'}\n`
      manifest += `  URL: ${g.file_url}\n\n`
    }
    folder.file('_manifest.txt', manifest)

    // Download each graphic and include it
    const downloads = (graphics ?? []).map(async (g) => {
      try {
        const res = await fetch(g.file_url, { signal: AbortSignal.timeout(10000) })
        if (res.ok) {
          const buf = await res.arrayBuffer()
          folder.file(g.file_name, buf)
        }
      } catch { /* skip failed downloads */ }
    })
    await Promise.all(downloads)
  }

  // 6. Video links
  if (video) {
    let videoTxt = `VIDEO LINKS\n${'='.repeat(40)}\n\n`
    if (video.file_url) videoTxt += `File URL: ${video.file_url}\n`
    const platforms = video.platform_urls as Record<string, string> | null
    if (platforms) {
      for (const [k, v] of Object.entries(platforms)) {
        if (v) videoTxt += `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}\n`
      }
    }
    if (video.publish_date) videoTxt += `\nPublish Date: ${video.publish_date}\n`
    zip.file('video-links.txt', videoTxt)
  }

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' })

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}-export.zip"`,
    },
  })
}
