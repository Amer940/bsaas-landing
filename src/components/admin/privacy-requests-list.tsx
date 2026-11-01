import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, RotateCcw } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { supabase } from '#/lib/supabase'

const LIMIT = 500
const KEY = ['privacy-requests']

// The profile is embedded whole (`*`) and read defensively, like feedback.
const COLUMNS = `
  id, user_id, kind, message, status, created_at, resolved_at,
  profile:profiles(*)
`

type Row = Record<string, unknown>

interface PrivacyRequest {
  id: string
  user_id: string | null
  kind: string
  message: string
  status: string
  created_at: string
  resolved_at: string | null
  profile: Row | Row[] | null
}

const KINDS: Record<string, string> = {
  restrict: 'Restrict processing (Art. 18)',
  object: 'Objection to processing (Art. 21)',
  other: 'Other',
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })

function one(value: Row | Row[] | null): Row | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function text(row: Row | null, key: string): string | null {
  const value = row?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function profileName(profile: Row | null): string | null {
  return (
    text(profile, 'full_name') ??
    text(profile, 'username') ??
    ([text(profile, 'first_name'), text(profile, 'last_name')]
      .filter(Boolean)
      .join(' ') ||
      null)
  )
}

/** GDPR Art. 12(3): one month from when it was filed. */
function answerBy(createdAt: string): Date {
  const due = new Date(createdAt)
  due.setMonth(due.getMonth() + 1)
  return due
}

function PrivacyRequestsList() {
  const queryClient = useQueryClient()
  const [updateError, setUpdateError] = useState<string | null>(null)

  const requests = useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<PrivacyRequest[]> => {
      const { data, error } = await supabase
        .from('privacy_requests')
        .select(COLUMNS)
        .order('created_at', { ascending: false })
        .limit(LIMIT)
      if (error) throw error
      return data
    },
  })

  const setResolved = useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      // Only these two columns: admins can't update anything else.
      const { data, error } = await supabase
        .from('privacy_requests')
        .update({
          status: resolved ? 'resolved' : 'open',
          resolved_at: resolved ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select('id')
      if (error) throw error
      // RLS skips rows it won't let you change instead of failing.
      if (data.length === 0) throw new Error('Nothing was updated.')
    },
    onMutate: () => setUpdateError(null),
    onError: (error) => setUpdateError(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })

  if (requests.isPending) {
    return (
      <p className="m-0 text-sm text-muted-foreground">
        Loading privacy requests…
      </p>
    )
  }

  if (requests.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="m-0 text-sm text-[#ff8a7e]">
          Couldn't load privacy requests: {requests.error.message}
        </p>
        <Button
          variant="outline"
          onClick={() => requests.refetch()}
          disabled={requests.isFetching}
        >
          {requests.isFetching ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    )
  }

  // Open ones first, the soonest deadline on top.
  const open = requests.data
    .filter((row) => row.status === 'open')
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
  const resolved = requests.data.filter((row) => row.status !== 'open')
  const rows = [...open, ...resolved]

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="m-0 text-base font-bold">Privacy requests</h2>
        <p className="m-0 text-sm text-muted-foreground">
          {open.length} open · {resolved.length} resolved
        </p>
      </div>

      {updateError && (
        <p role="alert" className="m-0 text-sm text-[#ff8a7e]">
          Couldn't update the request: {updateError}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="m-0 text-sm text-muted-foreground">
          No privacy requests yet.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {rows.map((row) => (
            <li key={row.id}>
              <RequestCard
                entry={row}
                saving={
                  setResolved.isPending && setResolved.variables.id === row.id
                }
                onToggle={() =>
                  setResolved.mutate({
                    id: row.id,
                    resolved: row.status === 'open',
                  })
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RequestCard({
  entry,
  saving,
  onToggle,
}: {
  entry: PrivacyRequest
  saving: boolean
  onToggle: () => void
}) {
  const isOpen = entry.status === 'open'
  const due = answerBy(entry.created_at)
  const overdue = isOpen && due.getTime() < Date.now()
  const profile = one(entry.profile)
  const email = text(profile, 'email')

  return (
    <Card className="gap-3 rounded-lg border-none bg-white/[.03] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{KINDS[entry.kind] ?? entry.kind}</Badge>
        <Badge variant={isOpen ? 'info' : 'success'}>
          {isOpen ? 'Open' : 'Resolved'}
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          Filed {dateFormat.format(new Date(entry.created_at))}
        </span>
      </div>

      <p className="m-0 text-[0.9375rem] leading-normal break-words whitespace-pre-wrap">
        {entry.message}
      </p>

      <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        {entry.user_id === null ? (
          <span className="text-muted-foreground">Account deleted</span>
        ) : (
          <>
            <span className="font-bold">
              {profileName(profile) ?? 'Unknown sender'}
            </span>
            {email && (
              <a
                className="text-foreground/75 underline"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            )}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <p
          className={`m-0 min-w-0 flex-1 text-xs ${overdue ? 'font-bold text-[#ff8a7e]' : 'text-muted-foreground'}`}
        >
          {isOpen
            ? `${overdue ? 'Overdue, answer was due' : 'Answer by'} ${dateFormat.format(due)}`
            : entry.resolved_at &&
              `Resolved ${dateFormat.format(new Date(entry.resolved_at))}`}
        </p>
        <Button
          variant="outline"
          className="h-8 px-3 text-sm"
          onClick={onToggle}
          disabled={saving}
        >
          {isOpen ? <Check /> : <RotateCcw />}
          {isOpen ? 'Mark resolved' : 'Reopen'}
        </Button>
      </div>
    </Card>
  )
}

export { PrivacyRequestsList }
