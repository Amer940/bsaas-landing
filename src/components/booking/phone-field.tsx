import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { dialCode, phoneCountries } from '#/lib/phone'
import type { CountryCode } from '#/lib/phone'

/**
 * A phone number with its country: the dialling code shows next to the
 * number, and a native select (invisible, over it) picks the country, so a
 * phone gets its own picker.
 */
export function PhoneField({
  country,
  onCountry,
  value,
  onChange,
  error,
}: {
  country: CountryCode
  onCountry: (country: CountryCode) => void
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const countries = useMemo(() => phoneCountries(locale), [locale])

  return (
    <div>
      <label htmlFor="booking-phone" className="text-sm text-foreground/65">
        {c.phone}
      </label>
      <div className="mt-1.5 flex gap-2">
        <div className="relative shrink-0 rounded-2xl focus-within:ring-2 focus-within:ring-foreground/30">
          <span
            aria-hidden
            className="flex h-13 items-center gap-1 rounded-2xl bg-white/8 pr-3 pl-4 text-base tabular-nums"
          >
            <span className="text-foreground/60">{country}</span>
            <span>{dialCode(country)}</span>
            <ChevronDown className="size-4 text-foreground/50" />
          </span>
          <select
            aria-label={c.country}
            value={country}
            onChange={(e) => onCountry(e.target.value as CountryCode)}
            className="absolute inset-0 size-full cursor-pointer rounded-2xl opacity-0"
          >
            {countries.nearby.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name} ({option.dial})
              </option>
            ))}
            <option disabled>──────────</option>
            {countries.rest.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name} ({option.dial})
              </option>
            ))}
          </select>
        </div>
        <Input
          id="booking-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'booking-phone-error' : undefined}
          className="h-13 flex-1 rounded-2xl px-5"
        />
      </div>
      {error ? (
        <span
          id="booking-phone-error"
          role="alert"
          className="mt-1.5 block text-sm text-[#ff8a7e]"
        >
          {error}
        </span>
      ) : null}
    </div>
  )
}
