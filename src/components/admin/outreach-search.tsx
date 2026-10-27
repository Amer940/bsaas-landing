import { Search } from 'lucide-react'
import { useOutreachContacts } from '#/components/admin/outreach-contacts'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

interface OutreachSearchProps {
  /** What's in the box right now. */
  value: string
  onChange: (value: string) => void
  /** `value`, trimmed and debounced: what the table is filtered by. */
  search: string
  /** Called with the search text when there's no match. */
  onUseText: (text: string) => void
}

/** The search box that answers "is this person already in the list?". */
function OutreachSearch({
  value,
  onChange,
  search,
  onUseText,
}: OutreachSearchProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
      <div className="relative md:flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-foreground/45"
        />
        <Input
          type="search"
          aria-label="Search contacts"
          placeholder="Search name, email, Instagram or phone"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-15 pl-13 text-lg md:text-xl"
        />
      </div>
      <div
        aria-live="polite"
        className="flex min-h-11 flex-wrap items-center gap-3 md:min-w-80"
      >
        {search && (
          <SearchStatus
            search={search}
            settled={value.trim() === search}
            onUseText={() => onUseText(search)}
          />
        )}
      </div>
    </div>
  )
}

interface SearchStatusProps {
  search: string
  /** False while the box holds text the table hasn't been filtered by yet. */
  settled: boolean
  onUseText: () => void
}

function SearchStatus({ search, settled, onUseText }: SearchStatusProps) {
  const contacts = useOutreachContacts(search)

  if (!settled || contacts.isPending || contacts.isPlaceholderData) {
    return <p className="m-0 text-sm text-muted-foreground">Checking…</p>
  }

  if (contacts.isError) {
    return <p className="m-0 text-sm text-muted-foreground">Couldn't check.</p>
  }

  const { total } = contacts.data

  if (total > 0) {
    return (
      <StatusPill tone="taken">
        Already in the list ({total.toLocaleString('en-GB')})
      </StatusPill>
    )
  }

  return (
    <>
      <StatusPill tone="free">Not in the list - safe to contact</StatusPill>
      <Button variant="outline" onClick={onUseText}>
        Use search text
      </Button>
    </>
  )
}

function StatusPill({
  tone,
  children,
}: {
  tone: 'taken' | 'free'
  children: string | Array<string>
}) {
  const color =
    tone === 'taken'
      ? 'bg-[#ff8a7e]/12 text-[#ff8a7e]'
      : 'bg-[#6fdc9a]/12 text-[#6fdc9a]'

  return (
    <p
      className={`m-0 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${color}`}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {children}
    </p>
  )
}

export { OutreachSearch }
