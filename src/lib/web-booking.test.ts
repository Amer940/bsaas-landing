// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  BookingError,
  DEVICE_TOKEN_DAYS,
  forgetDevice,
  hintOf,
  rememberDevice,
  rememberedDevice,
  sendCode,
  toHint,
} from './web-booking'
import type { BookingRequest } from './web-booking'

const invoke = vi.fn()
vi.mock('./supabase', () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => invoke(...args) } },
}))

const booking: BookingRequest = {
  code: 'BASCARSIJA',
  employee_id: 'e',
  service_id: 's',
  date: '2026-11-26',
  minutes: 600,
  first_name: 'Amra',
  last_name: 'Hodžić',
  email: 'amra@example.com',
  phone: '+38761123456',
  locale: 'bs',
}

afterEach(() => {
  invoke.mockReset()
  localStorage.clear()
})

describe('hints', () => {
  test('unknown hints and raw server text become failed', () => {
    expect(toHint('slot_taken')).toBe('slot_taken')
    expect(toHint('duplicate key value violates…')).toBe('failed')
    expect(toHint(undefined)).toBe('failed')
    expect(hintOf(new Error('boom'))).toBe('failed')
    expect(hintOf(new BookingError('code_wrong'))).toBe('code_wrong')
  })
})

describe('web-booking function', () => {
  test('returns the success body', async () => {
    invoke.mockResolvedValue({
      data: { ok: true, resend_after_seconds: 60 },
      error: null,
    })
    await expect(sendCode(booking, 't')).resolves.toMatchObject({
      resend_after_seconds: 60,
    })
    expect(invoke).toHaveBeenCalledWith('web-booking', {
      body: { action: 'send_code', booking, turnstile_token: 't' },
    })
  })

  test('reads the hint of an ok: false body', async () => {
    invoke.mockResolvedValue({
      data: { ok: false, error: 'too_many_codes' },
      error: null,
    })
    await expect(sendCode(booking, 't')).rejects.toMatchObject({
      hint: 'too_many_codes',
    })
  })

  test('reads the hint from an error status response', async () => {
    invoke.mockResolvedValue({
      data: null,
      error: {
        context: new Response(
          JSON.stringify({ ok: false, error: 'slot_taken' }),
          { status: 409 },
        ),
      },
    })
    await expect(sendCode(booking, 't')).rejects.toMatchObject({
      hint: 'slot_taken',
    })
  })

  test('resend_too_soon carries the wait', async () => {
    invoke.mockResolvedValue({
      data: null,
      error: {
        context: new Response(
          JSON.stringify({
            ok: false,
            error: 'resend_too_soon',
            resend_after_seconds: 42,
          }),
          { status: 429 },
        ),
      },
    })
    await expect(sendCode(booking, 't')).rejects.toMatchObject({
      hint: 'resend_too_soon',
      resendAfterSeconds: 42,
    })
  })

  test('device_token_invalid is its own hint', () => {
    expect(toHint('device_token_invalid')).toBe('device_token_invalid')
  })

  test('a network failure is failed', async () => {
    invoke.mockResolvedValue({ data: null, error: new Error('offline') })
    await expect(sendCode(booking, 't')).rejects.toMatchObject({
      hint: 'failed',
    })
  })
})

describe('remembered device', () => {
  test('is kept per email, case and spaces aside', () => {
    rememberDevice('Amra@Example.com ', 'tok')
    expect(rememberedDevice('amra@example.com')).toBe('tok')
    expect(rememberedDevice('other@example.com')).toBeNull()
    forgetDevice('AMRA@example.com')
    expect(rememberedDevice('amra@example.com')).toBeNull()
  })

  test('expires after 90 days', () => {
    const now = Date.now()
    rememberDevice('a@b.co', 'tok', now)
    const day = 24 * 60 * 60 * 1000
    expect(
      rememberedDevice('a@b.co', now + (DEVICE_TOKEN_DAYS - 1) * day),
    ).toBe('tok')
    expect(
      rememberedDevice('a@b.co', now + (DEVICE_TOKEN_DAYS + 1) * day),
    ).toBeNull()
  })

  test('survives storage being unavailable', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('denied')
      })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(() => rememberDevice('a@b.co', 'tok')).not.toThrow()
    expect(rememberedDevice('a@b.co')).toBeNull()
    spy.mockRestore()
    vi.restoreAllMocks()
  })
})
