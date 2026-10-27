// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UsersList } from './users-list'

interface Call {
  table: string
  or?: string
  in?: unknown[]
  limit?: number
}

interface FakeDb {
  calls: Call[]
}

// A stand-in for the Supabase client that records each query and returns
// two profiles, one of them owning two businesses.
const db = vi.hoisted((): FakeDb => ({ calls: [] }))

vi.mock('#/lib/supabase', () => {
  const profiles = [
    {
      id: 'u1',
      first_name: 'Ana',
      last_name: 'Anić',
      full_name: null,
      username: 'ana',
      email: 'ana@example.com',
      phone: '+38761000000',
      created_at: '2026-10-01T10:00:00Z',
    },
    {
      id: 'u2',
      first_name: null,
      last_name: null,
      full_name: 'Marko M',
      username: 'marko',
      email: 'marko@example.com',
      phone: null,
      created_at: '2026-09-01T10:00:00Z',
    },
  ]
  const businesses = [
    { id: 1, owner_id: 'u1', name: 'Ana Cuts', referral_code: 'ANA123' },
    { id: 2, owner_id: 'u1', name: 'Ana Studio', referral_code: null },
  ]

  function chain(table: string) {
    const call: Call = { table }
    db.calls.push(call)
    const result =
      table === 'profiles'
        ? { data: profiles, error: null, count: 2 }
        : { data: businesses, error: null }
    const builder = {
      select: () => builder,
      or: (filter: string) => ((call.or = filter), builder),
      in: (_column: string, values: unknown[]) => ((call.in = values), builder),
      order: () => builder,
      limit: (n: number) => ((call.limit = n), builder),
      then: (resolve: (value: typeof result) => unknown) => resolve(result),
    }
    return builder
  }

  return { supabase: { from: chain } }
})

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <UsersList />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  db.calls = []
})

afterEach(cleanup)

describe('UsersList', () => {
  test('shows the newest 50 without a filter, with owned businesses', async () => {
    renderList()
    const ana = (await screen.findByText('Ana Anić')).closest('tr')!

    const profileCall = db.calls.find((call) => call.table === 'profiles')
    expect(profileCall?.or).toBeUndefined()
    expect(profileCall?.limit).toBe(50)
    expect(db.calls.find((call) => call.table === 'businesses')?.in).toEqual([
      'u1',
      'u2',
    ])

    expect(within(ana).getByText('Ana Cuts')).toBeTruthy()
    expect(within(ana).getByText('ANA123')).toBeTruthy()
    expect(within(ana).getByText('Ana Studio')).toBeTruthy()

    const marko = screen.getByText('Marko M').closest('tr')!
    expect(within(marko).getByText('No business')).toBeTruthy()
  })

  test('searching sends an escaped .or() filter after the debounce', async () => {
    renderList()
    await screen.findByText('Ana Anić')
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search users' }), {
      target: { value: ' an,a ' },
    })

    await waitFor(() =>
      expect(db.calls.some((call) => call.or !== undefined)).toBe(true),
    )
    const filter = db.calls.find((call) => call.or)?.or
    expect(filter).toContain('first_name.ilike."%an,a%"')
    expect(filter).toContain('email.ilike."%an,a%"')
  })
})
