import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/max'
import type { CountryCode } from 'libphonenumber-js/max'

// Phone numbers on the booking page (book/$code). The shop calls the number
// and counts no-shows by it, so it's checked against the country's real
// numbering plan (the `max` metadata; `min` only checks the length) and sent
// as E.164 (+38761123456).

export type { CountryCode }

export const DEFAULT_COUNTRY: CountryCode = 'BA'

/** Listed first: where nearly everyone booking a Bosnian shop is from. */
const NEARBY: Array<CountryCode> = ['BA', 'HR', 'RS', 'ME', 'SI', 'DE', 'AT']

export interface PhoneCountry {
  code: CountryCode
  name: string
  /** "+387" */
  dial: string
}

function regionNames(locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' })
  } catch {
    return null
  }
}

/** Every country, nearby ones first, the rest by name in `locale`. */
export function phoneCountries(locale: string): {
  nearby: Array<PhoneCountry>
  rest: Array<PhoneCountry>
} {
  const names = regionNames(locale)
  const toCountry = (code: CountryCode): PhoneCountry => ({
    code,
    name: names?.of(code) ?? code,
    dial: `+${getCountryCallingCode(code)}`,
  })
  const rest = getCountries()
    .filter((code) => !NEARBY.includes(code))
    .map(toCountry)
    .sort((a, b) => a.name.localeCompare(b.name, locale))
  return { nearby: NEARBY.map(toCountry), rest }
}

export function dialCode(country: CountryCode) {
  return `+${getCountryCallingCode(country)}`
}

/**
 * The typed number as E.164, or null when it isn't a valid number. A number
 * typed with its own `+` prefix wins over the picked country.
 */
export function toE164(input: string, country: CountryCode): string | null {
  const trimmed = input.trim()
  if (!/^\+?[\d\s()./-]+$/.test(trimmed)) return null
  const parsed = parsePhoneNumberFromString(trimmed, country)
  return parsed?.isValid() ? parsed.number : null
}
