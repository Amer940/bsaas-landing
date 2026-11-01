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
import { PrivacyRequestsList } from './privacy-requests-list'

// A stand-in for the Supabase client: the rows, and an update each test decides.
interface FakeDb {
  rows: Array<Record<string, unknown>>
  updates: Array<{ values: Record<string, unknown>; id: unknown }>
  updateResult: {
    data: unknown[] | null
    error: { message: string } | null
  }
}

const db = vi.hoisted(
  (): FakeDb => ({
    rows: [],
    updates: [],
    updateResult: { data: [{ id: 'a' }], error: null },
  }),
)

vi.mock('#/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () =>
            Promise.resolve({
              data: db.rows.map((row) => ({ ...row })),
              error: null,
            }),
        }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: (_column: string, id: unknown) => ({
          select: () => {
            db.updates.push({ values, id })
            if (!db.updateResult.error) {
              Object.assign(db.rows.find((row) => row.id === id) ?? {}, values)
            }
            return Promise.resolve(db.updateResult)
          },
        }),
      }),
    }),
  },
}))

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <PrivacyRequestsList />
    </QueryClientProvider>,
  )
}

function request(overrides: Record<string, unknown> = {}) {
  return {
    id: 'a',
    user_id: 'u1',
    kind: 'object',
    message: 'Please stop using my data',
    status: 'open',
    created_at: new Date().toISOString(),
    resolved_at: null,
    profile: { full_name: 'Amra K', email: 'amra@example.com' },
    ...overrides,
  }
}

beforeEach(() => {
  db.rows = []
  db.updates = []
  db.updateResult = { data: [{ id: 'a' }], error: null }
})

afterEach(cleanup)

describe('PrivacyRequestsList', () => {
  test('shows the request, who sent it and the deadline', async () => {
    db.rows = [request()]
    renderList()

    expect(await screen.findByText('Please stop using my data')).toBeTruthy()
    expect(screen.getByText('Objection to processing (Art. 21)')).toBeTruthy()
    expect(screen.getByText('Amra K')).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: 'amra@example.com' })
        .getAttribute('href'),
    ).toBe('mailto:amra@example.com')
    expect(screen.getByText(/^Answer by /)).toBeTruthy()
  })

  test('flags an open request past its deadline, not a resolved one', async () => {
    db.rows = [
      request({ created_at: '2020-01-01T10:00:00Z' }),
      request({
        id: 'b',
        created_at: '2020-02-01T10:00:00Z',
        status: 'resolved',
        resolved_at: '2020-02-02T10:00:00Z',
      }),
    ]
    renderList()

    expect(await screen.findAllByText(/^Overdue/)).toHaveLength(1)
    expect(screen.getByText(/^Resolved 2 Feb 2020/)).toBeTruthy()
  })

  test('says when the account is gone', async () => {
    db.rows = [
      request({
        user_id: null,
        profile: null,
        message: 'Obrisano zajedno s nalogom.',
      }),
    ]
    renderList()

    expect(await screen.findByText('Account deleted')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  test('marks one resolved, changing only its status columns', async () => {
    db.rows = [request()]
    renderList()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Mark resolved' }),
    )

    await waitFor(() => expect(db.updates).toHaveLength(1))
    expect(db.updates[0].id).toBe('a')
    expect(Object.keys(db.updates[0].values).sort()).toEqual([
      'resolved_at',
      'status',
    ])
    expect(db.updates[0].values.status).toBe('resolved')
    expect(await screen.findByRole('button', { name: 'Reopen' })).toBeTruthy()
  })

  test('says so when the database changed nothing', async () => {
    db.rows = [request()]
    db.updateResult = { data: [], error: null }
    renderList()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Mark resolved' }),
    )

    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(screen.getByText(/Nothing was updated/)).toBeTruthy()
  })
})
