import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export type WebhookEvent =
  | 'scenario.published'
  | 'scenario.created'
  | 'scenario.assigned'

const MAX_RETRIES = 2 // 1 initial attempt + 2 retries, exponential backoff

async function deliver(url: string, body: string, sig: string): Promise<{ status: number | null; error: string | null }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Veank-Signature': sig },
        body,
        signal: AbortSignal.timeout(10_000),
      })
      if (res.ok) return { status: res.status, error: null }
      // 4xx won't succeed on retry; only retry on 5xx
      if (res.status < 500 || attempt === MAX_RETRIES) return { status: res.status, error: `HTTP ${res.status}` }
    } catch (e) {
      if (attempt === MAX_RETRIES) return { status: null, error: e instanceof Error ? e.message : 'Request failed' }
    }
    await new Promise(r => setTimeout(r, 1000 * 2 ** attempt))
  }
  return { status: null, error: 'Unreachable' }
}

export async function fireWebhook(event: WebhookEvent, payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { data: hooks } = await supabase
    .from('webhooks')
    .select('id, url, secret, events')
    .eq('is_active', true)
    .contains('events', [event])

  for (const hook of hooks ?? []) {
    const body = JSON.stringify({ event, data: payload, timestamp: Date.now() })
    const sig = crypto.createHmac('sha256', hook.secret).update(body).digest('hex')
    deliver(hook.url, body, sig)
      .then(({ status, error }) =>
        supabase.from('webhook_deliveries').insert({
          webhook_id: hook.id,
          event,
          url: hook.url,
          payload,
          status_code: status,
          success: status !== null && status >= 200 && status < 300,
          error,
        } as never)
      )
      .then(() => {})
      .catch(() => {})
  }
}
