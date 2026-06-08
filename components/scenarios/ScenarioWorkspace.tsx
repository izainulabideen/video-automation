'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateScenario, updateScenarioStatus } from '@/actions/scenarios'
import { createPrompt } from '@/actions/prompts'
import { upsertScript } from '@/actions/scripts'
import { upsertVideo } from '@/actions/videos'
import { createGraphicRecord } from '@/actions/graphics'
import { useDropzone } from 'react-dropzone'
import { Copy, Check, ChevronDown, ChevronUp, Film, Image } from 'lucide-react'
import { NICHES, PALETTES, SCENE_TYPES, VIDEO_STATUS_OPTIONS, AI_TOOL_SUGGESTIONS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Scenario = Database['public']['Tables']['scenarios']['Row']
type Prompt   = Database['public']['Tables']['prompts']['Row']
type Script   = Database['public']['Tables']['scripts']['Row']
type Graphic  = Database['public']['Tables']['graphics']['Row'] & { media_type?: string; clip_duration_sec?: number | null }
type Video    = Database['public']['Tables']['videos']['Row']

interface Props {
  scenario: Scenario
  prompts:  Prompt[]
  script?:  Script
  graphics: Graphic[]
  video?:   Video
}

const STATUS_OPTIONS = [
  { value: 'draft',         label: 'Draft' },
  { value: 'in_production', label: 'In Production' },
  { value: 'published',     label: 'Published' },
]

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-lg border border-brand-200 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-brand-50 transition-colors"
      >
        <span className="text-sm font-semibold text-brand-800">{title}</span>
        {open ? <ChevronUp size={15} className="text-brand-400" /> : <ChevronDown size={15} className="text-brand-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="shrink-0 border border-brand-200 rounded p-1 hover:bg-brand-100 text-brand-500"
      title="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

function MediaThumbnail({ g }: { g: Graphic }) {
  const isClip = g.media_type === 'clip' || g.file_name?.match(/\.(mp4|mov|webm|avi)$/i)
  return (
    <a key={g.id} href={g.file_url} target="_blank" rel="noreferrer" className="relative group block">
      {isClip ? (
        <div className="rounded aspect-square bg-brand-900 border border-brand-200 flex flex-col items-center justify-center gap-1 hover:opacity-80 transition overflow-hidden relative">
          <video src={g.file_url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
          <div className="relative z-10 flex flex-col items-center">
            <Film size={18} className="text-white" />
            {g.clip_duration_sec && (
              <span className="text-white text-xs font-mono mt-1">{g.clip_duration_sec}s</span>
            )}
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={g.file_url} alt={g.file_name}
          className="rounded aspect-square object-cover w-full border border-brand-200 hover:opacity-80 transition" />
      )}
      <span className="absolute bottom-1 left-1 right-1 text-center text-xs text-white/80 truncate opacity-0 group-hover:opacity-100 transition bg-black/40 rounded px-1">
        {g.file_name}
      </span>
    </a>
  )
}

export function ScenarioWorkspace({ scenario, prompts, script, graphics, video }: Props) {
  const router = useRouter()
  const id = scenario.id

  // ── Details ────────────────────────────────────────────────────────────────
  const [editingDetails, setEditingDetails] = useState(false)
  const [detailSaving,   setDetailSaving]   = useState(false)
  const [statusSaving,   setStatusSaving]   = useState(false)

  async function saveDetails(fd: FormData) {
    setDetailSaving(true)
    await updateScenario(id, fd)
    setDetailSaving(false)
    setEditingDetails(false)
    router.refresh()
  }

  async function changeStatus(status: string) {
    setStatusSaving(true)
    await updateScenarioStatus(id, status as never)
    setStatusSaving(false)
    router.refresh()
  }

  // ── Prompts ────────────────────────────────────────────────────────────────
  const [showPromptForm, setShowPromptForm] = useState(false)
  const [promptSaving,   setPromptSaving]   = useState(false)

  async function savePrompt(fd: FormData) {
    setPromptSaving(true)
    fd.set('scenario_id', id)
    await createPrompt(fd)
    setPromptSaving(false)
    setShowPromptForm(false)
    router.refresh()
  }

  // ── Script ─────────────────────────────────────────────────────────────────
  const [scriptBody,  setScriptBody]  = useState(script?.body ?? '')
  const [scriptSaving, setScriptSaving] = useState(false)
  const [scriptSaved,  setScriptSaved]  = useState(false)

  async function saveScript() {
    setScriptSaving(true)
    const fd = new FormData(); fd.set('body', scriptBody)
    await upsertScript(id, fd)
    setScriptSaving(false); setScriptSaved(true)
    setTimeout(() => setScriptSaved(false), 2000)
  }

  // ── Media (images + clips) ─────────────────────────────────────────────────
  const [uploading, setUploading] = useState(false)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    onDrop: async (files) => {
      setUploading(true)
      for (const file of files) {
        const isClip = file.type.startsWith('video/')
        const res = await fetch('/api/upload/graphics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileType: file.type, scenarioId: id }),
        })
        const { uploadUrl, fileUrl } = await res.json() as { uploadUrl: string; fileUrl: string }
        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        await createGraphicRecord({
          scenarioId: id,
          fileUrl,
          fileName: file.name,
          fileSizeKb: Math.round(file.size / 1024),
          mediaType: isClip ? 'clip' : 'image',
        })
      }
      setUploading(false)
      router.refresh()
    },
  })

  // ── Video ──────────────────────────────────────────────────────────────────
  const [videoSaving, setVideoSaving] = useState(false)
  const platforms = video?.platform_urls as Record<string, string> | null

  async function saveVideo(fd: FormData) {
    setVideoSaving(true)
    await upsertVideo(id, fd)
    setVideoSaving(false)
    router.refresh()
  }

  const images = graphics.filter(g => g.media_type !== 'clip' && !g.file_name?.match(/\.(mp4|mov|webm|avi)$/i))
  const clips  = graphics.filter(g => g.media_type === 'clip'  || g.file_name?.match(/\.(mp4|mov|webm|avi)$/i))

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mt-4">

      {/* Details */}
      <Section title="Details">
        {editingDetails ? (
          <form action={saveDetails} className="space-y-3">
            {([
              { name: 'title', label: 'Title', required: true },
              { name: 'hook',  label: 'Hook',  required: true },
            ] as const).map(f => (
              <div key={f.name}>
                <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</label>
                <input name={f.name} required defaultValue={scenario[f.name] ?? ''}
                  className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
            ))}
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Niche</label>
              <select name="niche" defaultValue={scenario.niche ?? ''}
                className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            {([
              { name: 'audience', label: 'Audience' },
              { name: 'emotion',  label: 'Emotion' },
            ] as const).map(f => (
              <div key={f.name}>
                <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</label>
                <input name={f.name} defaultValue={scenario[f.name] ?? ''}
                  className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
            ))}
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Palette</label>
              <select name="palette" defaultValue={scenario.palette ?? ''}
                className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
                <option value="">None</option>
                {PALETTES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Notes</label>
              <textarea name="notes" rows={3} defaultValue={scenario.notes ?? ''}
                className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={detailSaving}
                className="bg-accent text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-accent-h">
                {detailSaving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditingDetails(false)}
                className="border border-brand-300 rounded-md px-4 py-2 text-sm hover:bg-brand-100">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {([
              { label: 'Hook',     value: scenario.hook },
              { label: 'Audience', value: scenario.audience },
              { label: 'Emotion',  value: scenario.emotion },
              { label: 'Palette',  value: scenario.palette },
              { label: 'Notes',    value: scenario.notes },
            ] as { label: string; value: string | null }[]).filter(f => f.value).map(f => (
              <div key={f.label}>
                <p className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</p>
                <p className="text-sm text-brand-700 mt-0.5">{f.value}</p>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setEditingDetails(true)}
                className="border border-brand-300 rounded-md px-3 py-1.5 text-xs hover:bg-brand-100">
                Edit Details
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-500">Status:</span>
                <select
                  defaultValue={scenario.status ?? 'draft'}
                  onChange={e => changeStatus(e.target.value)}
                  disabled={statusSaving}
                  className="border border-brand-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-accent outline-none disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Prompts */}
      <Section title={`Prompts (${prompts.length})`}>
        <div className="space-y-2 mb-3">
          {prompts.map(p => (
            <div key={p.id} className="border border-brand-200 rounded-md p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">{p.scene_type}</span>
                  {p.caption_word && (
                    <span className="text-xs font-mono bg-brand-100 px-2 py-0.5 rounded text-brand-700">{p.caption_word}</span>
                  )}
                  <span className="text-xs text-brand-400 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">{p.ai_tool}</span>
                </div>
                <CopyButton text={p.prompt_text} />
              </div>
              <p className="text-xs font-mono bg-brand-50 px-2 py-1.5 rounded text-brand-700 leading-relaxed whitespace-pre-wrap">{p.prompt_text}</p>
            </div>
          ))}
        </div>

        {showPromptForm ? (
          <form action={savePrompt} className="border border-brand-200 rounded-md p-4 space-y-3 bg-brand-50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Scene Type</label>
                <select name="scene_type" required
                  className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none">
                  <option value="">Select…</option>
                  {SCENE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Caption Word</label>
                <input name="caption_word"
                  className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Prompt Text</label>
              <textarea name="prompt_text" required rows={4}
                className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm font-mono focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">AI Tool</label>
              <input
                name="ai_tool"
                list="ai-tools-list"
                placeholder="e.g. Midjourney, Sora, Kling…"
                defaultValue="Midjourney"
                className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <datalist id="ai-tools-list">
                {AI_TOOL_SUGGESTIONS.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={promptSaving}
                className="bg-accent text-white rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-accent-h">
                {promptSaving ? 'Saving…' : 'Add Prompt'}
              </button>
              <button type="button" onClick={() => setShowPromptForm(false)}
                className="border border-brand-300 rounded-md px-3 py-1.5 text-xs hover:bg-brand-100">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowPromptForm(true)}
            className="border border-dashed border-brand-300 rounded-md px-4 py-2 text-xs text-brand-500 hover:border-accent hover:text-accent w-full transition-colors">
            + Add Prompt
          </button>
        )}
      </Section>

      {/* Script */}
      <Section title="Script">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-brand-500">
            {scriptBody.trim() ? `~${scriptBody.trim().split(/\s+/).length} words` : 'No script yet'}
          </span>
          <CopyButton text={scriptBody} />
        </div>
        <textarea
          value={scriptBody}
          onChange={e => setScriptBody(e.target.value)}
          rows={12}
          placeholder="Write or paste the script here…"
          className="w-full border border-brand-300 rounded-md px-3 py-2 text-sm leading-relaxed focus:ring-2 focus:ring-accent outline-none"
        />
        <button onClick={saveScript} disabled={scriptSaving}
          className="mt-2 bg-accent text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-accent-h">
          {scriptSaving ? 'Saving…' : scriptSaved ? 'Saved!' : 'Save Script'}
        </button>
      </Section>

      {/* Media: Images + Clips */}
      <Section title={`Media · ${images.length} image${images.length !== 1 ? 's' : ''} · ${clips.length} clip${clips.length !== 1 ? 's' : ''}`} defaultOpen={false}>
        {/* Upload zone */}
        <div {...getRootProps()}
          className={`mb-4 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition ${
            isDragActive ? 'border-accent bg-accent/5' : 'border-brand-300 hover:border-accent'
          }`}>
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-3 text-brand-400">
            <Image size={16} />
            <span className="text-sm">Images</span>
            <span className="text-brand-300">|</span>
            <Film size={16} />
            <span className="text-sm">Video Clips</span>
          </div>
          <p className="text-xs text-brand-400 mt-1">
            {uploading ? 'Uploading…' : 'Drop images or video clips (.mp4, .mov, .webm) · click to browse'}
          </p>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-brand-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Image size={11} /> Images ({images.length})
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {images.map(g => <MediaThumbnail key={g.id} g={g} />)}
            </div>
          </div>
        )}

        {/* Clips */}
        {clips.length > 0 && (
          <div>
            <p className="text-xs text-brand-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Film size={11} /> Clips ({clips.length})
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {clips.map(g => <MediaThumbnail key={g.id} g={g} />)}
            </div>
          </div>
        )}
      </Section>

      {/* Video */}
      <Section title="Final Video" defaultOpen={false}>
        <form action={saveVideo} className="space-y-3">
          {([
            { name: 'file_url', label: 'File URL',    value: video?.file_url ?? '' },
            { name: 'tiktok',   label: 'TikTok URL',  value: platforms?.['tiktok'] ?? '' },
            { name: 'youtube',  label: 'YouTube URL', value: platforms?.['youtube'] ?? '' },
            { name: 'reels',    label: 'Reels URL',   value: platforms?.['reels'] ?? '' },
          ] as const).map(f => (
            <div key={f.name} className="flex items-center gap-2">
              <label className="text-xs text-brand-500 w-24 shrink-0">{f.label}</label>
              <input name={f.name} defaultValue={f.value}
                className="flex-1 border border-brand-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
              {f.value && <CopyButton text={f.value} />}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Status</label>
              <select name="status" defaultValue={video?.status ?? 'editing'}
                className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none">
                {VIDEO_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Duration (sec)</label>
              <input name="duration_sec" type="number" defaultValue={video?.duration_sec ?? ''}
                className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Publish Date</label>
            <input name="publish_date" type="date" defaultValue={video?.publish_date ?? ''}
              className="mt-1 w-full border border-brand-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          </div>
          <button type="submit" disabled={videoSaving}
            className="bg-accent text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-accent-h">
            {videoSaving ? 'Saving…' : 'Save Video'}
          </button>
        </form>
      </Section>

    </div>
  )
}
