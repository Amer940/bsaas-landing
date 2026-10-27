// Helpers for public.outreach_contacts values. Instagram values are
// normalized the way the DB fills its generated instagram_norm column, so
// "@Name", "instagram.com/name?igsh=…" and "name" are the same handle.

export function normalizeInstagram(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')
    .replace(/^@/, '')
    .replace(/[/?].*$/, '')
}

/**
 * The profile link for a stored Instagram value, always built as
 * https://instagram.com/<handle> from a handle that passes Instagram's
 * rules (letters, digits, "." and "_", up to 30, no leading, trailing or
 * double "."). The stored text itself never becomes the href. Null when
 * there's no valid handle.
 */
export function instagramProfileUrl(value: string): string | null {
  const handle = normalizeInstagram(value)
  if (!/^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z0-9._]{1,30}$/.test(handle)) return null
  return `https://instagram.com/${handle}`
}
