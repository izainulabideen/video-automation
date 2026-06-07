import { createClient } from '@supabase/supabase-js'

// Admin client uses service role key for user management tables.
// Return type is 'any' since these tables aren't in the generated schema yet
// (run `supabase gen types` after applying migration 002 to get full types).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminClient(): ReturnType<typeof createClient<any>> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
