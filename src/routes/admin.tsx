import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { Logo } from '#/components/logo'
import { FeedbackList } from '#/components/admin/feedback-list'
import { NewOutreachForm } from '#/components/admin/new-outreach-form'
import type { NewOutreachFormHandle } from '#/components/admin/new-outreach-form'
import { OutreachContacts } from '#/components/admin/outreach-contacts'
import { OutreachSearch } from '#/components/admin/outreach-search'
import { UsersList } from '#/components/admin/users-list'
import { useDebouncedValue } from '#/hooks/use-debounced-value'
import { guessField } from '#/lib/outreach-search'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { supabase } from '#/lib/supabase'

// Internal admin page, English only, outside the {-$locale} routes.

/** Tabs other than Outreach, which has no ?tab so the default URL is /admin. */
const OTHER_TABS = ['feedback', 'users'] as const
type OtherTab = (typeof OTHER_TABS)[number]

export const Route = createFileRoute('/admin')({
  // ?tab=feedback or ?tab=users; anything else means Outreach.
  validateSearch: (search: Record<string, unknown>): { tab?: OtherTab } => ({
    tab: OTHER_TABS.find((tab) => tab === search.tab),
  }),
  component: AdminPage,
})

function AdminPage() {
  // undefined until Supabase reports the first auth state.
  const [session, setSession] = useState<Session | null | undefined>()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    // Everything here keeps corners at 8px or less. The shared Button is a
    // pill on the landing page, so it is squared off for this page only.
    <div className="[&_[data-slot=button]]:rounded-lg">
      <title>Admin · chairo.</title>
      <meta name="robots" content="noindex" />
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
          <SignInForm />
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

const mainClass =
  'mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 md:px-6'

/** The signed-in admin page: Outreach and Feedback tabs, kept in ?tab. */
function Dashboard({ email }: { email: string }) {
  const { tab = 'outreach' } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <Tabs
      value={tab}
      onValueChange={(next) =>
        navigate({
          search: { tab: OTHER_TABS.find((tab) => tab === next) },
        })
      }
      className="min-h-svh gap-0"
    >
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 md:px-6">
          <h1 className="sr-only">Admin</h1>
          <TabsList aria-label="Admin sections">
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <span className="ml-auto min-w-0 truncate text-sm text-muted-foreground">
            {email}
          </span>
          <SignOutButton />
        </div>
      </header>
      {/* Kept mounted while hidden, so the search and a half-filled form
          are still there after a look at another tab. */}
      <TabsContent
        value="outreach"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        <OutreachTab />
      </TabsContent>
      <TabsContent value="feedback">
        <main className={mainClass}>
          <FeedbackList />
        </main>
      </TabsContent>
      <TabsContent value="users">
        <main className={mainClass}>
          <UsersList />
        </main>
      </TabsContent>
    </Tabs>
  )
}

function OutreachTab() {
  const [searchText, setSearchText] = useState('')
  const search = useDebouncedValue(searchText.trim(), 250)
  const form = useRef<NewOutreachFormHandle>(null)

  return (
    <main className={mainClass}>
      <OutreachSearch
        value={searchText}
        onChange={setSearchText}
        search={search}
        onUseText={(text) => form.current?.prefill(guessField(text), text)}
      />
      <NewOutreachForm ref={form} />
      <OutreachContacts search={search} />
    </main>
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

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }

    setBusy(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    // On success onAuthStateChange swaps this form out.
    if (signInError) setError(signInError.message)
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
          onSubmit={handleSubmit}
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

          {error && (
            <p role="alert" className="m-0 text-sm text-[#ff8a7e]">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </>
  )
}
