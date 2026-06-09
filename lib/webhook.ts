import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export type WebhookEvent =
  | 'scenario.published'
  | 'scenario.created'
  | 'scenario.assigned'

export async function fireWebhook(event: WebhookEvent, payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { data: hooks } = await supabase
    .from('webhooks')
    .select('url, secret, events')
    .eq('is_active', true)
    .contains('events', [event])

  for (const hook of hooks ?? []) {
    const body = JSON.stringify({ event, data: payload, timestamp: Date.now() })
    const sig = crypto.createHmac('sha256', hook.secret).update(body).digest('hex')
    fetch(hook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Veank-Signature': sig },
      body,
    }).catch(() => {})
  }
}
