import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { Logo } from '#/components/logo'
import { OutreachContacts } from '#/components/admin/outreach-contacts'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { supabase } from '#/lib/supabase'

// Internal admin page, English only, outside the {-$locale} routes.
// The shared Supabase client doesn't read sessions from the URL (see
// lib/supabase.ts), so the login link's tokens are picked up here by hand.

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

type Message = { kind: 'error' | 'info'; text: string }

/**
 * Signs in with whatever the login link left in the address bar: a session
 * in the hash, or a token_hash in the query. Returns an error message, if any.
 */
async function consumeLoginLink(): Promise<string | null> {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const query = new URLSearchParams(window.location.search)
  if (!hash.toString() && !query.toString()) return null

  // Wipe the tokens before using them, so they don't linger in history.
  window.history.replaceState(null, '', window.location.pathname)

  // Not the error text from the URL: anyone can put words there, and it
  // would read as a message from this page.
  if (hash.has('error') || query.has('error')) {
    return 'That login link is invalid or has expired. Request a new one.'
  }

  const accessToken = hash.get('access_token')
  const refreshToken = hash.get('refresh_token')
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    return error?.message ?? null
  }

  const tokenHash = query.get('token_hash')
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      // 'email' covers login links (it replaced the older 'magiclink').
      type: 'email',
    })
    return error?.message ?? null
  }

  return null
}

function AdminPage() {
  // undefined until Supabase reports the first auth state.
  const [session, setSession] = useState<Session | null | undefined>()
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    consumeLoginLink().then((error) => {
      if (error) setLinkError(error)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    // Everything here keeps corners at 8px or less. The shared Button is a
    // pill on the landing page, so it is squared off for this page only.
    <div className="[&_[data-slot=button]]:rounded-lg">
      <title>Admin · chairo.</title>
      {session === undefined ? (
        <CenteredCard>
          <Loading />
        </CenteredCard>
      ) : session ? (
        <AdminGate
          userId={session.user.id}
          email={session.user.email ?? session.user.id}
        />
      ) : (
        <CenteredCard>
          <SignInForm initialError={linkError} />
        </CenteredCard>
      )}
    </div>
  )
}

/** The wordmark over one dark card: sign-in, loading and no-access states. */
function CenteredCard({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-16">
      <Logo />
      <Card className="mt-10 w-full max-w-110 rounded-lg border-none bg-[#181818] py-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:py-10">
        {children}
      </Card>
    </main>
  )
}

function Loading() {
  return (
    <CardContent>
      <p className="m-0 text-sm text-muted-foreground">Loading…</p>
    </CardContent>
  )
}

/**
 * Asks the database whether the signed-in user is an admin. This only picks
 * what to show; the data itself must be guarded by RLS.
 */
function AdminGate({ userId, email }: { userId: string; email: string }) {
  const isAdmin = useQuery({
    // Keyed by user, so a different account never sees a cached answer.
    queryKey: ['is_admin', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_admin')
      if (error) throw error
      return data === true
    },
    staleTime: Infinity,
  })

  if (isAdmin.isPending) {
    return (
      <CenteredCard>
        <Loading />
      </CenteredCard>
    )
  }

  if (isAdmin.isError) {
    return (
      <CenteredCard>
        <CardHeader>
          <CardTitle className="text-xl">Couldn't check your access</CardTitle>
          <CardDescription>{isAdmin.error.message}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            onClick={() => isAdmin.refetch()}
            disabled={isAdmin.isFetching}
          >
            {isAdmin.isFetching ? 'Retrying…' : 'Try again'}
          </Button>
          <SignOutButton />
        </CardContent>
      </CenteredCard>
    )
  }

  if (!isAdmin.data) {
    return (
      <CenteredCard>
        <CardHeader>
          <CardTitle className="text-xl">You don't have access</CardTitle>
          <CardDescription>
            Signed in as <span className="text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignOutButton />
        </CardContent>
      </CenteredCard>
    )
  }

  return <Dashboard email={email} />
}

function Dashboard({ email }: { email: string }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 md:px-6">
          <h1 className="m-0 text-lg font-bold tracking-[-0.02em]">Outreach</h1>
          <span className="ml-auto min-w-0 truncate text-sm text-muted-foreground">
            {email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 md:px-6">
        <OutreachContacts />
      </main>
    </div>
  )
}

function SignOutButton() {
  const queryClient = useQueryClient()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    // Only this browser: keep the same account signed in on the app.
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) {
      setSigningOut(false)
      return
    }
    // Drop the access check and any admin data loaded for this account.
    queryClient.clear()
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
      {signingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}

function SignInForm({ initialError }: { initialError: string | null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState<'password' | 'link' | null>(null)
  const [message, setMessage] = useState<Message | null>(null)

  // A bad login link is reported once its check finishes.
  useEffect(() => {
    if (initialError) setMessage({ kind: 'error', text: initialError })
  }, [initialError])

  async function handlePasswordSignIn(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    if (!email.trim() || !password) {
      setMessage({ kind: 'error', text: 'Enter your email and password.' })
      return
    }

    setBusy('password')
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(null)
    // On success onAuthStateChange swaps this form out.
    if (error) setMessage({ kind: 'error', text: error.message })
  }

  async function handleSendLink() {
    if (busy) return
    if (!email.trim()) {
      setMessage({ kind: 'error', text: 'Enter your email first.' })
      return
    }

    setBusy('link')
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin + '/admin',
        shouldCreateUser: false,
      },
    })
    setBusy(null)
    setMessage(
      error
        ? { kind: 'error', text: error.message }
        : { kind: 'info', text: 'Check your email for a login link.' },
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Admin sign in</CardTitle>
        <CardDescription>
          Sign in with your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handlePasswordSignIn}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <p
              role={message.kind === 'error' ? 'alert' : 'status'}
              className={
                message.kind === 'error'
                  ? 'm-0 text-sm text-[#ff8a7e]'
                  : 'm-0 text-sm text-foreground/75'
              }
            >
              {message.text}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={!!busy}>
            {busy === 'password' ? 'Signing in…' : 'Sign in'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSendLink}
            disabled={!!busy}
          >
            {busy === 'link' ? 'Sending…' : 'Email me a login link'}
          </Button>
        </form>
      </CardContent>
    </>
  )
}
