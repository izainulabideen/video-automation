import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'
import { NICHE_LABELS } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 10, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
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
    db.from('graphics').select('id,file_name,file_url,media_type,scene_type,caption_word').eq('scenario_id', id).order('sort_order'),
    db.from('videos').select('*').eq('scenario_id', id).single(),
    db.from('checklist_items').select('label,is_done,done_by').eq('scenario_id', id).order('sort_order'),
  ])

  if (!scenario) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const nicheLabel = NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche ?? ''
  const wordCount  = script?.body ? script.body.trim().split(/\s+/).length : 0
  const done = (checklist ?? []).filter(c => c.is_done).length
  const platforms = video?.platform_urls as Record<string, string> | null

  const images = (graphics ?? []).filter(g => g.media_type !== 'clip' && !g.file_name?.match(/\.(mp4|mov|webm)$/i))

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${scenario.title} — Production Brief</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #111; background: #fff; font-size: 12pt; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 48px; }
  header { border-bottom: 3px solid #C8922A; padding-bottom: 24px; margin-bottom: 32px; }
  .brand { font-size: 10pt; font-weight: bold; letter-spacing: 0.2em; color: #C8922A; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 22pt; font-weight: bold; line-height: 1.2; margin-bottom: 8px; }
  .hook { font-size: 13pt; color: #444; font-style: italic; margin-bottom: 16px; }
  .meta { display: flex; gap: 24px; flex-wrap: wrap; font-size: 10pt; color: #666; }
  .meta span { display: flex; align-items: center; gap: 4px; }
  .meta strong { color: #111; }
  section { margin-bottom: 28px; }
  h2 { font-size: 11pt; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #C8922A; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin-bottom: 14px; }
  .script { background: #f9f9f9; border-left: 3px solid #C8922A; padding: 16px 20px; font-family: 'Georgia', serif; font-size: 11pt; line-height: 1.8; white-space: pre-wrap; }
  .prompt-card { border: 1px solid #e5e5e5; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; page-break-inside: avoid; }
  .prompt-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .scene-type { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #555; }
  .caption-badge { background: #C8922A; color: white; font-size: 8pt; font-weight: bold; padding: 1px 8px; border-radius: 3px; }
  .tool-badge { background: #f0f0f0; color: #555; font-size: 8pt; padding: 1px 8px; border-radius: 3px; }
  .prompt-text { font-family: monospace; font-size: 9.5pt; color: #333; line-height: 1.6; }
  .checklist { list-style: none; }
  .checklist li { display: flex; align-items: baseline; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f0f0f0; font-size: 11pt; }
  .check { width: 14px; height: 14px; border: 1.5px solid #C8922A; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; font-size: 9pt; color: #C8922A; flex-shrink: 0; }
  .check.done { background: #C8922A; color: white; }
  .done-by { font-size: 9pt; color: #888; margin-left: auto; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
  .grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px; border: 1px solid #e5e5e5; }
  .platform { font-size: 10pt; color: #555; margin-bottom: 6px; }
  .platform strong { color: #111; min-width: 80px; display: inline-block; }
  .platform a { color: #C8922A; word-break: break-all; }
  .field-row { display: grid; grid-template-columns: 120px 1fr; gap: 8px; margin-bottom: 8px; font-size: 11pt; }
  .field-label { color: #888; font-size: 10pt; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 9pt; color: #aaa; display: flex; justify-content: space-between; }
  @media print {
    body { font-size: 11pt; }
    .page { padding: 24px; }
    a { color: #C8922A !important; }
    .prompt-card, .checklist li { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="brand">Veank Studio · Production Brief</div>
    <h1>${escapeHtml(scenario.title ?? '')}</h1>
    <div class="hook">"${escapeHtml(scenario.hook ?? '')}"</div>
    <div class="meta">
      <span><strong>Niche:</strong> ${escapeHtml(nicheLabel)}</span>
      ${scenario.audience ? `<span><strong>Audience:</strong> ${escapeHtml(scenario.audience)}</span>` : ''}
      ${scenario.emotion  ? `<span><strong>Emotion:</strong> ${escapeHtml(scenario.emotion)}</span>`  : ''}
      ${scenario.palette  ? `<span><strong>Palette:</strong> ${escapeHtml(scenario.palette)}</span>`  : ''}
      <span><strong>Status:</strong> ${escapeHtml(scenario.status ?? '')}</span>
      <span><strong>Created:</strong> ${new Date(scenario.created_at).toLocaleDateString()}</span>
    </div>
  </header>

  ${scenario.notes ? `
  <section>
    <h2>Notes</h2>
    <p style="font-size:11pt;color:#444;line-height:1.7">${escapeHtml(scenario.notes)}</p>
  </section>` : ''}

  <section>
    <h2>Checklist (${done}/${(checklist ?? []).length} complete)</h2>
    <ul class="checklist">
      ${(checklist ?? []).map(c => `
      <li>
        <span class="check${c.is_done ? ' done' : ''}">${c.is_done ? '✓' : ''}</span>
        <span style="${c.is_done ? 'text-decoration:line-through;color:#888' : ''}">${escapeHtml(c.label)}</span>
        ${c.done_by ? `<span class="done-by">${escapeHtml(c.done_by)}</span>` : ''}
      </li>`).join('')}
    </ul>
  </section>

  ${script?.body ? `
  <section>
    <h2>Script · ${wordCount} words · ~${script.duration_sec}s</h2>
    <div class="script">${escapeHtml(script.body)}</div>
  </section>` : ''}

  ${(prompts ?? []).length > 0 ? `
  <section>
    <h2>AI Prompts (${(prompts ?? []).length})</h2>
    ${(prompts ?? []).map(p => `
    <div class="prompt-card">
      <div class="prompt-header">
        <span class="scene-type">${escapeHtml(p.scene_type ?? '')}</span>
        ${p.caption_word ? `<span class="caption-badge">${escapeHtml(p.caption_word)}</span>` : ''}
        <span class="tool-badge">${escapeHtml(p.ai_tool ?? '')}</span>
      </div>
      <div class="prompt-text">${escapeHtml(p.prompt_text ?? '')}</div>
    </div>`).join('')}
  </section>` : ''}

  ${images.length > 0 ? `
  <section>
    <h2>Graphics (${images.length} images)</h2>
    <div class="grid">
      ${images.slice(0, 12).map(g => `<img src="${g.file_url}" alt="${escapeHtml(g.file_name)}" />`).join('')}
    </div>
    ${images.length > 12 ? `<p style="font-size:10pt;color:#888;margin-top:8px">+ ${images.length - 12} more</p>` : ''}
  </section>` : ''}

  ${video ? `
  <section>
    <h2>Final Video</h2>
    ${video.file_url ? `<div class="platform"><strong>File:</strong> <a href="${video.file_url}">${video.file_url}</a></div>` : ''}
    ${platforms ? Object.entries(platforms).filter(([,v]) => v).map(([k,v]) =>
      `<div class="platform"><strong>${k.charAt(0).toUpperCase()+k.slice(1)}:</strong> <a href="${v}">${v}</a></div>`
    ).join('') : ''}
    ${video.publish_date ? `<div class="platform"><strong>Publish Date:</strong> ${video.publish_date}</div>` : ''}
  </section>` : ''}

  <footer>
    <span>Veank Studio</span>
    <span>Generated ${new Date().toLocaleString()}</span>
  </footer>
</div>
<script>window.onload = () => window.print()</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
