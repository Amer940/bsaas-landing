import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ScreenshotStrip,
  useScreenshotUrls,
} from '#/components/admin/feedback-screenshots'
import type { ScreenshotUrls } from '#/components/admin/feedback-screenshots'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

const LIMIT = 500

// Profiles and businesses are embedded whole (`*`) and read defensively
// below, so a renamed or missing name column can't break the query.
const COLUMNS = `
  id, user_id, type, message, contact_allowed, user_role, business_id,
  app_version, app_build, os_name, os_version, device_model, app_language,
  source_route, screenshot_paths, status, created_at, resolved_at,
  profile:profiles(*), business:businesses(*)
`

type Row = Record<string, unknown>

interface Feedback {
  id: string | number
  type: string | null
  message: string | null
  contact_allowed: boolean | null
  user_role: string | null
  app_version: string | null
  app_build: string | null
  os_name: string | null
  os_version: string | null
  device_model: string | null
  app_language: string | null
  source_route: string | null
  screenshot_paths: string[] | null
  status: string | null
  created_at: string
  resolved_at: string | null
  profile: Row | Row[] | null
  business: Row | Row[] | null
}

type StatusFilter = 'all' | 'new' | 'resolved'

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/** An embedded to-one row; PostgREST may hand it over as a one-item list. */
function one(value: Row | Row[] | null): Row | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function text(row: Row | null, key: string): string | null {
  const value = row?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function profileName(profile: Row | null): string | null {
  for (const key of ['full_name', 'name', 'display_name', 'username']) {
    const value = text(profile, key)
    if (value) return value
  }
  const parts = [text(profile, 'first_name'), text(profile, 'last_name')]
  return parts.filter(Boolean).join(' ') || null
}

/** The entry's storage paths in the feedback-screenshots bucket. */
function screenshotPaths(entry: Feedback): string[] {
  return (entry.screenshot_paths ?? []).filter(
    (path) => typeof path === 'string' && path.trim() !== '',
  )
}

function isResolved(entry: Feedback) {
  return entry.status === 'resolved' || entry.resolved_at !== null
}

function matchesStatus(entry: Feedback, filter: StatusFilter) {
  if (filter === 'new') return entry.status === 'new'
  if (filter === 'resolved') return isResolved(entry)
  return true
}

/** "feature_request" -> "Feature request". */
function humanize(value: string) {
  const words = value.replace(/[_-]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

type FeedbackData = { rows: Feedback[]; total: number }

const FEEDBACK_KEY = ['feedback']

function FeedbackList() {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [type, setType] = useState<string>('all')

  const feedback = useQuery({
    queryKey: FEEDBACK_KEY,
    queryFn: async (): Promise<FeedbackData> => {
      const { data, error, count } = await supabase
        .from('feedback')
        .select(COLUMNS, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(LIMIT)
      if (error) throw error
      return { rows: data, total: count ?? data.length }
    },
  })

  // One batch of signed URLs for every screenshot in the loaded feedback.
  const screenshots = useScreenshotUrls(
    feedback.data?.rows.flatMap(screenshotPaths) ?? [],
  )
  // A failed batch shows every image as unavailable rather than loading.
  const screenshotUrls = screenshots.isError ? new Map() : screenshots.data

  if (feedback.isPending) {
    return (
      <p className="m-0 text-sm text-muted-foreground">Loading feedback…</p>
    )
  }

  if (feedback.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="m-0 text-sm text-[#ff8a7e]">
          Couldn't load feedback: {feedback.error.message}
        </p>
        <Button
          variant="outline"
          onClick={() => feedback.refetch()}
          disabled={feedback.isFetching}
        >
          {feedback.isFetching ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    )
  }

  const { rows, total } = feedback.data
  const ofType = (entry: Feedback) => type === 'all' || entry.type === type

  // Each filter's counts follow the other filter, so the numbers add up.
  const byType = rows.filter(ofType)
  const statusOptions = (['all', 'new', 'resolved'] as const).map((value) => ({
    value,
    label: value === 'all' ? 'All' : humanize(value),
    count: byType.filter((entry) => matchesStatus(entry, value)).length,
  }))

  const byStatus = rows.filter((entry) => matchesStatus(entry, status))
  const types = [
    ...new Set(rows.flatMap((entry) => (entry.type ? [entry.type] : []))),
  ].sort()
  if (type !== 'all' && !types.includes(type)) types.push(type)
  const typeOptions = [
    { value: 'all', label: 'All types', count: byStatus.length },
    ...types.map((value) => ({
      value,
      label: humanize(value),
      count: byStatus.filter((entry) => entry.type === value).length,
    })),
  ]

  const shown = byStatus.filter(ofType)
  const filtered = status !== 'all' || type !== 'all'

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="m-0 text-base font-bold">Feedback</h2>
        <p className="m-0 text-sm text-muted-foreground">
          {total.toLocaleString('en-GB')} total
          {rows.length < total &&
            ` · filters cover the newest ${rows.length.toLocaleString('en-GB')}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterGroup
          label="Status"
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
        {types.length > 0 && (
          <FilterGroup
            label="Type"
            options={typeOptions}
            value={type}
            onChange={setType}
          />
        )}
      </div>

      {shown.length === 0 ? (
        <p className="m-0 text-sm text-muted-foreground">
          {filtered ? 'No feedback matches these filters.' : 'No feedback yet.'}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {shown.map((entry) => (
            <li key={entry.id}>
              <FeedbackCard entry={entry} screenshotUrls={screenshotUrls} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

interface FilterGroupProps<T extends string> {
  label: string
  options: Array<{ value: T; label: string; count: number }>
  value: T
  onChange: (value: T) => void
}

/** One-of-many filter buttons with counts, styled like the admin tabs. */
function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-white/6 p-1"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-bold text-foreground/60 transition-colors duration-200 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/60',
              active && 'bg-white/12 text-foreground',
            )}
          >
            {option.label}
            <span className="text-xs font-normal text-foreground/50 tabular-nums">
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FeedbackCard({
  entry,
  screenshotUrls,
}: {
  entry: Feedback
  screenshotUrls: ScreenshotUrls | undefined
}) {
  const paths = screenshotPaths(entry)
  const profile = one(entry.profile)
  const name = profileName(profile)
  const email = text(profile, 'email')
  const business = text(one(entry.business), 'name')
  const created = new Date(entry.created_at)

  const os = [entry.os_name, entry.os_version].filter(Boolean).join(' ')
  const app = entry.app_version
    ? `App ${entry.app_version}${entry.app_build ? ` (${entry.app_build})` : ''}`
    : null
  const details = [
    entry.device_model,
    os,
    app,
    entry.app_language && `Language: ${entry.app_language}`,
    entry.source_route && `From ${entry.source_route}`,
  ].filter(Boolean)

  return (
    <Card className="gap-3 rounded-lg border-none bg-white/[.03] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {entry.type && <Badge>{humanize(entry.type)}</Badge>}
        {entry.status && (
          <Badge
            variant={
              isResolved(entry)
                ? 'success'
                : entry.status === 'new'
                  ? 'info'
                  : 'neutral'
            }
          >
            {humanize(entry.status)}
          </Badge>
        )}
        <time
          dateTime={entry.created_at}
          className="ml-auto text-xs text-muted-foreground tabular-nums"
        >
          {dateFormat.format(created)}
        </time>
      </div>

      {entry.message ? (
        <p className="m-0 text-[0.9375rem] leading-normal break-words whitespace-pre-wrap">
          {entry.message}
        </p>
      ) : (
        <p className="m-0 text-sm text-muted-foreground italic">No message</p>
      )}

      {paths.length > 0 && (
        <ScreenshotStrip paths={paths} urls={screenshotUrls} />
      )}

      <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        <span className="font-bold">{name ?? 'Unknown sender'}</span>
        {email && <span className="text-foreground/75">{email}</span>}
        {entry.contact_allowed !== null && (
          <span className="text-xs text-muted-foreground">
            {entry.contact_allowed ? 'OK to contact' : 'Do not contact'}
          </span>
        )}
        {entry.user_role && (
          <span className="text-foreground/75">
            · {humanize(entry.user_role)}
          </span>
        )}
        {business && <span className="text-foreground/75">· {business}</span>}
      </p>

      {details.length > 0 && (
        <p className="m-0 text-xs text-muted-foreground">
          {details.join(' · ')}
        </p>
      )}
    </Card>
  )
}

export { FeedbackList }
