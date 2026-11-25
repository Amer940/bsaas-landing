import { describe, expect, test } from 'vitest'
import { phoneCountries, toE164 } from './phone'

describe('toE164', () => {
  test.each([
    ['061 123 456', 'BA', '+38761123456'],
    ['062/345-678', 'BA', '+38762345678'],
    ['033 213 456', 'BA', '+38733213456'],
    ['+385 91 234 5678', 'BA', '+385912345678'],
    ['091 234 5678', 'HR', '+385912345678'],
    ['0151 23456789', 'DE', '+4915123456789'],
  ] as const)('%s (%s) -> %s', (input, country, e164) => {
    expect(toE164(input, country)).toBe(e164)
  })

  test.each([
    ['', 'BA'],
    ['123', 'BA'],
    ['061 123', 'BA'],
    ['061 123 456 789 0', 'BA'],
    ['abc 123 456', 'BA'],
    // Right length, but no Bosnian number starts like this.
    ['035 123 456', 'BA'],
    ['091 234', 'HR'],
  ] as const)('rejects %s (%s)', (input, country) => {
    expect(toE164(input, country)).toBeNull()
  })
})

describe('phoneCountries', () => {
  test('lists Bosnia first and every other country once', () => {
    const { nearby, rest } = phoneCountries('bs')
    expect(nearby[0]).toMatchObject({ code: 'BA', dial: '+387' })
    const codes = [...nearby, ...rest].map((c) => c.code)
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes.length).toBeGreaterThan(200)
  })
})
