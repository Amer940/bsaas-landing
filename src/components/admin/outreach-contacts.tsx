import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { instagramProfileUrl } from '#/lib/outreach-search'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

const LIMIT = 1000

// Listed by hand: the generated email_norm, instagram_norm and phone_norm
// columns are never selected (or written).
const COLUMNS = 'id, name, email, instagram, phone, notes, created_at'

interface OutreachContact {
  id: string | number
  name: string | null
  email: string | null
  instagram: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

/** "27 Oct" in the table; the full date and time on hover. */
const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
})
const fullDate = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function OutreachContacts() {
  const contacts = useQuery({
    queryKey: ['outreach_contacts'],
    queryFn: async (): Promise<{ rows: OutreachContact[]; total: number }> => {
      const { data, error, count } = await supabase
        .from('outreach_contacts')
        .select(COLUMNS, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(LIMIT)
      if (error) throw error
      return { rows: data, total: count ?? data.length }
    },
  })

  if (contacts.isPending) {
    return (
      <p className="m-0 text-sm text-muted-foreground">Loading contacts…</p>
    )
  }

  if (contacts.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="m-0 text-sm text-[#ff8a7e]">
          Couldn't load contacts: {contacts.error.message}
        </p>
        <Button
          variant="outline"
          onClick={() => contacts.refetch()}
          disabled={contacts.isFetching}
        >
          {contacts.isFetching ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    )
  }

  const { rows, total } = contacts.data

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="m-0 text-base font-bold">Contacts</h2>
        <p className="m-0 text-sm text-muted-foreground">
          {total.toLocaleString('en-GB')} total
          {rows.length < total &&
            ` · showing the newest ${rows.length.toLocaleString('en-GB')}`}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="m-0 text-sm text-muted-foreground">No contacts yet.</p>
      ) : (
        <div className="rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
          {/* Fixed widths so long values are cut off rather than widening
              the table. Narrow screens still scroll sideways. */}
          <Table className="min-w-2xl table-fixed">
            <colgroup>
              <col className="w-[17%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[13%]" />
              <col />
              <col className="w-20" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Instagram</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}

/** A cell that cuts a long value off with "…" and shows all of it on hover. */
function TruncatedCell({
  value,
  className,
  children,
}: {
  value: string | null
  className?: string
  children?: ReactNode
}) {
  return (
    <TableCell title={value ?? undefined} className={cn('truncate', className)}>
      {children ?? value}
    </TableCell>
  )
}

function ContactRow({ contact }: { contact: OutreachContact }) {
  const igUrl = contact.instagram
    ? instagramProfileUrl(contact.instagram)
    : null
  const added = new Date(contact.created_at)

  return (
    <TableRow>
      <TruncatedCell value={contact.name} />
      <TruncatedCell value={contact.instagram}>
        {igUrl && (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2 hover:text-foreground/75"
          >
            {contact.instagram}
          </a>
        )}
      </TruncatedCell>
      <TruncatedCell value={contact.email} />
      <TruncatedCell value={contact.phone} className="tabular-nums" />
      <TruncatedCell value={contact.notes} />
      <TableCell
        title={fullDate.format(added)}
        className="text-muted-foreground tabular-nums"
      >
        {shortDate.format(added)}
      </TableCell>
    </TableRow>
  )
}

export { OutreachContacts }
