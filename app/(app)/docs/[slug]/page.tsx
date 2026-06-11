import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'

// ── Helper components ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-white mb-3 pb-2 border-b border-white/[0.06]">{title}</h2>
      <div className="text-[13px] text-brand-300 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden my-3">
      {rows.map(([k, v], i) => (
        <div key={i} className={`flex gap-4 px-4 py-2.5 text-[12px] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
          <span className="text-white/50 font-mono shrink-0 w-36">{k}</span>
          <span className="text-brand-300">{v}</span>
        </div>
      ))}
    </div>
  )
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[13px] text-brand-300">
          <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

// ── Doc content ──────────────────────────────────────────────────────────────

const docs: Record<string, { title: string; content: React.ReactNode }> = {
  overview: {
    title: 'Platform Overview',
    content: (
      <>
        <Section title="What is Veank Studio?">
          <p>Veank Studio is an internal production platform for creating cinematic short-form finance and education videos. It manages the entire pipeline from scriptwriting to publishing — covering scripts, AI image prompts, graphics, video files, and public watch pages.</p>
        </Section>
        <Section title="Core concepts">
          <Table rows={[
            ['Scenario', 'A single video project — the atomic unit of the platform'],
            ['Brand', 'A YouTube/social channel identity with its own theme and niches'],
            ['Niche', 'A topic category within a brand (e.g. crypto, real-estate)'],
            ['Script', 'The written content for a scenario, broken into scenes'],
            ['Prompt', 'An AI image prompt generated per scene'],
            ['Graphic', 'A rendered image frame uploaded for the storyboard'],
            ['Video', 'The final rendered video file attached to a scenario'],
            ['Public page', 'A shareable /watch URL showing the storyboard and video'],
          ]} />
        </Section>
        <Section title="End-to-end workflow">
          <Steps items={[
            'Create a brand with a name, accent colour, and channel niches',
            'Create a new scenario within a brand — give it a title, hook, and niche',
            'Write or AI-generate the video script with structured scenes',
            'Generate AI prompts for each scene (Midjourney / DALL-E)',
            'Upload the rendered graphic frames to the storyboard',
            'Attach the final rendered video file',
            'Enable the public watch page and share the /watch link',
          ]} />
        </Section>
      </>
    ),
  },
  scenarios: {
    title: 'Scenarios',
    content: (
      <>
        <Section title="What is a scenario?">
          <p>A scenario is a single video production project. It tracks the title, hook (one-line description), niche, status, and all associated assets (script, graphics, video).</p>
        </Section>
        <Section title="Status lifecycle">
          <Table rows={[
            ['draft', 'Initial state — scenario is being planned'],
            ['scripting', 'Script is actively being written'],
            ['prompting', 'AI image prompts are being generated'],
            ['rendering', 'Graphics are being created from prompts'],
            ['editing', 'Video is in post-production'],
            ['published', 'Video is live and publicly visible'],
          ]} />
        </Section>
        <Section title="Creating a scenario">
          <Steps items={[
            'Go to Scenarios → New Story',
            'Enter a compelling title and one-line hook',
            'Select the brand and niche',
            'Save — the scenario starts in "draft" status',
            'Progress through statuses as work is completed',
          ]} />
        </Section>
        <Section title="Assignments">
          <p>Scenarios can be assigned to team members. The assigned user sees their scenarios highlighted in the dashboard. Admins can reassign at any time.</p>
        </Section>
      </>
    ),
  },
  scripts: {
    title: 'Scripts',
    content: (
      <>
        <Section title="Overview">
          <p>Each scenario can have one script. Scripts are plain text with scene separators. The script body is displayed on the public watch page if enabled.</p>
        </Section>
        <Section title="Script structure">
          <p>Scripts are free-form text. Recommended structure is to separate visual scenes with double line breaks and label each scene (e.g. "SCENE 01 — HOOK"). This maps one-to-one with AI prompt generation.</p>
        </Section>
        <Section title="Writing tips">
          <Steps items={[
            'Open a scenario and go to the Script tab',
            'Write scene-by-scene — each scene becomes one graphic frame',
            'Keep each scene description concise (2-4 sentences)',
            'Include visual cues for the AI prompt generator',
            'Save frequently — changes are stored immediately',
          ]} />
        </Section>
        <Section title="Visibility">
          <p>Script visibility on the public watch page is controlled per-scenario via Public Settings. When enabled, the full script body is rendered on the /watch page.</p>
        </Section>
      </>
    ),
  },
  prompts: {
    title: 'AI Prompts',
    content: (
      <>
        <Section title="Overview">
          <p>AI prompts are Midjourney or DALL-E image generation prompts created for each visual scene in the script. Each scenario stores one prompt per scene.</p>
        </Section>
        <Section title="Prompt fields">
          <Table rows={[
            ['scene_index', 'Which scene this prompt belongs to (0-based)'],
            ['body', 'The full prompt text sent to the image generator'],
            ['style_suffix', 'Optional style modifiers appended to every prompt'],
            ['status', 'draft | approved | rejected'],
          ]} />
        </Section>
        <Section title="Generating prompts">
          <Steps items={[
            'Navigate to a scenario → Prompts tab',
            'Click "Generate All" to create prompts from the script scenes',
            'Review and edit each prompt individually',
            'Approve prompts before sending to image generation',
            'Copy approved prompts into Midjourney or your image tool',
          ]} />
        </Section>
        <Section title="Style suffixes">
          <p>A global style suffix can be set at the brand level (e.g. "--ar 9:16 --stylize 750 --v 6"). This is automatically appended to every generated prompt for consistent visual style.</p>
        </Section>
      </>
    ),
  },
  graphics: {
    title: 'Graphics & Storyboard',
    content: (
      <>
        <Section title="Overview">
          <p>Graphics are the rendered image frames that make up the visual storyboard of a scenario. They are uploaded after AI image generation and displayed in a lightbox grid on the public watch page.</p>
        </Section>
        <Section title="Uploading graphics">
          <Steps items={[
            'Go to a scenario → Graphics tab',
            'Drag and drop or browse to select image files',
            'Files are uploaded to Supabase Storage automatically',
            'Each graphic is assigned a sort_order for the storyboard sequence',
            'Reorder frames by dragging them into position',
          ]} />
        </Section>
        <Section title="Storyboard lightbox">
          <p>On the public /watch page, graphics appear in a responsive 2-3 column grid. Clicking any frame opens a full-screen lightbox with keyboard navigation (← → Escape).</p>
        </Section>
        <Section title="Supported formats">
          <Table rows={[
            ['JPEG / JPG', 'Recommended for photographs and rendered images'],
            ['PNG', 'Supported — use for images with transparency'],
            ['WebP', 'Supported — smaller file size'],
          ]} />
        </Section>
      </>
    ),
  },
  videos: {
    title: 'Videos',
    content: (
      <>
        <Section title="Overview">
          <p>The video record stores the final rendered video file and platform publishing information for a scenario. Only one video per scenario is supported.</p>
        </Section>
        <Section title="Video fields">
          <Table rows={[
            ['file_url', 'Direct URL to the self-hosted video file'],
            ['status', 'draft | published'],
            ['publish_date', 'Scheduled or actual publish date'],
            ['platform_urls', 'JSON object of platform links (youtube, tiktok, reels)'],
          ]} />
        </Section>
        <Section title="Attaching a video">
          <Steps items={[
            'Go to a scenario → Video tab',
            'Enter or upload the video file URL',
            'Set status to "published" when the video is live',
            'Add platform URLs for YouTube, TikTok, and Instagram Reels',
            'Platform links appear on the public watch page as action buttons',
          ]} />
        </Section>
        <Section title="Video visibility">
          <p>The video player is only shown on the public page when show_video is enabled in Public Settings AND the scenario status is "published". This prevents accidental early exposure.</p>
        </Section>
      </>
    ),
  },
  brands: {
    title: 'Brands & Channels',
    content: (
      <>
        <Section title="Overview">
          <p>A brand represents a YouTube channel or social media identity. Each brand has its own visual theme, accent colour, supported niches, and scenarios.</p>
        </Section>
        <Section title="Brand fields">
          <Table rows={[
            ['name', 'Display name of the brand / channel'],
            ['slug', 'URL-safe identifier used in routes'],
            ['accent', 'Primary accent colour (hex) for UI and public pages'],
            ['niches', 'Array of content categories this brand covers'],
            ['logo_url', 'Optional brand logo image URL'],
          ]} />
        </Section>
        <Section title="Creating a brand">
          <Steps items={[
            'Go to Settings → Brands',
            'Click "New Brand" and enter the channel name',
            'Choose an accent colour that matches the channel identity',
            'Add the niches this brand covers',
            'Save — you can now create scenarios under this brand',
          ]} />
        </Section>
        <Section title="Multi-brand workflow">
          <p>All scenarios are scoped to a brand. The scenario list can be filtered by brand. Team members can have different access levels per brand (coming soon).</p>
        </Section>
      </>
    ),
  },
  public: {
    title: 'Public Watch Page',
    content: (
      <>
        <Section title="Overview">
          <p>Each scenario can have a publicly accessible watch page at /watch/[id]. This page shows the video, storyboard, script, and platform links based on per-scenario visibility settings.</p>
        </Section>
        <Section title="Public settings">
          <Table rows={[
            ['is_public', 'Master switch — disabling hides the page entirely (404)'],
            ['show_video', 'Show the video player (only if status = published)'],
            ['show_graphics', 'Show the storyboard image grid and lightbox'],
            ['show_script', 'Show the full script body'],
            ['show_platform_links', 'Show YouTube / TikTok / Reels action buttons'],
          ]} />
        </Section>
        <Section title="Enabling the public page">
          <Steps items={[
            'Open a scenario → Public tab',
            'Toggle "Make Public" to enable the watch page',
            'Enable or disable individual content sections',
            'Copy the /watch/[id] URL to share with viewers',
          ]} />
        </Section>
        <Section title="SEO">
          <p>The public watch page generates OpenGraph and Twitter Card meta tags using the scenario title and hook. The first graphic frame is used as the OG image fallback.</p>
        </Section>
      </>
    ),
  },
  team: {
    title: 'Team & Roles',
    content: (
      <>
        <Section title="Roles">
          <Table rows={[
            ['admin', 'Full access — manage brands, invite users, delete anything'],
            ['editor', 'Create and edit scenarios, upload assets, manage own work'],
          ]} />
        </Section>
        <Section title="Inviting team members">
          <Steps items={[
            'Go to Settings → Team',
            'Enter the email address of the new team member',
            'Select their role (admin or editor)',
            'Send the invitation — they receive an email to set a password',
            'They can log in immediately after accepting',
          ]} />
        </Section>
        <Section title="Scenario assignment">
          <p>Scenarios can be assigned to any team member. Editors see their assigned scenarios highlighted. Admins can view and manage all scenarios regardless of assignment.</p>
        </Section>
        <Section title="Removing access">
          <p>Admins can revoke a team member's access from the Team settings page. The user's scenarios are not deleted — they remain unassigned and accessible to admins.</p>
        </Section>
      </>
    ),
  },
  webhooks: {
    title: 'Webhooks',
    content: (
      <>
        <Section title="Overview">
          <p>Webhooks let you receive real-time POST notifications when scenario events occur. Payloads are HMAC-SHA256 signed so you can verify authenticity.</p>
        </Section>
        <Section title="Available events">
          <Table rows={[
            ['scenario.created', 'Fired when a new scenario is created'],
            ['scenario.updated', 'Fired when scenario fields or status change'],
            ['scenario.published', 'Fired when status transitions to "published"'],
            ['video.attached', 'Fired when a video file is attached or replaced'],
            ['graphics.uploaded', 'Fired when new graphic frames are uploaded'],
          ]} />
        </Section>
        <Section title="Payload structure">
          <p>Every webhook POST includes:</p>
          <Table rows={[
            ['event', 'The event name (e.g. scenario.published)'],
            ['scenario_id', 'UUID of the affected scenario'],
            ['timestamp', 'ISO 8601 timestamp of the event'],
            ['data', 'Full scenario object at time of event'],
          ]} />
        </Section>
        <Section title="Signature verification">
          <p>Each request includes an <code className="text-accent font-mono text-[12px]">X-Veank-Signature</code> header containing HMAC-SHA256 of the raw body using your webhook secret. Always verify this before processing.</p>
        </Section>
        <Section title="Setting up a webhook">
          <Steps items={[
            'Go to Settings → Webhooks',
            'Enter your endpoint URL (must be HTTPS)',
            'Select which events to subscribe to',
            'Copy the generated secret and store it securely',
            'Deploy your endpoint and verify test deliveries',
          ]} />
        </Section>
      </>
    ),
  },
  settings: {
    title: 'Settings',
    content: (
      <>
        <Section title="Profile settings">
          <p>Update your display name, email address, and password from Settings → Profile. Email changes require re-confirmation via the new address.</p>
        </Section>
        <Section title="Brand settings">
          <Table rows={[
            ['Name & slug', 'Display name and URL identifier for the brand'],
            ['Accent colour', 'Primary colour used across the UI and public page'],
            ['Niches', 'Content categories — add or remove as the brand evolves'],
            ['Logo', 'Optional brand logo shown in embeds and OG images'],
            ['Style suffix', 'Default Midjourney style suffix for all prompts'],
          ]} />
        </Section>
        <Section title="Team settings">
          <p>Invite, manage, and remove team members. See the Team & Roles doc for details.</p>
        </Section>
        <Section title="Webhook settings">
          <p>Create and manage webhook subscriptions. See the Webhooks doc for details.</p>
        </Section>
        <Section title="Notification preferences">
          <p>Control which in-app and email notifications you receive — scenario assignments, status changes, and new comments (coming soon).</p>
        </Section>
      </>
    ),
  },
  faq: {
    title: 'FAQ',
    content: (
      <>
        <Section title="Where are videos and images hosted?">
          <p>All files are stored in Supabase Storage (S3-compatible). Files are served via a public CDN URL. There are no per-file bandwidth fees within the Supabase plan limits.</p>
        </Section>
        <Section title="Which AI image tools are supported?">
          <p>The prompt generator produces text prompts compatible with Midjourney v6, DALL-E 3, and Stable Diffusion. The tool itself does not call any AI image API — you copy the generated prompts into your preferred tool manually.</p>
        </Section>
        <Section title="Can multiple people edit the same scenario?">
          <p>Yes. There is no locking mechanism — last write wins. Coordinate with your team to avoid conflicting edits on the same scenario simultaneously.</p>
        </Section>
        <Section title="How many brands / scenarios can I create?">
          <p>There are no hard limits within the app. Practical limits come from your Supabase storage quota and database row count on the chosen plan.</p>
        </Section>
        <Section title="Is the public watch page indexed by search engines?">
          <p>Yes — the /watch pages render server-side with full meta tags and are crawlable. If you want a scenario kept private, ensure is_public is disabled.</p>
        </Section>
        <Section title="Can I export my data?">
          <p>You can export scenarios as CSV from the scenarios list (coming soon). Raw database exports are available via the Supabase dashboard for the project owner.</p>
        </Section>
        <Section title="What happens if I delete a scenario?">
          <p>Deletion is permanent. The scenario record, all associated scripts, prompts, graphics references, and video references are removed. Uploaded files in storage are not automatically deleted — clean them up manually from the Supabase storage dashboard.</p>
        </Section>
      </>
    ),
  },
}

// ── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = docs[slug]
  return { title: doc ? `${doc.title} — Docs` : 'Not Found' }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = docs[slug]
  if (!doc) notFound()
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/docs" className="inline-flex items-center gap-2 text-[12px] text-brand-400 hover:text-brand-200 transition-colors mb-6">
        <ChevronLeft size={14} />All Docs
      </Link>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-8">{doc.title}</h1>
      {doc.content}
    </div>
  )
}
