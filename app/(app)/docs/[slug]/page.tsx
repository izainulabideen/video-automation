import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

const docs: Record<string, { title: string; content: React.ReactNode }> = {
  overview: {
    title: 'Platform Overview',
    content: (
      <div className="space-y-8">
        <Section title="What is Veank Studio?">
          <p>Veank Studio is a multi-brand video content production tool. It manages the full lifecycle of a short-form educational video — from the initial idea to a published, publicly watchable story — across multiple YouTube/social channels (called <strong>Brands</strong>).</p>
        </Section>

        <Section title="End-to-End Workflow">
          <Steps steps={[
            { n: '01', label: 'Create a Scenario', desc: 'A scenario is one video idea. Give it a title, hook, niche, palette, and target audience. Assign it to a brand.' },
            { n: '02', label: 'Generate a Script', desc: 'Use AI (Claude) or write manually. The script is broken into scenes, each with a type (narration, b-roll, title card, etc.).' },
            { n: '03', label: 'Generate AI Prompts', desc: 'Each scene automatically gets a Midjourney/DALL-E image prompt. Review and edit before sending to your AI tool.' },
            { n: '04', label: 'Upload Graphics', desc: 'Render images from your AI tool and upload them to the scenario. They appear as a storyboard on the public page.' },
            { n: '05', label: 'Attach a Video', desc: 'Upload your edited video to Supabase Storage or a CDN, then paste the URL. Add publish date, duration, and status.' },
            { n: '06', label: 'Publish', desc: 'Set the scenario status to Published and toggle Public Settings to make it visible on /watch.' },
          ]} />
        </Section>

        <Section title="Core Concepts">
          <Table rows={[
            ['Scenario', 'One video — the central unit of work. Contains all metadata, script, prompts, graphics, and video.'],
            ['Brand', 'A YouTube/social channel with its own name, color theme, niches, and team members.'],
            ['Niche', 'A content category within a brand (e.g. Finance → Tax, Investing, Economics).'],
            ['Palette', 'A visual color scheme for the video (e.g. "Midnight Gold", "Crimson Dark").'],
            ['Public Settings', 'Per-scenario toggles that control what appears on the public /watch page.'],
            ['Webhook', 'An HTTPS endpoint that receives signed POST requests when scenario events happen.'],
          ]} />
        </Section>

        <Section title="Route Map">
          <Table rows={[
            ['/dashboard', 'Overview of recent activity, team, and publish calendar.'],
            ['/scenarios', 'All scenarios — filter by brand, status, niche.'],
            ['/scenarios/new', 'Create a new scenario with optional template.'],
            ['/scenarios/[id]', 'Scenario workspace — script, prompts, graphics, video, settings tabs.'],
            ['/calendar', 'Monthly view of all scheduled publish dates.'],
            ['/settings/brands', 'Create and edit brands (channels).'],
            ['/settings/team', 'Invite and manage team members.'],
            ['/settings/webhooks', 'Manage outbound webhook endpoints.'],
            ['/watch', 'Public content page — visible without login.'],
            ['/watch/[id]', 'Public detail page for a published scenario.'],
            ['/docs', 'This documentation.'],
          ]} />
        </Section>
      </div>
    ),
  },

  scenarios: {
    title: 'Scenarios',
    content: (
      <div className="space-y-8">
        <Section title="What is a Scenario?">
          <p>A scenario represents one video. It holds the idea metadata (title, hook, niche, audience, emotion, palette) and acts as the parent record for the script, prompts, graphics, and video.</p>
        </Section>
        <Section title="Status Lifecycle">
          <Steps steps={[
            { n: 'draft', label: 'Draft', desc: 'Initial state. Idea captured, not yet in production.' },
            { n: 'in_production', label: 'In Production', desc: 'Script/graphics being worked on. Not yet public.' },
            { n: 'published', label: 'Published', desc: 'Video is complete. Can be made public via Public Settings. Fires the scenario.published webhook.' },
          ]} />
        </Section>
        <Section title="Fields">
          <Table rows={[
            ['title', 'Video title shown publicly.'],
            ['hook', 'One-sentence hook. Shown as a subtitle on the public watch page.'],
            ['niche', 'Content category within the brand.'],
            ['palette', 'Visual color scheme identifier.'],
            ['audience', 'Target viewer demographic (internal note).'],
            ['emotion', 'Intended emotional response (internal note).'],
            ['notes', 'Internal production notes.'],
            ['brand_id', 'Which brand/channel this video belongs to.'],
            ['assigned_to', 'Team member responsible for production.'],
          ]} />
        </Section>
        <Section title="Public Settings">
          <p>Each scenario has a separate public_settings record that controls what the public can see:</p>
          <Table rows={[
            ['is_public', 'Master toggle — must be on for the scenario to appear on /watch.'],
            ['show_video', 'Show the video player on the watch page.'],
            ['show_script', 'Show the full script text.'],
            ['show_graphics', 'Show the visual storyboard.'],
            ['show_platform_links', 'Show Watch on YouTube / TikTok / Reels buttons.'],
          ]} />
        </Section>
      </div>
    ),
  },

  scripts: {
    title: 'Scripts',
    content: (
      <div className="space-y-8">
        <Section title="Script Structure">
          <p>A script is a versioned JSON document stored in the <code>scripts</code> table. Each script is made up of <strong>scenes</strong>. Every scene has a type, content, and optional duration.</p>
        </Section>
        <Section title="Scene Types">
          <Table rows={[
            ['hook', 'Opening scene — the attention-grabbing first 3–5 seconds.'],
            ['narration', 'Voice-over narration over b-roll or a visual scene.'],
            ['title_card', 'On-screen text overlay. Usually short.'],
            ['broll', 'B-roll shot description — no spoken narration.'],
            ['cta', 'Call to action — subscribe, follow, or engage prompt.'],
            ['transition', 'Brief transition scene between major sections.'],
          ]} />
        </Section>
        <Section title="AI Generation">
          <p>From the Script tab, click <strong>Generate with AI</strong>. Claude writes a full multi-scene script based on the scenario title, hook, niche, audience, and emotion fields. The result is saved as a new version automatically.</p>
        </Section>
        <Section title="Versioning">
          <p>Each time you save or regenerate, a new version row is created in the database. The latest version is displayed by default. Previous versions are retained.</p>
        </Section>
      </div>
    ),
  },

  prompts: {
    title: 'AI Prompts',
    content: (
      <div className="space-y-8">
        <Section title="What are Prompts?">
          <p>Each scene in a script can have a corresponding image generation prompt for Midjourney or DALL-E. Prompts live in the <code>prompts</code> table, one row per scene.</p>
        </Section>
        <Section title="Generation">
          <p>From the Prompts tab, click <strong>Generate Prompts</strong>. Claude reads the script scenes and writes a cinematic image prompt for each one, taking into account the brand palette and visual style.</p>
        </Section>
        <Section title="Fields">
          <Table rows={[
            ['scene_index', 'Which scene this prompt belongs to (0-indexed).'],
            ['tool', 'AI tool to use — midjourney or dalle3.'],
            ['prompt_text', 'The full prompt string to paste into the AI tool.'],
            ['negative_prompt', 'Midjourney --no parameters or DALL-E exclusions.'],
            ['style_suffix', 'Appended style parameters (e.g. --ar 9:16 --v 6).'],
            ['status', 'pending → generated → approved → rejected.'],
          ]} />
        </Section>
        <Section title="Workflow">
          <Steps steps={[
            { n: '01', label: 'Generate', desc: 'AI creates prompts for all scenes at once.' },
            { n: '02', label: 'Review & Edit', desc: 'Adjust wording, change tool, tweak style suffix per scene.' },
            { n: '03', label: 'Copy & Use', desc: 'Use the copy button to paste the prompt into Midjourney or DALL-E.' },
            { n: '04', label: 'Mark Approved', desc: 'Approve prompts once the generated images look good.' },
          ]} />
        </Section>
      </div>
    ),
  },

  graphics: {
    title: 'Graphics & Storyboard',
    content: (
      <div className="space-y-8">
        <Section title="What are Graphics?">
          <p>Graphics are the rendered image frames for a scenario — one per scene or as many as needed. They are stored in Supabase Storage and referenced in the <code>graphics</code> table.</p>
        </Section>
        <Section title="Uploading">
          <p>From the Graphics tab inside a scenario, drag and drop or select image files (JPG/PNG/WebP). Each file is uploaded to Supabase Storage under <code>graphics/[scenario-id]/</code> and a record is created automatically.</p>
        </Section>
        <Section title="Reordering">
          <p>Drag the handle on any graphic card to reorder. The <code>sort_order</code> field controls display order on both the admin and public pages.</p>
        </Section>
        <Section title="Public Storyboard">
          <p>When <strong>Show Graphics</strong> is enabled in Public Settings, the frames appear as a clickable grid on the public watch page. Clicking any frame opens a <strong>fullscreen lightbox</strong> with:</p>
          <ul className="list-disc list-inside text-brand-300 text-sm space-y-1 mt-2">
            <li>Backdrop blur overlay</li>
            <li>Previous / Next navigation arrows</li>
            <li>Keyboard shortcuts: ← → to navigate, Esc to close</li>
            <li>Frame counter and filename caption</li>
          </ul>
        </Section>
      </div>
    ),
  },

  videos: {
    title: 'Videos',
    content: (
      <div className="space-y-8">
        <Section title="Video Hosting Policy">
          <p className="text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3 text-sm">
            Veank Studio does <strong>not</strong> use paid third-party video hosting (no YouTube embeds, no Vimeo). All video playback uses self-hosted files via a native HTML5 player.
          </p>
        </Section>
        <Section title="Attaching a Video">
          <Steps steps={[
            { n: '01', label: 'Upload File', desc: 'Upload your .mp4 or .webm file to Supabase Storage or any CDN. Copy the direct file URL.' },
            { n: '02', label: 'Paste URL', desc: 'In the Video tab, paste the URL into the "Video File URL" field.' },
            { n: '03', label: 'Set Metadata', desc: 'Add duration in seconds, publish date, and status (editing / exported / published).' },
            { n: '04', label: 'Platform Links', desc: 'Optionally add YouTube / TikTok / Reels URLs as reference links. These show as "Watch on" buttons on the public page — they do not embed.' },
          ]} />
        </Section>
        <Section title="Video Status">
          <Table rows={[
            ['editing', 'Still being edited. Not shown publicly even if scenario is public.'],
            ['exported', 'Final export done. Ready for review.'],
            ['published', 'Live. Shown on the public watch page if show_video is enabled.'],
          ]} />
        </Section>
      </div>
    ),
  },

  brands: {
    title: 'Brands & Channels',
    content: (
      <div className="space-y-8">
        <Section title="What is a Brand?">
          <p>A brand represents one of your YouTube/social channels. Each brand has its own visual identity, content niches, and team members. Scenarios are always assigned to exactly one brand.</p>
        </Section>
        <Section title="Brand Fields">
          <Table rows={[
            ['name', 'Display name of the channel (e.g. "Veank Finance").'],
            ['slug', 'URL-safe identifier — used for palette/template lookups (e.g. "finance").'],
            ['theme_config.accent', 'Primary brand color (hex).'],
            ['theme_config.accentH', 'Hover/highlight variant of accent color.'],
            ['theme_config.niches', 'Array of niche slugs active for this brand.'],
            ['theme_config.nicheLabels', 'Human-readable label for each niche slug.'],
          ]} />
        </Section>
        <Section title="Brand Slugs">
          <p>The 10 default brand slugs and their content categories:</p>
          <Table rows={[
            ['finance', 'Tax, investing, economics, budgeting, wealth'],
            ['horror', 'True horror, supernatural, psychological, survival'],
            ['philosophy', 'Ethics, metaphysics, stoicism, existentialism'],
            ['psychology', 'Cognitive bias, behavior, persuasion, mental health'],
            ['true-crime', 'Unsolved cases, serial killers, conspiracies, heists'],
            ['history', 'Ancient civilizations, wars, revolutions, empires'],
            ['science', 'Physics, biology, space, climate, technology'],
            ['mythology', 'Greek, Norse, Egyptian, Hindu, Aztec myths'],
            ['self-improvement', 'Productivity, habits, goals, mindset, leadership'],
            ['technology', 'AI, cybersecurity, startups, software, innovation'],
          ]} />
        </Section>
        <Section title="Palettes">
          <p>Each brand slug has 5–6 pre-defined color palettes in <code>lib/brand-palettes.ts</code>. The palette selected on a scenario determines which color scheme is used for graphics prompts and the public watch page accent color.</p>
        </Section>
      </div>
    ),
  },

  public: {
    title: 'Public Watch Page',
    content: (
      <div className="space-y-8">
        <Section title="URL Structure">
          <Table rows={[
            ['/watch', 'Grid of all published + public scenarios across all brands.'],
            ['/watch/[scenario-id]', 'Detail page for one scenario.'],
            ['/watch/brand/[slug]', 'Filtered grid showing only one brand\'s content.'],
          ]} />
        </Section>
        <Section title="What Gets Shown">
          <p>A scenario appears publicly only when <strong>both</strong> of these are true:</p>
          <ul className="list-disc list-inside text-brand-300 text-sm space-y-1 mt-2">
            <li>Scenario status = <code>published</code></li>
            <li>public_settings.is_public = true</li>
          </ul>
          <p className="mt-3">Once visible, individual sections are controlled by the show_* toggles in Public Settings.</p>
        </Section>
        <Section title="Detail Page Sections">
          <Table rows={[
            ['Hero', 'Always shown — video player (if show_video) or cover graphic or cinematic title card.'],
            ['Script', 'Full script text shown if show_script is enabled.'],
            ['Storyboard', 'Image grid with lightbox if show_graphics is enabled.'],
            ['Platform Links', 'Watch on YouTube / TikTok / Reels buttons if show_platform_links is enabled.'],
          ]} />
        </Section>
        <Section title="SEO">
          <p>Each public page has:</p>
          <ul className="list-disc list-inside text-brand-300 text-sm space-y-1 mt-2">
            <li>Dynamic <code>&lt;title&gt;</code> and <code>&lt;meta description&gt;</code></li>
            <li>Open Graph image (first storyboard frame or default OG)</li>
            <li>JSON-LD structured data (VideoObject when video present, Article otherwise)</li>
            <li>Canonical URL</li>
          </ul>
        </Section>
      </div>
    ),
  },

  team: {
    title: 'Team & Roles',
    content: (
      <div className="space-y-8">
        <Section title="Roles">
          <Table rows={[
            ['admin', 'Full access — create brands, invite users, manage webhooks, delete anything.'],
            ['editor', 'Can create and edit scenarios, scripts, prompts, graphics, and videos. Cannot manage team or webhooks.'],
          ]} />
        </Section>
        <Section title="Inviting a Team Member">
          <Steps steps={[
            { n: '01', label: 'Go to Settings → Team', desc: 'Click Invite Member.' },
            { n: '02', label: 'Enter Email & Role', desc: 'Choose admin or editor role.' },
            { n: '03', label: 'Send Invite', desc: 'An email is sent with a one-time acceptance link.' },
            { n: '04', label: 'User Accepts', desc: 'User clicks the link, sets a password, and is added to the team.' },
          ]} />
        </Section>
        <Section title="Assigning Scenarios">
          <p>Any scenario can be assigned to a specific team member from the scenario detail page. The assigned user sees the scenario highlighted in their dashboard. An assignment notification email is sent automatically. The <code>scenario.assigned</code> webhook event is also fired.</p>
        </Section>
        <Section title="Authentication">
          <p>Veank Studio uses custom HMAC-SHA256 signed session cookies — <strong>not</strong> Supabase Auth. Passwords are hashed with bcrypt. Sessions expire and must be renewed by logging in again.</p>
        </Section>
      </div>
    ),
  },

  webhooks: {
    title: 'Webhooks',
    content: (
      <div className="space-y-8">
        <Section title="Overview">
          <p>Webhooks let you receive real-time notifications in your own systems when things happen in Veank Studio. A webhook is an HTTP POST sent to a URL you provide, signed with HMAC-SHA256.</p>
        </Section>
        <Section title="Events">
          <Table rows={[
            ['scenario.created', 'A new scenario was created. Payload: id, title.'],
            ['scenario.published', 'A scenario status changed to published. Payload: id, title.'],
            ['scenario.assigned', 'A scenario was assigned to a team member. Payload: id, title, assigned_to.'],
          ]} />
        </Section>
        <Section title="Request Format">
          <pre className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-4 text-[12px] text-brand-200 overflow-x-auto">{`POST https://your-endpoint.com/hook
Content-Type: application/json
X-Veank-Signature: <hmac-sha256-hex>

{
  "event": "scenario.published",
  "data": { "id": "abc-123", "title": "The Hidden Tax Trap" },
  "timestamp": 1749567234123
}`}</pre>
        </Section>
        <Section title="Verifying the Signature">
          <pre className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-4 text-[12px] text-brand-200 overflow-x-auto">{`const crypto = require('crypto')

const sig = req.headers['x-veank-signature']
const body = JSON.stringify(req.body)
const expected = crypto
  .createHmac('sha256', YOUR_WEBHOOK_SECRET)
  .update(body)
  .digest('hex')

if (sig !== expected) return res.status(401).send('Forbidden')`}</pre>
        </Section>
        <Section title="Limitations">
          <ul className="list-disc list-inside text-brand-300 text-sm space-y-1">
            <li>No retry logic — if your endpoint is down, the event is lost.</li>
            <li>No delivery log — past webhook calls are not stored.</li>
            <li>Only admins can create or delete webhooks.</li>
          </ul>
        </Section>
      </div>
    ),
  },

  settings: {
    title: 'Settings',
    content: (
      <div className="space-y-8">
        <Section title="Settings Pages">
          <Table rows={[
            ['/settings', 'Global app defaults — default niche, palette, AI tool preference.'],
            ['/settings/profile', 'Your name, email, and password.'],
            ['/settings/brands', 'Create, edit, and theme your brand channels.'],
            ['/settings/team', 'Invite team members and manage access.'],
            ['/settings/webhooks', 'Register outbound webhook endpoints.'],
          ]} />
        </Section>
        <Section title="Default Preferences">
          <p>Under Settings, you can set your personal defaults for new scenarios — default niche, palette, and AI image tool. These are stored per-user and pre-fill the New Scenario form.</p>
        </Section>
      </div>
    ),
  },

  faq: {
    title: 'FAQ',
    content: (
      <div className="space-y-8">
        <Section title="Frequently Asked Questions">
          <div className="space-y-5">
            {[
              {
                q: 'Where are videos hosted?',
                a: 'Veank Studio does not use any third-party video hosting. Videos are served from Supabase Storage or any CDN you choose. The file URL is stored and played via a native HTML5 <video> element.',
              },
              {
                q: 'What AI models are used for script/prompt generation?',
                a: 'Scripts and prompts are generated by Claude (Anthropic API). Image prompts are designed to be used with Midjourney or DALL-E — the AI tool per-scene is configurable.',
              },
              {
                q: 'Is the public /watch page behind login?',
                a: 'No. /watch and /watch/[id] are fully public — no authentication required. Only scenarios marked as public appear there.',
              },
              {
                q: 'Can I have multiple brands on one account?',
                a: 'Yes. You can create as many brands as you like. Each brand has its own theme, niches, palettes, and can have different team members.',
              },
              {
                q: 'How does the calendar work?',
                a: 'The calendar shows all scenarios that have a publish_date set on their video record. It is a read-only monthly view — dates are set on the Video tab of each scenario.',
              },
              {
                q: 'What image formats are supported for graphics?',
                a: 'JPG, PNG, and WebP. Files are stored in Supabase Storage under graphics/[scenario-id]/.',
              },
              {
                q: 'What happens when I delete a scenario?',
                a: 'The scenario and all related records (script, prompts, graphics, video, comments, activity) are deleted. Graphics files in Supabase Storage are also removed.',
              },
              {
                q: 'Can editors publish scenarios?',
                a: 'Yes — changing status to published is not restricted to admins. However, toggling a scenario public (Public Settings) can be done by any authenticated user who can access the scenario.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-white/[0.05] pb-5 last:border-0">
                <p className="text-[13px] font-semibold text-white mb-2">{q}</p>
                <p className="text-[13px] text-brand-300 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    ),
  },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-white mb-3 pb-2 border-b border-white/[0.06]">{title}</h2>
      <div className="text-[13px] text-brand-300 leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] mt-2">
      {rows.map(([k, v], i) => (
        <div key={i} className={`flex gap-0 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
          <div className="w-44 shrink-0 px-4 py-2.5 border-r border-white/[0.06]">
            <code className="text-[11px] text-accent/90 font-mono">{k}</code>
          </div>
          <div className="px-4 py-2.5 text-[12px] text-brand-300">{v}</div>
        </div>
      ))}
    </div>
  )
}

function Steps({ steps }: { steps: { n: string; label: string; desc: string }[] }) {
  return (
    <div className="space-y-3 mt-2">
      {steps.map(s => (
        <div key={s.n} className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-accent font-mono">{s.n}</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">{s.label}</p>
            <p className="text-[12px] text-brand-400 mt-0.5">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = docs[slug]
  return { title: doc ? `${doc.title} — Docs` : 'Not Found' }
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params
  const doc = docs[slug]
  if (!doc) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/docs"
        className="inline-flex items-center gap-2 text-[12px] text-brand-400 hover:text-brand-200 transition-colors mb-6">
        <ChevronLeft size={14} />
        All Docs
      </Link>

      <h1 className="text-2xl font-bold text-white tracking-tight mb-8">{doc.title}</h1>

      {doc.content}
    </div>
  )
}
