import { supabase } from './supabase'
import type { Locale } from '#/i18n/translations'

/**
 * Adds an email to the early-access waitlist through the Edge Function
 * `join-waitlist` (bsaas-app, supabase/functions), which checks the Turnstile
 * `token` and inserts the row. Browsers can't write to `public.waitlist`
 * directly. Already-listed emails count as success.
 */
export async function joinWaitlist(
  email: string,
  locale: Locale,
  token: string,
) {
  const { error } = await supabase.functions.invoke('join-waitlist', {
    body: { email: email.trim().toLowerCase(), locale, token },
  })
  if (error) throw error
}
