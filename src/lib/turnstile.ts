import { useCallback, useEffect, useRef } from 'react'

/**
 * Cloudflare Turnstile, the captcha in front of writes that go through an
 * Edge Function (the waitlist, see `waitlist.ts`). It runs invisibly and only
 * shows a checkbox when Cloudflare isn't sure the visitor is a person.
 *
 * Site key: `VITE_TURNSTILE_SITE_KEY`. Cloudflare's test key
 * `1x00000000000000000000AA` always passes, for local development.
 */
const SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
/** How long a submit waits for the first token before showing an error. */
const TOKEN_TIMEOUT_MS = 20_000

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let loading: Promise<TurnstileApi> | undefined

/** Loads Cloudflare's script once per page, however many widgets use it. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT
    script.async = true
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error('Turnstile did not load'))
    script.onerror = () => {
      loading = undefined
      script.remove()
      reject(new Error('Turnstile did not load'))
    }
    document.head.appendChild(script)
  })
  return loading
}

type Waiter = { resolve: (token: string) => void; reject: (e: Error) => void }

/**
 * Renders a Turnstile widget into `ref`. `getToken()` resolves with a token
 * (waiting for one if Cloudflare is still checking); tokens are single-use,
 * so call `reset()` after a failed submit to get a fresh one.
 */
export function useTurnstile(action: string) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const token = useRef<string | null>(null)
  const waiters = useRef<Array<Waiter>>([])
  const loadError = useRef<Error | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!SITE_KEY || !el) return
    let cancelled = false

    loadTurnstile()
      .then((api) => {
        if (cancelled) return
        widgetId.current = api.render(el, {
          sitekey: SITE_KEY,
          action,
          theme: 'dark',
          appearance: 'interaction-only',
          callback: (next: string) => {
            token.current = next
            for (const w of waiters.current.splice(0)) w.resolve(next)
          },
          'expired-callback': () => {
            token.current = null
          },
        })
      })
      .catch((e: Error) => {
        loadError.current = e
        for (const w of waiters.current.splice(0)) w.reject(e)
      })

    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
      token.current = null
    }
  }, [action])

  const getToken = useCallback((): Promise<string> => {
    if (!SITE_KEY) {
      return Promise.reject(new Error('VITE_TURNSTILE_SITE_KEY is not set'))
    }
    if (loadError.current) return Promise.reject(loadError.current)
    const ready = token.current
    if (ready) {
      token.current = null
      return Promise.resolve(ready)
    }
    return new Promise((resolve, reject) => {
      const waiter: Waiter = {
        resolve: (next) => {
          clearTimeout(timer)
          token.current = null
          resolve(next)
        },
        reject: (e) => {
          clearTimeout(timer)
          reject(e)
        },
      }
      const timer = setTimeout(() => {
        waiters.current = waiters.current.filter((w) => w !== waiter)
        reject(new Error('Turnstile timed out'))
      }, TOKEN_TIMEOUT_MS)
      waiters.current.push(waiter)
    })
  }, [])

  const reset = useCallback(() => {
    token.current = null
    if (widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [])

  return { ref, getToken, reset }
}
