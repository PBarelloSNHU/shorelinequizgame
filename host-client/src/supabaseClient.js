import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
)

// Every device (host or player) gets a stable anonymous identity so that a
// page refresh reconnects as the SAME user instead of creating a new one.
// This is what makes "rejoin after refresh" work without a custom token.
export async function ensureAnonymousSession() {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session

  const { data: signIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signIn.session
}
