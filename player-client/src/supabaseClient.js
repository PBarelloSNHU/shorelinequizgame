import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
)

// Stable anonymous identity per device — a refresh reconnects as the SAME
// player instead of a new one, which is what makes rejoin-after-refresh work.
export async function ensureAnonymousSession() {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session

  const { data: signIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signIn.session
}
