'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Zap, FileText, RefreshCw, Check, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import { generateScript, generateHooks, generatePrompts, type GeneratedPrompt } from '@/actions/ai'
import { upsertScript } from '@/actions/scripts'
import { createPrompt } from '@/actions/prompts'
import { updateScenario } from '@/actions/scenarios'
import { SCENE_TYPES } from '@/lib/constants'

interface ScenarioCtx {
  id: string
  title: string
  hook: string
  niche: string
  audience?: string | null
  emotion?: string | null
  palette?: string | null
  notes?: string | null
}

interface BrandCtx {
  aiTone: string
  name: string
}

interface Props {
  scenario: ScenarioCtx
  currentScript: string
  existingPromptCount: number
  brand?: BrandCtx | null
}

type Tab = 'script' | 'hooks' | 'prompts'

export function AIGeneratePanel({ scenario, currentScript, existingPromptCount, brand }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tab, setTab]   = useState<Tab>('script')

  // Script generation
  const [scriptLoading, setScriptLoading] = useState(false)
  const [generatedScript, setGeneratedScript] = useState('')
  const [scriptError, setScriptError] = useState('')
  const [scriptAccepted, setScriptAccepted] = useState(false)

  // Hook generation
  const [hooksLoading, setHooksLoading] = useState(false)
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([])
  const [hooksError, setHooksError] = useState('')
  const [acceptedHookIdx, setAcceptedHookIdx] = useState<number | null>(null)

  // Prompt generation
  const [promptsLoading, setPromptsLoading] = useState(false)
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([])
  const [promptsError, setPromptsError] = useState('')
  const [selectedSceneTypes, setSelectedSceneTypes] = useState<string[]>(
    SCENE_TYPES.slice(0, 6).map(s => s.value)
  )
  const [targetTool, setTargetTool] = useState('Midjourney')
  const [promptsSaving, setPromptsSaving] = useState(false)
  const [promptsSaved, setPromptsSaved] = useState(false)

  const ctx = {
    title: scenario.title,
    hook: scenario.hook,
    niche: scenario.niche,
    audience: scenario.audience,
    emotion: scenario.emotion,
    palette: scenario.palette,
    notes: scenario.notes,
    brandContext: brand ? { aiTone: brand.aiTone, name: brand.name } : undefined,
  }

  async function handleGenerateScript() {
    setScriptLoading(true); setScriptError(''); setScriptAccepted(false)
    const res = await generateScript(ctx)
    setScriptLoading(false)
    if (!res.success) { setScriptError(res.error); return }
    setGeneratedScript(res.data.script)
  }

  async function handleAcceptScript() {
    const fd = new FormData(); fd.set('body', generatedScript)
    await upsertScript(scenario.id, fd)
    setScriptAccepted(true)
    router.refresh()
  }

  async function handleGenerateHooks() {
    setHooksLoading(true); setHooksError(''); setAcceptedHookIdx(null)
    const res = await generateHooks(ctx)
    setHooksLoading(false)
    if (!res.success) { setHooksError(res.error); return }
    setGeneratedHooks(res.data.hooks)
  }

  async function handleAcceptHook(hook: string, idx: number) {
    const fd = new FormData()
    fd.set('hook', hook); fd.set('title', scenario.title); fd.set('niche', scenario.niche)
    if (scenario.audience) fd.set('audience', scenario.audience)
    if (scenario.emotion)  fd.set('emotion', scenario.emotion)
    await updateScenario(scenario.id, fd)
    setAcceptedHookIdx(idx)
    router.refresh()
  }

  async function handleGeneratePrompts() {
    setPromptsLoading(true); setPromptsError(''); setPromptsSaved(false)
    const script = currentScript || generatedScript
    const res = await generatePrompts({ ...ctx, script, sceneTypes: selectedSceneTypes, targetTool })
    setPromptsLoading(false)
    if (!res.success) { setPromptsError(res.error); return }
    setGeneratedPrompts(res.data.prompts)
  }

  async function handleSavePrompts() {
    setPromptsSaving(true)
    for (const p of generatedPrompts) {
      const fd = new FormData()
      fd.set('scenario_id', scenario.id)
      fd.set('scene_type',  p.scene_type)
      fd.set('prompt_text', p.prompt_text)
      fd.set('ai_tool',     p.ai_tool)
      fd.set('caption_word', p.caption_word)
      await createPrompt(fd)
    }
    setPromptsSaving(false); setPromptsSaved(true)
    setGeneratedPrompts([])
    router.refresh()
  }

  function toggleSceneType(v: string) {
    setSelectedSceneTypes(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    )
  }

  return (
    <div className="bg-[#0D1117] rounded-xl border border-accent/20 overflow-hidden mb-3">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
            <Sparkles size={12} className="text-accent" />
          </div>
          <span className="text-sm font-semibold text-white">AI Generate</span>
          <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
            Claude
          </span>
        </div>
        {open
          ? <ChevronUp size={14} className="text-brand-500 shrink-0" />
          : <ChevronDown size={14} className="text-brand-500 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-white/[0.05]">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.05]">
            {([
              { id: 'script',  label: 'Script',  icon: FileText },
              { id: 'hooks',   label: 'Hooks',   icon: Zap },
              { id: 'prompts', label: 'Prompts', icon: Sparkles },
            ] as { id: Tab; label: string; icon: React.ElementType }[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.id
                    ? 'text-accent border-accent'
                    : 'text-brand-500 border-transparent hover:text-brand-300'
                }`}>
                <t.icon size={11} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Script tab */}
          {tab === 'script' && (
            <div className="p-5 space-y-4">
              <p className="text-[11px] text-brand-500 leading-relaxed">
                Generate a 60–90s voiceover script from your scenario&apos;s title, hook, and niche.
              </p>
              <button onClick={handleGenerateScript} disabled={scriptLoading}
                className="flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/25 transition-all disabled:opacity-40">
                {scriptLoading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Sparkles size={14} />}
                {scriptLoading ? 'Generating…' : currentScript ? 'Regenerate Script' : 'Generate Script'}
              </button>

              {scriptError && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 px-3 py-2 rounded-lg">{scriptError}</p>
              )}

              {generatedScript && (
                <div className="space-y-3">
                  <div className="bg-black/30 border border-white/[0.07] rounded-xl p-4">
                    <p className="text-xs font-mono text-brand-300 leading-relaxed whitespace-pre-wrap">{generatedScript}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleAcceptScript} disabled={scriptAccepted}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        scriptAccepted
                          ? 'bg-success/15 text-success border border-success/25'
                          : 'bg-accent/15 border border-accent/25 text-accent hover:bg-accent/25'
                      }`}>
                      {scriptAccepted ? <><Check size={12} /> Saved to Script</> : 'Use This Script'}
                    </button>
                    <button onClick={handleGenerateScript} disabled={scriptLoading}
                      className="p-2 rounded-lg border border-white/[0.08] text-brand-500 hover:text-brand-300 hover:border-white/[0.15] transition-all">
                      <RefreshCw size={12} />
                    </button>
                    <button onClick={() => setGeneratedScript('')}
                      className="p-2 rounded-lg border border-white/[0.08] text-brand-500 hover:text-danger hover:border-danger/20 transition-all">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hooks tab */}
          {tab === 'hooks' && (
            <div className="p-5 space-y-4">
              <p className="text-[11px] text-brand-500 leading-relaxed">
                Generate 5 viral hook variations. Accept one to update your scenario&apos;s hook.
              </p>
              <p className="text-[11px] bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-brand-300">
                Current: <span className="text-brand-200 font-medium">{scenario.hook}</span>
              </p>
              <button onClick={handleGenerateHooks} disabled={hooksLoading}
                className="flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/25 transition-all disabled:opacity-40">
                {hooksLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {hooksLoading ? 'Generating…' : 'Generate Hooks'}
              </button>

              {hooksError && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 px-3 py-2 rounded-lg">{hooksError}</p>
              )}

              {generatedHooks.length > 0 && (
                <div className="space-y-2">
                  {generatedHooks.map((hook, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      acceptedHookIdx === i
                        ? 'bg-success/[0.05] border-success/25'
                        : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.12]'
                    }`}>
                      <span className="text-[10px] text-brand-600 mt-0.5 w-4 shrink-0 tabular-nums">{i + 1}.</span>
                      <p className="text-sm text-brand-200 flex-1 leading-relaxed">{hook}</p>
                      <button onClick={() => handleAcceptHook(hook, i)}
                        disabled={acceptedHookIdx !== null}
                        className={`shrink-0 px-3 py-1 rounded-lg text-[11px] font-medium transition-all disabled:opacity-40 ${
                          acceptedHookIdx === i
                            ? 'bg-success/15 text-success border border-success/25'
                            : 'bg-white/[0.04] text-brand-300 border border-white/[0.09] hover:bg-accent/15 hover:text-accent hover:border-accent/25'
                        }`}>
                        {acceptedHookIdx === i ? <Check size={11} /> : 'Use'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Prompts tab */}
          {tab === 'prompts' && (
            <div className="p-5 space-y-4">
              <p className="text-[11px] text-brand-500 leading-relaxed">
                Auto-generate visual prompts for each scene type from your script.
                {existingPromptCount > 0 && ` (${existingPromptCount} existing prompts will be kept)`}
              </p>

              {/* AI Tool */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5">Target AI Tool</label>
                <input value={targetTool} onChange={e => setTargetTool(e.target.value)}
                  list="ai-tools-panel"
                  placeholder="Midjourney, Sora, Kling…"
                  className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-sm text-white placeholder-brand-500 focus:border-accent/50 outline-none" />
                <datalist id="ai-tools-panel">
                  {['Midjourney','DALL-E 3','Sora','Kling','Runway','Pika','Flux','Ideogram'].map(t => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>

              {/* Scene type selector */}
              <div>
                <label className="block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-2">Scene Types to Generate</label>
                <div className="flex flex-wrap gap-1.5">
                  {SCENE_TYPES.map(st => (
                    <button key={st.value} onClick={() => toggleSceneType(st.value)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        selectedSceneTypes.includes(st.value)
                          ? 'bg-accent/15 border-accent/30 text-accent'
                          : 'bg-white/[0.03] border-white/[0.07] text-brand-500 hover:border-white/[0.15]'
                      }`}>
                      {st.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-brand-600 mt-1.5">{selectedSceneTypes.length} selected</p>
              </div>

              <button onClick={handleGeneratePrompts} disabled={promptsLoading || selectedSceneTypes.length === 0}
                className="flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/25 transition-all disabled:opacity-40">
                {promptsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {promptsLoading ? 'Generating…' : 'Generate Prompts'}
              </button>

              {promptsError && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 px-3 py-2 rounded-lg">{promptsError}</p>
              )}

              {generatedPrompts.length > 0 && (
                <div className="space-y-2.5">
                  {generatedPrompts.map((p, i) => {
                    const sceneLabel = SCENE_TYPES.find(s => s.value === p.scene_type)?.label ?? p.scene_type
                    return (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-3.5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wide">{sceneLabel}</span>
                          <span className="text-[11px] font-mono bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">{p.caption_word}</span>
                          <span className="text-[11px] text-brand-500 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">{p.ai_tool}</span>
                        </div>
                        <p className="text-xs text-brand-400 leading-relaxed font-mono">{p.prompt_text}</p>
                      </div>
                    )
                  })}

                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={handleSavePrompts} disabled={promptsSaving || promptsSaved}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        promptsSaved
                          ? 'bg-success/15 text-success border border-success/25'
                          : 'bg-accent/15 border border-accent/25 text-accent hover:bg-accent/25 disabled:opacity-40'
                      }`}>
                      {promptsSaving
                        ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                        : promptsSaved
                          ? <><Check size={11} /> Saved!</>
                          : `Add ${generatedPrompts.length} Prompts`}
                    </button>
                    <button onClick={() => setGeneratedPrompts([])}
                      className="p-2 rounded-lg border border-white/[0.08] text-brand-500 hover:text-danger hover:border-danger/20 transition-all">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
