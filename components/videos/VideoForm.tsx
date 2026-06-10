'use client'
import { useState } from 'react'
import { upsertVideo } from '@/actions/videos'
import { VIDEO_STATUS_OPTIONS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']

export function VideoForm({ scenarioId, video }: { scenarioId: string; video?: Video }) {
  const [saving, setSaving] = useState(false)
  const platforms = video?.platform_urls as Record<string, string> | null

  async function handleSubmit(fd: FormData) {
    setSaving(true)
    await upsertVideo(scenarioId, fd)
    setSaving(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-xl">
      {[
        { name: 'file_url', label: 'Video File URL (MP4/WebM — Supabase Storage or CDN)', value: video?.file_url ?? '' },
        { name: 'youtube',  label: 'YouTube URL (reference link only)', value: platforms?.['youtube'] ?? '' },
        { name: 'tiktok',   label: 'TikTok URL (reference link only)',  value: platforms?.['tiktok'] ?? '' },
        { name: 'reels',    label: 'Instagram Reels URL (reference link only)', value: platforms?.['reels'] ?? '' },
      ].map(f => (
        <div key={f.name}>
          <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</label>
          <input name={f.name} defaultValue={f.value}
            className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
      ))}
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Status</label>
        <select name="status" defaultValue={video?.status ?? 'editing'}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          {VIDEO_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Duration (seconds)</label>
        <input name="duration_sec" type="number" defaultValue={video?.duration_sec ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Publish Date</label>
        <input name="publish_date" type="date" defaultValue={video?.publish_date ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Notes</label>
        <textarea name="notes" rows={3} defaultValue={video?.notes ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <button type="submit" disabled={saving}
        className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Video'}
      </button>
    </form>
  )
}
