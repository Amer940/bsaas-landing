// Search over public.outreach_contacts. The search text is normalized the
// way the DB fills its generated email_norm, instagram_norm and phone_norm
// columns, so "@Name", "instagram.com/name?igsh=…" and "name" all find the
// same contact, and so do "+387 61 123-456" and "38761123456".

export type ContactField = 'name' | 'email' | 'instagram' | 'phone'

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function normalizeInstagram(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')
    .replace(/^@/, '')
    .replace(/[/?].*$/, '')
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
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

/**
 * One `col.ilike.<value>` filter, safe inside PostgREST's `.or()`.
 * LIKE wildcards in the text are escaped so they match literally (`*` is
 * PostgREST's own wildcard and can't be escaped, so it becomes `_`, which
 * still matches it). The value is then double-quoted, which keeps `,` `.`
 * `:` `(` `)` from being read as filter syntax.
 */
export function ilikeFilter(column: string, text: string) {
  const like = text.replace(/[\\%_]/g, '\\$&').replace(/\*/g, '_')
  const quoted = `%${like}%`.replace(/[\\"]/g, '\\$&')
  return `${column}.ilike."${quoted}"`
}

/**
 * The `.or()` filter for a search, or null when there's nothing to search.
 * The *_norm columns are only matched when the normalized text isn't empty
 * (an empty pattern would match every row), and phone_norm only when the
 * text has no letters, so "john 2" doesn't match every phone with a 2.
 */
export function searchFilter(search: string): string | null {
  const text = search.trim()
  if (!text) return null

  const filters = ['name', 'email', 'instagram', 'phone'].map((column) =>
    ilikeFilter(column, text),
  )

  const email = normalizeEmail(text)
  if (email) filters.push(ilikeFilter('email_norm', email))

  const instagram = normalizeInstagram(text)
  if (instagram) filters.push(ilikeFilter('instagram_norm', instagram))

  const phone = normalizePhone(text)
  if (phone && !/\p{L}/u.test(text)) {
    filters.push(ilikeFilter('phone_norm', phone))
  }

  return filters.join(',')
}

/** Which form field a search text most likely belongs in. */
export function guessField(search: string): ContactField {
  const text = search.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'email'
  if (text.startsWith('@') || /instagram\.com/i.test(text)) return 'instagram'

  const chars = text.replace(/\s/g, '')
  const digits = normalizePhone(chars).length
  if (digits >= 3 && digits / chars.length >= 0.6) return 'phone'

  return 'name'
}
