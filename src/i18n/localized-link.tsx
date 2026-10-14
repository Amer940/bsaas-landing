import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { useLocale } from './locale-context'
import { localeParam } from './translations'

const LOCALIZED_ROUTES = {
  '/': '/{-$locale}',
  '/privacy': '/{-$locale}/privacy',
  '/terms': '/{-$locale}/terms',
  '/support': '/{-$locale}/support',
  '/delete-account': '/{-$locale}/delete-account',
} as const

export type LocalizedPath = keyof typeof LOCALIZED_ROUTES

export function isLocalizedPath(path: string): path is LocalizedPath {
  return path in LOCALIZED_ROUTES
}

type LocalizedLinkProps = Omit<
  ComponentProps<'a'>,
  'href' | 'ref' | 'children'
> & {
  to: LocalizedPath
  hash?: string
  children?: React.ReactNode
}

/** A link to a page in the current locale (`/privacy` → `/en/privacy`). */
function LocalizedLink({ to, hash, ...props }: LocalizedLinkProps) {
  const { locale } = useLocale()

  return (
    <Link
      to={LOCALIZED_ROUTES[to]}
      params={{ locale: localeParam(locale) }}
      hash={hash}
      {...props}
    />
  )
}

export { LocalizedLink }
