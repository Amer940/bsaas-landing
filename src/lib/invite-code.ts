// Invite (referral) codes for businesses: chairo.app/join/<code>.

/** Same shape the server enforces (businesses_referral_code_format). */
export const INVITE_CODE_FORMAT = /^[A-Z0-9-]{4,20}$/

export const INVITE_CODE_MAX = 20

// Letters Unicode doesn't split into base + accent (đ), plus the local
// ones spelled out so they never depend on normalization.
const LETTERS: Record<string, string> = {
  č: 'c',
  ć: 'c',
  š: 's',
  ž: 'z',
  đ: 'd',
}

/**
 * A suggested invite code for a business name: "Brijačnica Đuro & Co" ->
 * "BRIJACNICA-DURO-CO". Uppercase, diacritics removed, spaces to "-",
 * only A-Z, 0-9 and "-", no doubled or edge dashes, at most 20 characters.
 */
export function inviteCodeFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[čćšžđ]/g, (letter) => LETTERS[letter])
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, INVITE_CODE_MAX)
    .replace(/-+$/, '')
}
