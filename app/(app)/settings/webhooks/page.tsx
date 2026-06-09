import { getWebhooks } from '@/actions/webhooks'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { WebhooksList } from '@/components/settings/WebhooksList'

export default async function WebhooksPage() {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/settings')
  const webhooks = await getWebhooks()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Webhooks</h1>
        <p className="text-sm text-brand-400 mt-1">Fire HTTP POST requests when events happen in your studio.</p>
      </div>
      <WebhooksList webhooks={webhooks} />
    </div>
  )
}
