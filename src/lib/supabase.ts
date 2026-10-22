import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  // The email-change link lands with a session in the hash (email-changed);
  // it isn't meant to sign this browser in.
  { auth: { detectSessionInUrl: false } },
)
