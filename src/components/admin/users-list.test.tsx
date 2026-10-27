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

interface RpcResult {
  data: unknown
  error: { message: string } | null
}

interface FakeDb {
  calls: Call[]
  rpcs: Array<{ fn: string; args: Record<string, unknown> }>
  rpcResult: RpcResult
}

// A stand-in for the Supabase client that records each query and returns
// two profiles, one of them owning two businesses.
const db = vi.hoisted(
  (): FakeDb => ({
    calls: [],
    rpcs: [],
    rpcResult: { data: null, error: null },
  }),
)

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

  function rpc(fn: string, args: Record<string, unknown>) {
    db.rpcs.push({ fn, args })
    return Promise.resolve(db.rpcResult)
  }

  return { supabase: { from: chain, rpc } }
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
  db.rpcs = []
  db.rpcResult = {
    data: [
      {
        business_id: 9,
        business_name: 'Marko Cuts',
        invite_code: 'MARKO-CUTS',
      },
    ],
    error: null,
  }
})

afterEach(cleanup)

/** Opens Marko's "Make business" form; returns its name and code inputs. */
async function openMakeBusiness() {
  renderList()
  const marko = (await screen.findByText('Marko M')).closest('tr')!
  fireEvent.click(within(marko).getByRole('button', { name: 'Make business' }))
  return {
    name: screen.getByLabelText('Business name'),
    code: screen.getByLabelText('Invite code'),
    submit: () =>
      fireEvent.click(screen.getByRole('button', { name: 'Create business' })),
  }
}

describe('Make business', () => {
  test('is offered on every row, also to owners', async () => {
    renderList()
    await screen.findByText('Ana Anić')
    expect(
      screen.getAllByRole('button', { name: 'Make business' }),
    ).toHaveLength(2)
  })

  test('the code follows the name until edited by hand', async () => {
    const { name, code } = await openMakeBusiness()
    fireEvent.change(name, { target: { value: 'Brijačnica Đuro' } })
    expect((code as HTMLInputElement).value).toBe('BRIJACNICA-DURO')

    fireEvent.change(code, { target: { value: 'duro1' } })
    fireEvent.change(name, { target: { value: 'Brijačnica Đuro 2' } })
    expect((code as HTMLInputElement).value).toBe('DURO1')
  })

  test('blocks a missing name or a bad code without calling the DB', async () => {
    const { name, code, submit } = await openMakeBusiness()
    submit()
    expect(screen.getByText('Enter a business name.')).toBeTruthy()

    fireEvent.change(name, { target: { value: 'Marko Cuts' } })
    fireEvent.change(code, { target: { value: 'AB' } })
    submit()
    expect(screen.getByText(/Use 4–20 characters/)).toBeTruthy()
    expect(db.rpcs).toHaveLength(0)
  })

  test('creates through the RPC, says what to do next, refreshes the row', async () => {
    const { name, submit } = await openMakeBusiness()
    fireEvent.change(name, { target: { value: '  Marko Cuts ' } })
    const profileQueries = db.calls.filter((c) => c.table === 'profiles').length
    submit()

    const status = await screen.findByRole('status')
    expect(db.rpcs).toEqual([
      {
        fn: 'admin_create_business',
        args: { p_owner_id: 'u2', p_name: 'Marko Cuts', p_code: 'MARKO-CUTS' },
      },
    ])
    expect(status.textContent).toBe(
      'Business Marko Cuts created with code MARKO-CUTS. The user must sign out and sign in again in the app to become the owner.',
    )
    expect(screen.queryByLabelText('Business name')).toBeNull()
    await waitFor(() =>
      expect(db.calls.filter((c) => c.table === 'profiles').length).toBe(
        profileQueries + 1,
      ),
    )
  })

  test('shows the DB error as-is and keeps the form open', async () => {
    db.rpcResult = {
      data: null,
      error: { message: 'Invite code MARKO-CUTS is already taken' },
    }
    const { name, submit } = await openMakeBusiness()
    fireEvent.change(name, { target: { value: 'Marko Cuts' } })
    submit()

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Invite code MARKO-CUTS is already taken',
    )
    expect(screen.getByLabelText('Business name')).toBeTruthy()
  })
})

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
