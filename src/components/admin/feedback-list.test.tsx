// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FeedbackList } from './feedback-list'

// A stand-in for the Supabase client: one feedback row, and an update
// whose result each test decides.
interface FakeDb {
  row: Record<string, unknown>
  selects: number
  updates: Array<{ values: Record<string, unknown>; id: unknown }>
  updateResult: {
    data: unknown[] | null
    error: { message: string } | null
  }
  signedUrlCalls: number
}

const db = vi.hoisted(
  (): FakeDb => ({
    row: {},
    selects: 0,
    updates: [],
    updateResult: { data: [{ id: 1 }], error: null },
    signedUrlCalls: 0,
  }),
)

vi.mock('#/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => {
            db.selects += 1
            return Promise.resolve({
              data: [{ ...db.row }],
              error: null,
              count: 1,
            })
          },
        }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: (_column: string, id: unknown) => ({
          select: () => {
            db.updates.push({ values, id })
            if (!db.updateResult.error) Object.assign(db.row, values)
            return new Promise((resolve) =>
              setTimeout(() => resolve(db.updateResult), 20),
            )
          },
        }),
      }),
    }),
    storage: {
      from: () => ({
        createSignedUrls: (paths: string[]) => {
          db.signedUrlCalls += 1
          return Promise.resolve({
            data: paths.map((path) => ({
              path,
              signedUrl: `https://x/${path}`,
              error: null,
            })),
            error: null,
          })
        },
      }),
    },
  },
}))

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <FeedbackList />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  db.row = {
    id: 1,
    type: 'bug',
    message: 'The calendar crashes',
    status: 'new',
    resolved_at: null,
    created_at: '2026-10-27T10:00:00Z',
    screenshot_paths: ['a.png'],
    profile: null,
    business: null,
  }
  db.selects = 0
  db.updates = []
  db.updateResult = { data: [{ id: 1 }], error: null }
  db.signedUrlCalls = 0
})

afterEach(cleanup)

describe('Mark resolved / Reopen', () => {
  test('sends only status and resolved_at, flips at once, then refetches the list', async () => {
    renderList()
    fireEvent.click(
      await screen.findByRole('button', { name: /mark resolved/i }),
    )

    // Optimistic: flipped while the update is still pending (disabled).
    const reopen = await screen.findByRole('button', { name: /reopen/i })
    expect(reopen.hasAttribute('disabled')).toBe(true)
    await waitFor(() => expect(db.updates).toHaveLength(1))
    expect(Object.keys(db.updates[0].values).sort()).toEqual([
      'resolved_at',
      'status',
    ])
    expect(db.updates[0].values.status).toBe('resolved')
    expect(typeof db.updates[0].values.resolved_at).toBe('string')
    expect(db.updates[0].id).toBe(1)

    await waitFor(() => expect(db.selects).toBe(2))
    expect(db.signedUrlCalls).toBe(1) // screenshot links weren't refetched
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: /reopen/i })
          .hasAttribute('disabled'),
      ).toBe(false),
    )
  })

  test('Reopen sets status new and clears resolved_at', async () => {
    db.row.status = 'resolved'
    db.row.resolved_at = '2026-10-27T11:00:00Z'
    renderList()
    fireEvent.click(await screen.findByRole('button', { name: /reopen/i }))
    expect(
      await screen.findByRole('button', { name: /mark resolved/i }),
    ).toBeTruthy()
    await waitFor(() => expect(db.updates).toHaveLength(1))
    expect(db.updates[0].values).toEqual({ status: 'new', resolved_at: null })
  })

  test('goes back and shows the error when the DB rejects it', async () => {
    db.updateResult = { data: null, error: { message: 'permission denied' } }
    renderList()
    fireEvent.click(
      await screen.findByRole('button', { name: /mark resolved/i }),
    )
    expect(await screen.findByRole('button', { name: /reopen/i })).toBeTruthy()

    expect((await screen.findByRole('alert')).textContent).toContain(
      'permission denied',
    )
    expect(screen.getByRole('button', { name: /mark resolved/i })).toBeTruthy()
  })

  test('treats a silently skipped update (0 rows) as an error', async () => {
    db.updateResult = { data: [], error: null }
    renderList()
    fireEvent.click(
      await screen.findByRole('button', { name: /mark resolved/i }),
    )
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Nothing was updated',
    )
  })
})
