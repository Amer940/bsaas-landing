import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { useDebouncedValue } from '#/hooks/use-debounced-value'
import {
  INVITE_CODE_FORMAT,
  INVITE_CODE_MAX,
  inviteCodeFromName,
} from '#/lib/invite-code'
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

interface CreatedBusiness {
  name: string
  code: string
}

function UserTableRow({ user }: { user: UserRow }) {
  const name = displayName(user)
  const joined = user.created_at ? new Date(user.created_at) : null
  const [formOpen, setFormOpen] = useState(false)
  const [created, setCreated] = useState<CreatedBusiness | null>(null)

  return (
    <>
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
          <div className="flex flex-col items-start gap-2">
            {user.businesses.length === 0 ? (
              <span className="text-muted-foreground">No business</span>
            ) : (
              <ul className="m-0 flex w-full list-none flex-col gap-1 p-0">
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
            {/* Always offered: a profile may own several businesses. */}
            {!formOpen && (
              <Button
                variant="outline"
                className="h-8 px-3 text-sm"
                onClick={() => {
                  setCreated(null)
                  setFormOpen(true)
                }}
              >
                <Plus />
                Make business
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {formOpen && (
        <TableRow className="bg-white/[.02] hover:bg-white/[.02]">
          <TableCell colSpan={6} className="whitespace-normal">
            <MakeBusinessForm
              ownerId={user.id}
              ownerName={name ?? user.email ?? user.username ?? 'this user'}
              onCancel={() => setFormOpen(false)}
              onCreated={(business) => {
                setFormOpen(false)
                setCreated(business)
              }}
            />
          </TableCell>
        </TableRow>
      )}

      {created && (
        <TableRow className="bg-[#6fdc9a]/6 hover:bg-[#6fdc9a]/6">
          <TableCell colSpan={6} className="whitespace-normal">
            <div className="flex items-start justify-between gap-3">
              <p role="status" className="m-0 text-sm text-[#6fdc9a]">
                Business <strong>{created.name}</strong> created with code{' '}
                <strong className="font-mono">{created.code}</strong>. The user
                must sign out and sign in again in the app to become the owner.
              </p>
              <Button
                variant="outline"
                className="h-8 shrink-0 px-3 text-sm"
                onClick={() => setCreated(null)}
              >
                Dismiss
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

const NAME_MAX = 80

interface MakeBusinessFormProps {
  ownerId: string
  ownerName: string
  onCancel: () => void
  onCreated: (business: CreatedBusiness) => void
}

type FormErrors = { name?: string; code?: string; form?: string }

/**
 * Inline form under a profile row: business name plus an invite code that
 * follows the name until it's edited by hand. Creates the business through
 * the admin_create_business RPC.
 */
function MakeBusinessForm({
  ownerId,
  ownerName,
  onCancel,
  onCreated,
}: MakeBusinessFormProps) {
  const queryClient = useQueryClient()
  const [businessName, setBusinessName] = useState('')
  const [code, setCode] = useState('')
  const [codeEdited, setCodeEdited] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const create = useMutation({
    mutationFn: async (input: { name: string; code: string }) => {
      const { data, error } = await supabase.rpc('admin_create_business', {
        p_owner_id: ownerId,
        p_name: input.name,
        p_code: input.code,
      })
      if (error) throw error
      // A function returning a table comes back as a list of rows.
      const row: CreatedRow | undefined = Array.isArray(data) ? data[0] : data
      return {
        name: row?.business_name ?? input.name,
        code: row?.invite_code ?? input.code,
      }
    },
    onSuccess: (business) => {
      onCreated(business)
      return queryClient.invalidateQueries({ queryKey: ['admin_users'] })
    },
    // The DB's own words, e.g. "Invite code X is already taken".
    onError: (error) => setErrors({ form: error.message }),
  })

  function handleNameChange(value: string) {
    setBusinessName(value)
    if (!codeEdited) setCode(inviteCodeFromName(value))
    setErrors((e) => ({ ...e, name: undefined, form: undefined }))
  }

  function handleCodeChange(value: string) {
    const next = value.toUpperCase()
    setCode(next)
    // Emptied by hand: go back to following the name.
    setCodeEdited(next !== '')
    setErrors((e) => ({ ...e, code: undefined, form: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (create.isPending) return

    const name = businessName.trim()
    const next: FormErrors = {}
    if (!name) next.name = 'Enter a business name.'
    else if (name.length > NAME_MAX) {
      next.name = `Use at most ${NAME_MAX} characters.`
    }
    if (!INVITE_CODE_FORMAT.test(code)) {
      next.code = 'Use 4–20 characters: A–Z, 0–9 and "-".'
    }
    setErrors(next)
    if (next.name || next.code) return

    create.mutate({ name, code })
  }

  const nameId = `business-name-${ownerId}`
  const codeId = `business-code-${ownerId}`

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !create.isPending) onCancel()
      }}
      noValidate
      className="flex flex-col gap-3 py-1"
    >
      <p className="m-0 text-sm font-bold">New business for {ownerName}</p>
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex min-w-56 flex-1 flex-col gap-1.5">
          <Label htmlFor={nameId}>Business name</Label>
          <Input
            id={nameId}
            autoFocus
            autoComplete="off"
            maxLength={NAME_MAX}
            value={businessName}
            onChange={(e) => handleNameChange(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
          />
          {errors.name && (
            <span
              id={`${nameId}-error`}
              role="alert"
              className="text-sm text-[#ff8a7e]"
            >
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex w-56 flex-col gap-1.5">
          <Label htmlFor={codeId}>Invite code</Label>
          <Input
            id={codeId}
            autoComplete="off"
            spellCheck={false}
            maxLength={INVITE_CODE_MAX}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? `${codeId}-error` : undefined}
            className="font-mono uppercase"
          />
          {errors.code && (
            <span
              id={`${codeId}-error`}
              role="alert"
              className="text-sm text-[#ff8a7e]"
            >
              {errors.code}
            </span>
          )}
        </div>
        <div className="flex gap-2 pt-6">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Create business'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={create.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
      {errors.form && (
        <p role="alert" className="m-0 text-sm text-[#ff8a7e]">
          {errors.form}
        </p>
      )}
    </form>
  )
}

/** What admin_create_business returns. */
interface CreatedRow {
  business_id?: string | number
  business_name?: string
  invite_code?: string
}

export { UsersList }
