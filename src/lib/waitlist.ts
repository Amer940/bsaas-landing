import { supabase } from './supabase'
import type { Locale } from '#/i18n/translations'

/** Adds an email to the early-access waitlist. Already-listed emails count as success. */
export async function joinWaitlist(email: string, locale: Locale) {
  const { error } = await supabase.from('waitlist').insert({ email, locale })
  // 23505 = unique violation: the email is already on the list.
  if (error && error.code !== '23505') throw error
}
