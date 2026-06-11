import { getWebhooks, getWebhookDeliveries } from '@/actions/webhooks'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { WebhooksList } from '@/components/settings/WebhooksList'

export default async function WebhooksPage() {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/settings')
  const [webhooks, deliveries] = await Promise.all([getWebhooks(), getWebhookDeliveries()])
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Webhooks</h1>
        <p className="text-sm text-brand-400 mt-1">Fire HTTP POST requests when events happen in your studio.</p>
      </div>
      <WebhooksList webhooks={webhooks} />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-white mb-3">Recent Deliveries</h2>
        {deliveries.length === 0 ? (
          <p className="text-[13px] text-brand-400">No deliveries yet. Events appear here once a webhook fires.</p>
        ) : (
          <div className="rounded-xl border border-white/[0.07] overflow-hidden">
            {deliveries.map((d, i) => (
              <div key={d.id} className={`flex items-center gap-4 px-4 py-2.5 text-[12px] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${d.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-white/70 font-mono w-44 shrink-0">{d.event}</span>
                <span className="text-brand-400 truncate flex-1">{d.url}</span>
                <span className={`shrink-0 font-mono ${d.success ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                  {d.status_code ?? d.error ?? '—'}
                </span>
                <span className="text-white/25 shrink-0">{new Date(d.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
