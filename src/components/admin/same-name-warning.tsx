import { useQuery } from '@tanstack/react-query'
import { TriangleAlert } from 'lucide-react'
import { useDebouncedValue } from '#/hooks/use-debounced-value'
import { sameNamePattern } from '#/lib/outreach-search'
import { supabase } from '#/lib/supabase'

const SHOWN = 5

interface NameMatch {
  id: string | number
  name: string | null
  email: string | null
  instagram: string | null
  phone: string | null
}

/**
 * A yellow, non-blocking heads-up when contacts with the same name exist
 * (case and extra spaces ignored), listing them. Adding is still allowed:
 * different shops can share a name.
 */
function SameNameWarning({ name }: { name: string }) {
  const typed = name.trim()
  const debounced = useDebouncedValue(typed, 300)
  const pattern = sameNamePattern(debounced)

  const matches = useQuery({
    // Under 'outreach_contacts' so adding or deleting refreshes it.
    queryKey: ['outreach_contacts', 'same_name', debounced.toLowerCase()],
    queryFn: async (): Promise<{ rows: NameMatch[]; total: number }> => {
      const { data, error, count } = await supabase
        .from('outreach_contacts')
        .select('id, name, email, instagram, phone', { count: 'exact' })
        .filter('name', 'imatch', pattern)
        .order('created_at', { ascending: false })
        .limit(SHOWN)
      if (error) throw error
      return { rows: data, total: count ?? data.length }
    },
    enabled: pattern !== null,
  })

  // Hidden while the name is still changing, so it never describes an old one.
  if (typed !== debounced || !matches.data || matches.data.total === 0) {
    return null
  }

  const { rows, total } = matches.data

  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg bg-[#f5c451]/10 px-4 py-3 text-sm text-[#f5c451]"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="m-0 font-bold">
          A contact with this name already exists - make sure it's not the same
          shop
        </p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-foreground/80">
          {rows.map((row) => (
            <li key={row.id} className="truncate">
              <span className="text-foreground">{row.name}</span>
              {[row.instagram, row.email, row.phone]
                .filter(Boolean)
                .map((value) => ` · ${value}`)
                .join('')}
            </li>
          ))}
          {total > rows.length && (
            <li className="text-foreground/60">
              and {(total - rows.length).toLocaleString('en-GB')} more
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export { SameNameWarning }
