'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateScenario, updateScenarioStatus } from '@/actions/scenarios'
import { upsertPublicSettings } from '@/actions/public-settings'
import type { PublicSettings } from '@/actions/public-settings'
import { createPrompt } from '@/actions/prompts'
import { upsertScript } from '@/actions/scripts'
import { upsertVideo } from '@/actions/videos'
import { createGraphicRecord } from '@/actions/graphics'
import { SortableMedia } from '@/components/scenarios/SortableMedia'
import { AIGeneratePanel } from '@/components/scenarios/AIGeneratePanel'
import { useDropzone } from 'react-dropzone'
import { Copy, Check, ChevronDown, ChevronUp, ExternalLink, Upload, Plus } from 'lucide-react'
import { NICHES, NICHE_LABELS, PALETTES, SCENE_TYPES, VIDEO_STATUS_OPTIONS, AI_TOOL_SUGGESTIONS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Scenario = Database['public']['Tables']['scenarios']['Row']
type Prompt   = Database['public']['Tables']['prompts']['Row']
type Script   = Database['public']['Tables']['scripts']['Row']
type Graphic  = Database['public']['Tables']['graphics']['Row'] & { media_type?: string; clip_duration_sec?: number | null }
type Video    = Database['public']['Tables']['videos']['Row']

interface Props {
  scenario:       Scenario & { cover_graphic_id?: string | null }
  prompts:        Prompt[]
  script?:        Script
  graphics:       Graphic[]
  video?:         Video
  publicSettings: PublicSettings | null
}

const STATUS_OPTIONS = [
  { value: 'draft',         label: 'Draft' },
  { value: 'in_production', label: 'In Production' },
  { value: 'published',     label: 'Published' },
]

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'
const labelCls = 'block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5'

function Section({ title, children, defaultOpen = true, badge }: { title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-white">{title}</span>
          {badge}
        </div>
        {open
          ? <ChevronUp size={14} className="text-brand-500 shrink-0" />
          : <ChevronDown size={14} className="text-brand-500 shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 pt-0.5 border-t border-white/[0.05]">{children}</div>}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="shrink-0 bg-white/[0.04] border border-white/[0.09] rounded-md p-1.5 hover:bg-white/[0.08] text-brand-400 hover:text-brand-200 transition-all"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  )
}

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
        on ? 'bg-accent' : 'bg-white/10'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
        on ? 'translate-x-[18px]' : 'translate-x-0.5'
      }`} />
    </button>
  )
}


export function ScenarioWorkspace({ scenario, prompts, script, graphics, video, publicSettings }: Props) {
  const router = useRouter()
  const id = scenario.id

  // Details
  const [editingDetails, setEditingDetails] = useState(false)
  const [detailSaving,   setDetailSaving]   = useState(false)
  const [statusSaving,   setStatusSaving]   = useState(false)
  const [pubSettings, setPubSettings] = useState<PublicSettings>({
    scenario_id:         scenario.id,
    is_public:           publicSettings?.is_public           ?? false,
    show_script:         publicSettings?.show_script         ?? true,
    show_graphics:       publicSettings?.show_graphics       ?? true,
    show_video:          publicSettings?.show_video          ?? true,
    show_platform_links: publicSettings?.show_platform_links ?? true,
    updated_at:          publicSettings?.updated_at,
    updated_by:          publicSettings?.updated_by,
  })
  const [publicSaving, setPublicSaving] = useState(false)

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

  async function savePublicSettings(next: PublicSettings) {
    setPublicSaving(true)
    await upsertPublicSettings(id, {
      is_public:           next.is_public,
      show_script:         next.show_script,
      show_graphics:       next.show_graphics,
      show_video:          next.show_video,
      show_platform_links: next.show_platform_links,
    })
    setPubSettings(next)
    setPublicSaving(false)
  }

  // Prompts
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

  // Script
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

  // Media
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

  // Video
  const [videoSaving, setVideoSaving] = useState(false)
  const platforms = video?.platform_urls as Record<string, string> | null

  async function saveVideo(fd: FormData) {
    setVideoSaving(true)
    await upsertVideo(id, fd)
    setVideoSaving(false)
    router.refresh()
  }

  return (
    <div className="mt-4">

      {/* AI Generate */}
      <AIGeneratePanel
        scenario={scenario}
        currentScript={scriptBody}
        existingPromptCount={prompts.length}
      />

      {/* Details */}
      <Section title="Details">
        {editingDetails ? (
          <form action={saveDetails} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Title</label>
                <input name="title" required defaultValue={scenario.title ?? ''}
                  className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Hook</label>
                <input name="hook" required defaultValue={scenario.hook ?? ''}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Niche</label>
                <select name="niche" defaultValue={scenario.niche ?? ''}
                  className={inputCls}>
                  {NICHES.map(n => (
                    <option key={n} value={n} className="bg-[#111827]">{NICHE_LABELS[n] ?? n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Palette</label>
                <select name="palette" defaultValue={scenario.palette ?? ''}
                  className={inputCls}>
                  <option value="" className="bg-[#111827]">None</option>
                  {PALETTES.map(p => (
                    <option key={p.value} value={p.value} className="bg-[#111827]">{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Audience</label>
                <input name="audience" defaultValue={scenario.audience ?? ''}
                  placeholder="e.g. 25-40 yr earners"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Emotion</label>
                <input name="emotion" defaultValue={scenario.emotion ?? ''}
                  placeholder="e.g. Urgency"
                  className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Notes</label>
                <textarea name="notes" rows={2} defaultValue={scenario.notes ?? ''}
                  className={`${inputCls} resize-none`} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={detailSaving}
                className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all">
                {detailSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditingDetails(false)}
                className="border border-white/[0.09] rounded-lg px-4 py-2 text-sm text-brand-300 hover:bg-white/[0.04] transition-all">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {([
                { label: 'Hook',     value: scenario.hook },
                { label: 'Niche',    value: NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche },
                { label: 'Audience', value: scenario.audience },
                { label: 'Emotion',  value: scenario.emotion },
                { label: 'Palette',  value: scenario.palette },
              ] as { label: string; value: string | null | undefined }[]).filter(f => f.value).map(f => (
                <div key={f.label}>
                  <p className={labelCls}>{f.label}</p>
                  <p className="text-sm text-brand-200">{f.value}</p>
                </div>
              ))}
              {scenario.notes && (
                <div className="sm:col-span-2">
                  <p className={labelCls}>Notes</p>
                  <p className="text-sm text-brand-400 leading-relaxed">{scenario.notes}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05] flex-wrap">
              <button onClick={() => setEditingDetails(true)}
                className="border border-white/[0.09] rounded-lg px-3.5 py-1.5 text-xs text-brand-300 hover:bg-white/[0.04] hover:text-white transition-all font-medium">
                Edit Details
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-brand-500">Status</span>
                <select
                  defaultValue={scenario.status ?? 'draft'}
                  onChange={e => changeStatus(e.target.value)}
                  disabled={statusSaving}
                  className="bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-1.5 text-xs text-brand-200 focus:border-accent/40 outline-none disabled:opacity-40 transition-all"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value} className="bg-[#111827]">{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Prompts */}
      <Section
        title="Prompts"
        badge={<span className="text-[11px] bg-white/[0.05] border border-white/[0.07] text-brand-400 rounded-full px-2 py-0.5">{prompts.length}</span>}
      >
        <div className="space-y-2.5 pt-4 mb-3">
          {prompts.map(p => (
            <div key={p.id} className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wide">{p.scene_type}</span>
                  {p.caption_word && (
                    <span className="text-[11px] font-mono bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">{p.caption_word}</span>
                  )}
                  <span className="text-[11px] text-brand-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">{p.ai_tool}</span>
                </div>
                <CopyButton text={p.prompt_text} />
              </div>
              <p className="text-xs font-mono bg-black/30 border border-white/[0.05] px-3 py-2 rounded-lg text-brand-300 leading-relaxed whitespace-pre-wrap">{p.prompt_text}</p>
            </div>
          ))}
        </div>

        {showPromptForm ? (
          <form action={savePrompt} className="border border-accent/20 bg-accent/[0.03] rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Scene Type</label>
                <select name="scene_type" required className={inputCls}>
                  <option value="" className="bg-[#111827]">Select…</option>
                  {SCENE_TYPES.map(s => (
                    <option key={s.value} value={s.value} className="bg-[#111827]">{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Caption Word</label>
                <input name="caption_word" placeholder="e.g. TRAP"
                  className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Prompt Text</label>
              <textarea name="prompt_text" required rows={4}
                className={`${inputCls} font-mono resize-none`} />
            </div>
            <div>
              <label className={labelCls}>AI Tool</label>
              <input
                name="ai_tool"
                list="ai-tools-list"
                placeholder="e.g. Midjourney, Sora, Kling…"
                defaultValue="Midjourney"
                className={inputCls}
              />
              <datalist id="ai-tools-list">
                {AI_TOOL_SUGGESTIONS.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={promptSaving}
                className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-all">
                {promptSaving ? 'Saving…' : 'Add Prompt'}
              </button>
              <button type="button" onClick={() => setShowPromptForm(false)}
                className="border border-white/[0.09] rounded-lg px-4 py-2 text-xs text-brand-400 hover:bg-white/[0.04] transition-all">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowPromptForm(true)}
            className="flex items-center justify-center gap-2 w-full border border-dashed border-white/[0.1] rounded-xl px-4 py-3 text-xs text-brand-500 hover:border-accent/40 hover:text-accent transition-all">
            <Plus size={13} />
            Add Prompt
          </button>
        )}
      </Section>

      {/* Script */}
      <Section title="Script">
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-brand-500">
              {scriptBody.trim() ? `~${scriptBody.trim().split(/\s+/).length} words` : 'No script yet'}
            </span>
            <CopyButton text={scriptBody} />
          </div>
          <textarea
            value={scriptBody}
            onChange={e => setScriptBody(e.target.value)}
            rows={12}
            placeholder="Write or paste the script here…"
            className={`${inputCls} resize-none leading-relaxed`}
          />
          <button onClick={saveScript} disabled={scriptSaving}
            className={`mt-3 rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-40 transition-all ${
              scriptSaved
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-gradient-to-r from-accent to-accent-h text-white hover:opacity-90 shadow-lg shadow-accent/20'
            }`}>
            {scriptSaving ? 'Saving…' : scriptSaved ? '✓ Saved!' : 'Save Script'}
          </button>
        </div>
      </Section>

      {/* Media */}
      <Section
        title="Media"
        defaultOpen={false}
        badge={
          <span className="text-[11px] text-brand-500">{graphics.length} file{graphics.length !== 1 ? 's' : ''}</span>
        }
      >
        <div className="pt-4">
          {/* Dropzone */}
          <div {...getRootProps()}
            className={`mb-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-accent/60 bg-accent/[0.05]'
                : 'border-white/[0.08] hover:border-accent/30 hover:bg-white/[0.02]'
            }`}>
            <input {...getInputProps()} />
            <Upload size={22} className={`mx-auto mb-2 ${isDragActive ? 'text-accent' : 'text-brand-500'}`} />
            <p className="text-sm text-brand-300 font-medium mb-1">
              {uploading ? 'Uploading…' : 'Drop images or video clips'}
            </p>
            <p className="text-[11px] text-brand-600">JPG, PNG, GIF, MP4, MOV, WEBM · click to browse</p>
          </div>

          {graphics.length > 0 && (
            <SortableMedia
              scenarioId={id}
              items={graphics.map(g => ({
                id: g.id,
                file_url: g.file_url,
                file_name: g.file_name,
                media_type: g.media_type,
                sort_order: g.sort_order,
              }))}
              coverGraphicId={scenario.cover_graphic_id ?? null}
            />
          )}
        </div>
      </Section>

      {/* Final Video */}
      <Section title="Final Video" defaultOpen={false}>
        <form action={saveVideo} className="space-y-4 pt-4">
          <div className="space-y-3">
            {([
              { name: 'file_url', label: 'File URL',    value: video?.file_url ?? '' },
              { name: 'tiktok',   label: 'TikTok URL',  value: platforms?.['tiktok'] ?? '' },
              { name: 'youtube',  label: 'YouTube URL', value: platforms?.['youtube'] ?? '' },
              { name: 'reels',    label: 'Reels URL',   value: platforms?.['reels'] ?? '' },
            ] as const).map(f => (
              <div key={f.name} className="flex items-center gap-2.5">
                <label className="text-[11px] text-brand-500 w-24 shrink-0 font-medium">{f.label}</label>
                <input name={f.name} defaultValue={f.value} placeholder="https://"
                  className={`${inputCls} flex-1`} />
                {f.value && <CopyButton text={f.value} />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Video Status</label>
              <select name="status" defaultValue={video?.status ?? 'editing'}
                className={inputCls}>
                {VIDEO_STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value} className="bg-[#111827]">{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Duration (sec)</label>
              <input name="duration_sec" type="number" defaultValue={video?.duration_sec ?? ''}
                placeholder="60"
                className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Publish Date</label>
            <input name="publish_date" type="date" defaultValue={video?.publish_date ?? ''}
              className={`${inputCls} w-48`} />
          </div>
          <button type="submit" disabled={videoSaving}
            className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-accent/20">
            {videoSaving ? 'Saving…' : 'Save Video'}
          </button>
        </form>
      </Section>

      {/* Public Settings */}
      <Section
        title={pubSettings.is_public ? 'Public · Live on /watch' : 'Private · Hidden from /watch'}
        defaultOpen={false}
        badge={
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
            pubSettings.is_public
              ? 'bg-success/10 text-success border-success/20'
              : 'bg-white/[0.04] text-brand-500 border-white/[0.07]'
          }`}>
            {pubSettings.is_public ? 'Live' : 'Hidden'}
          </span>
        }
      >
        <div className="space-y-4 pt-4">
          {/* Master toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <div>
              <p className="text-sm font-semibold text-white">Show on public /watch page</p>
              <p className="text-xs text-brand-500 mt-0.5">
                {pubSettings.is_public ? 'Anyone can view this at /watch.' : 'Only your team can see this.'}
              </p>
            </div>
            <Toggle on={pubSettings.is_public} disabled={publicSaving}
              onChange={() => savePublicSettings({ ...pubSettings, is_public: !pubSettings.is_public })} />
          </div>

          {/* Per-section toggles */}
          {pubSettings.is_public && (
            <div className="space-y-2">
              <p className={labelCls}>What to show publicly</p>
              {([
                { key: 'show_script',          label: 'Script',           desc: 'Full written script' },
                { key: 'show_graphics',         label: 'Media / Graphics', desc: 'Images and video clips' },
                { key: 'show_video',            label: 'Final Video',      desc: 'Embedded video player' },
                { key: 'show_platform_links',   label: 'Platform Links',   desc: 'TikTok, YouTube, Reels' },
              ] as { key: keyof PublicSettings; label: string; desc: string }[]).map(item => (
                <div key={String(item.key)} className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
                  <div>
                    <p className="text-sm text-brand-200">{item.label}</p>
                    <p className="text-[11px] text-brand-500">{item.desc}</p>
                  </div>
                  <Toggle on={!!pubSettings[item.key]} disabled={publicSaving}
                    onChange={() => savePublicSettings({ ...pubSettings, [item.key]: !pubSettings[item.key] })} />
                </div>
              ))}
            </div>
          )}

          {/* Audit trail */}
          {pubSettings.updated_at && (
            <p className="text-[11px] text-brand-600">
              Last updated {new Date(pubSettings.updated_at).toLocaleString()}
              {pubSettings.updated_by ? ` by ${pubSettings.updated_by}` : ''}
            </p>
          )}

          {pubSettings.is_public && (
            <a href={`/watch/${id}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-2 transition-colors">
              <ExternalLink size={12} />
              View public page
            </a>
          )}
        </div>
      </Section>

    </div>
  )
}
