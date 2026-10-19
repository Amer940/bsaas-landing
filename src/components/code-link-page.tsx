import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { AuthCard } from '#/components/auth-card'
import { Button } from '#/components/ui/button'
import { useLocale } from '#/i18n/locale-context'
import type { Locale } from '#/i18n/translations'

// What a code link opens when the app isn't there to: a shop's
// (chairo.app/join/<code>, its QR and shared link) or a friend's invite
// (chairo.app/invite/<code>). With the app installed the phone opens the app
// instead (Android app links and iOS associated domains, checked against
// public/.well-known), so this page is for everyone without it: the code to
// enter, and the store button.
//
// The Play button carries the code in the install referrer (shop=<code> or
// invite=<code>); the app reads it on its join screen after install, so the
// code is filled in. iOS has no equivalent, so there the code is the way in.

export interface CodeLinkContent {
  metaTitle: string
  title: string
  body: string
  codeLabel: string
  copy: string
  copied: string
  googlePlay: string
  playHint: string
  iosSoon: string
  openApp: string
  qrTitle: string
  qrCaption: string
  qrLabel: string
  home: string
}

type CodeLinkKind = 'shop' | 'invite'

interface CodeLinkPageProps {
  /** Already normalized and checked by the route. */
  code: string
  kind: CodeLinkKind
  content: Record<Locale, CodeLinkContent>
}

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.chairo.app'
// TODO: the App Store link once the iOS app is out; until then iPhones get
// the "coming soon" line instead of a store button.
const APP_STORE_URL: string | null = null

// What the QR encodes: the same link the app's own QR carries, without a
// locale, so the phone that scans it lands on the app or this page.
const LINK_BASE = 'https://chairo.app/'
const PATHS: Record<CodeLinkKind, string> = { shop: 'join', invite: 'invite' }
const QR_SIZE = 168

function playStoreUrl(kind: CodeLinkKind, code: string) {
  const referrer = encodeURIComponent(`${kind}=${code}`)
  return `${PLAY_STORE_URL}&referrer=${referrer}`
}

type Platform = 'android' | 'ios' | 'other'

function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  // iPadOS reports itself as a Mac; the touch points give it away.
  if (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  )
    return 'ios'
  return 'other'
}

const COPIED_MS = 1800

export function CodeLinkPage({ code, kind, content }: CodeLinkPageProps) {
  const { locale } = useLocale()
  const c = content[locale]
  const [platform] = useState(detectPlatform)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }

  const showIosSoon = platform === 'ios' && !APP_STORE_URL

  return (
    <AuthCard metaTitle={c.metaTitle} homeLabel={c.home}>
      <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
        {c.title}
      </h1>
      <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
        {c.body}
      </p>

      <div className="mt-7">
        <span className="text-sm text-foreground/65">{c.codeLabel}</span>
        <div className="mt-1.5 flex items-center rounded-2xl bg-white/8 py-2 pr-2 pl-5">
          <span className="min-w-0 flex-1 truncate text-2xl font-extrabold tracking-[0.12em]">
            {code}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => void copyCode()}
            aria-live="polite"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? c.copied : c.copy}
          </Button>
        </div>
      </div>

      {/* Opened on a computer, the phone that should get the app is the one
          in their hand: a QR hands the link over. */}
      {platform === 'other' && (
        <div className="mt-7 flex flex-col items-center text-center">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG
              value={`${LINK_BASE}${PATHS[kind]}/${code}`}
              size={QR_SIZE}
              marginSize={0}
              role="img"
              aria-label={c.qrLabel}
            />
          </div>
          <p className="m-0 mt-3.5 text-base font-bold">{c.qrTitle}</p>
          <p className="m-0 mt-1 text-sm leading-normal text-foreground/50">
            {c.qrCaption}
          </p>
        </div>
      )}

      {showIosSoon ? (
        <p className="m-0 mt-7 text-base text-foreground/65">{c.iosSoon}</p>
      ) : (
        <>
          <Button asChild size="lg" className="mt-7 w-full">
            <a href={playStoreUrl(kind, code)}>{c.googlePlay}</a>
          </Button>
          <p className="m-0 mt-3 text-sm leading-normal text-foreground/50">
            {c.playHint}
          </p>
        </>
      )}

      {/* With the app installed but the link opened in the browser anyway
          (an in-app browser, say), the app's own scheme still gets there. */}
      {platform !== 'other' && (
        <a
          href={`chairo://${PATHS[kind]}/${code}`}
          className="mt-6 block text-center text-sm text-foreground/65 underline underline-offset-4"
        >
          {c.openApp}
        </a>
      )}
    </AuthCard>
  )
}
