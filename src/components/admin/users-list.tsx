import { useState } from 'react'
import type { ReactNode } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { useDebouncedValue } from '#/hooks/use-debounced-value'
import { profileSearchFilter } from '#/lib/outreach-search'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

const LIMIT = 50

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  username: string | null
  email: string | null
  phone: string | null
  created_at: string | null
}

interface OwnedBusiness {
  id: string | number
  owner_id: string
  name: string | null
  referral_code: string | null
}

interface UserRow extends Profile {
  businesses: OwnedBusiness[]
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
const fullDate = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function displayName(profile: Profile): string | null {
  const full = profile.full_name?.trim()
  if (full) return full
  const parts = [profile.first_name, profile.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

/**
 * Profiles matching `search` (the newest ones when it's empty), with the
 * businesses each one owns. Businesses come from a second query on
 * owner_id, so this doesn't rely on a foreign key PostgREST could embed.
 */
function useUsers(search: string) {
  return useQuery({
    queryKey: ['admin_users', search],
    queryFn: async (): Promise<{ rows: UserRow[]; total: number }> => {
      let query = supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, full_name, username, email, phone, created_at',
          { count: 'exact' },
        )
      const filter = profileSearchFilter(search)
      if (filter) query = query.or(filter)
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .limit(LIMIT)
      if (error) throw error
      const profiles: Profile[] = data

      const owned = new Map<string, OwnedBusiness[]>()
      if (profiles.length > 0) {
        const { data: businesses, error: businessError } = await supabase
          .from('businesses')
          .select('id, owner_id, name, referral_code')
          .in(
            'owner_id',
            profiles.map((profile) => profile.id),
          )
          .order('name')
        if (businessError) throw businessError
        for (const business of businesses as OwnedBusiness[]) {
          const list = owned.get(business.owner_id) ?? []
          list.push(business)
          owned.set(business.owner_id, list)
        }
      }

      return {
        rows: profiles.map((profile) => ({
          ...profile,
          businesses: owned.get(profile.id) ?? [],
        })),
        total: count ?? profiles.length,
      }
    },
    // Keep the last results on screen while the next search loads.
    placeholderData: keepPreviousData,
  })
}

function UsersList() {
  const [text, setText] = useState('')
  const search = useDebouncedValue(text.trim(), 250)
  const users = useUsers(search)
  const settled = text.trim() === search && !users.isPlaceholderData

  return (
    <section className="flex flex-col gap-5">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-foreground/45"
        />
        <Input
          type="search"
          aria-label="Search users"
          placeholder="Search name, username or email"
          autoComplete="off"
          spellCheck={false}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-12 pl-11"
        />
      </div>

      <UsersResults users={users} search={search} settled={settled} />
    </section>
  )
}

function UsersResults({
  users,
  search,
  settled,
}: {
  users: ReturnType<typeof useUsers>
  search: string
  settled: boolean
}) {
  if (users.isPending) {
    return <p className="m-0 text-sm text-muted-foreground">Loading users…</p>
  }

  if (users.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="m-0 text-sm text-[#ff8a7e]">
          Couldn't load users: {users.error.message}
        </p>
        <Button
          variant="outline"
          onClick={() => users.refetch()}
          disabled={users.isFetching}
        >
          {users.isFetching ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    )
  }

  const { rows, total } = users.data

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="m-0 text-sm text-muted-foreground">
        {!settled
          ? 'Searching…'
          : search
            ? `${total.toLocaleString('en-GB')} matching` +
              (rows.length < total
                ? ` · showing the newest ${rows.length}`
                : '')
            : `The ${rows.length} newest of ${total.toLocaleString('en-GB')} users`}
      </p>

      {rows.length === 0 ? (
        <p className="m-0 text-sm text-muted-foreground">
          {search ? 'No users match the search.' : 'No users yet.'}
        </p>
      ) : (
        <div
          className={cn(
            'rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] transition-opacity',
            !settled && 'opacity-60',
          )}
        >
          <Table className="min-w-2xl table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[22%]" />
              <col className="w-[13%]" />
              <col className="w-[11%]" />
              <col />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Businesses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

/** A cell that cuts a long value off with "…" and shows all of it on hover. */
function Cell({
  value,
  className,
  children,
}: {
  value: string | null
  className?: string
  children?: ReactNode
}) {
  return (
    <TableCell
      title={value ?? undefined}
      className={cn('truncate align-top', className)}
    >
      {children ?? value}
    </TableCell>
  )
}

function UserTableRow({ user }: { user: UserRow }) {
  const name = displayName(user)
  const joined = user.created_at ? new Date(user.created_at) : null

  return (
    <TableRow>
      <Cell value={name}>
        {name ?? <span className="text-muted-foreground">No name</span>}
      </Cell>
      <Cell value={user.username} />
      <Cell value={user.email} />
      <Cell value={user.phone} className="tabular-nums" />
      <Cell
        value={joined && fullDate.format(joined)}
        className="text-muted-foreground tabular-nums"
      >
        {joined && dateFormat.format(joined)}
      </Cell>
      <TableCell className="align-top whitespace-normal">
        {user.businesses.length === 0 ? (
          <span className="text-muted-foreground">No business</span>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {user.businesses.map((business) => (
              <li
                key={business.id}
                className="flex min-w-0 items-baseline gap-2"
              >
                <span
                  className="min-w-0 truncate"
                  title={business.name ?? undefined}
                >
                  {business.name ?? 'Unnamed business'}
                </span>
                {business.referral_code && (
                  <code className="shrink-0 rounded-md bg-white/8 px-1.5 py-0.5 font-mono text-xs text-foreground/80">
                    {business.referral_code}
                  </code>
                )}
              </li>
            ))}
          </ul>
        )}
      </TableCell>
    </TableRow>
  )
}

export { UsersList }
