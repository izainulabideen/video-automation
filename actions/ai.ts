'use server'
import Anthropic from '@anthropic-ai/sdk'
import type { ActionResult } from '@/types/app'
import { NICHE_LABELS, SCENE_TYPES } from '@/lib/constants'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface BrandContext {
  aiTone: string
  name: string
}

interface ScenarioContext {
  title: string
  hook: string
  niche: string
  audience?: string | null
  emotion?: string | null
  palette?: string | null
  notes?: string | null
  brandContext?: BrandContext
}

export async function generateScript(ctx: ScenarioContext): Promise<ActionResult<{ script: string }>> {
  if (!process.env.ANTHROPIC_API_KEY) return { success: false, error: 'ANTHROPIC_API_KEY not configured' }

  const nicheLabel = NICHE_LABELS[ctx.niche] ?? ctx.niche
  const prompt = `You are an expert ${ctx.brandContext?.name ?? 'Finance'} video scriptwriter for short-form social media (TikTok/Reels/YouTube Shorts).
Your writing style: ${ctx.brandContext?.aiTone ?? 'authoritative, urgent, data-driven, educational'}.

Write a compelling voiceover script for this video:

Title: ${ctx.title}
Hook: ${ctx.hook}
Niche: ${nicheLabel}
${ctx.audience ? `Target Audience: ${ctx.audience}` : ''}
${ctx.emotion ? `Emotional Tone: ${ctx.emotion}` : ''}
${ctx.notes ? `Additional Notes: ${ctx.notes}` : ''}

Requirements:
- 60-90 seconds when read aloud (approx 150-225 words)
- Start with the hook word-for-word as the opening line
- Use short punchy sentences. No fluff.
- Build tension/curiosity in the middle
- End with a strong call to action or revelation
- Write ONLY the script — no scene labels, no formatting, no stage directions
- Natural spoken language only`

  const msg = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const first = msg.content[0]
  const script = first?.type === 'text' ? first.text.trim() : ''
  if (!script) return { success: false, error: 'No script generated' }
  return { success: true, data: { script } }
}

export async function generateHooks(ctx: Pick<ScenarioContext, 'title' | 'niche' | 'audience' | 'brandContext'>): Promise<ActionResult<{ hooks: string[] }>> {
  if (!process.env.ANTHROPIC_API_KEY) return { success: false, error: 'ANTHROPIC_API_KEY not configured' }

  const nicheLabel = NICHE_LABELS[ctx.niche] ?? ctx.niche
  const prompt = `Generate 5 powerful viral hooks for a ${ctx.brandContext?.name ?? 'Finance'} short-form video.

Title: ${ctx.title}
Niche: ${nicheLabel}
${ctx.audience ? `Audience: ${ctx.audience}` : ''}

Rules:
- Each hook must be 1-2 sentences max
- Match this tone: ${ctx.brandContext?.aiTone ?? 'urgent, financial, data-driven'}.
- Use power words: "secretly", "hidden", "banned", "most people don't know"
- No clickbait that can't be backed up
- Output ONLY a numbered list, one hook per line, nothing else`

  const msg = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const first2 = msg.content[0]
  const text = first2?.type === 'text' ? first2.text.trim() : ''
  const hooks = text
    .split('\n')
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5)

  if (!hooks.length) return { success: false, error: 'No hooks generated' }
  return { success: true, data: { hooks } }
}

interface GeneratePromptsInput extends ScenarioContext {
  script: string
  sceneTypes: string[]
  targetTool?: string
}

export interface GeneratedPrompt {
  scene_type: string
  prompt_text: string
  ai_tool: string
  caption_word: string
}

export async function generatePrompts(ctx: GeneratePromptsInput): Promise<ActionResult<{ prompts: GeneratedPrompt[] }>> {
  if (!process.env.ANTHROPIC_API_KEY) return { success: false, error: 'ANTHROPIC_API_KEY not configured' }

  const nicheLabel = NICHE_LABELS[ctx.niche] ?? ctx.niche
  const sceneLabels = ctx.sceneTypes.map(st => {
    const found = SCENE_TYPES.find(s => s.value === st)
    return found ? `${st}: ${found.label}` : st
  }).join('\n')
  const tool = ctx.targetTool || 'Midjourney'

  const prompt = `You are a visual prompt engineer for AI image/video generation tools.

Generate one visual prompt per scene type for a ${ctx.brandContext?.name ?? 'Finance'} short-form video.

Video context:
- Title: ${ctx.title}
- Niche: ${nicheLabel}
- Emotion: ${ctx.emotion ?? ctx.brandContext?.aiTone ?? 'urgency'}
${ctx.palette ? `- Color Palette: ${ctx.palette}` : ''}
- Script excerpt: "${ctx.script.slice(0, 300)}..."

Scene types to cover:
${sceneLabels}

For each scene type output a JSON object with:
- scene_type: the scene type key exactly as given
- prompt_text: a detailed visual prompt for ${tool} (describe the scene, lighting, style, mood; 2-4 sentences)
- ai_tool: "${tool}"
- caption_word: a single ALL-CAPS power word that overlays this scene (e.g. TRAP, HIDDEN, STOLEN)

Output ONLY a JSON array of objects. No markdown, no explanation.`

  const msg = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const firstMsg = msg.content[0]
  const text = firstMsg?.type === 'text' ? firstMsg.text.trim() : ''
  // Strip possible markdown code fences
  const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  let prompts: GeneratedPrompt[]
  try {
    prompts = JSON.parse(json)
  } catch {
    return { success: false, error: 'Failed to parse AI response. Try again.' }
  }

  if (!Array.isArray(prompts) || !prompts.length) return { success: false, error: 'No prompts generated' }
  return { success: true, data: { prompts } }
}
