import { describe, expect, test } from 'vitest'
import {
  addDays,
  longDay,
  minutesLabel,
  monthLabel,
  priceLabel,
  startsAtParts,
  todayIn,
  weekdayShort,
} from './booking-time'

describe('booking-time', () => {
  test('todayIn reads the date at the shop, not here', () => {
    // 23:30 UTC on 24 Nov is already 25 Nov in Sarajevo.
    const now = new Date('2026-11-24T23:30:00Z')
    expect(todayIn('Europe/Sarajevo', now)).toBe('2026-11-25')
    expect(todayIn('UTC', now)).toBe('2026-11-24')
  })

  test('addDays crosses months and years', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-11-25', 60)).toBe('2027-01-24')
  })

  test('minutesLabel', () => {
    expect(minutesLabel(570)).toBe('09:30')
    expect(minutesLabel(0)).toBe('00:00')
    expect(minutesLabel(1005)).toBe('16:45')
  })

  test('startsAtParts shows the shop-local time', () => {
    expect(
      startsAtParts('2026-11-25T08:30:00Z', 'Europe/Sarajevo', 'en').time,
    ).toBe('09:30')
  })

  test('Bosnian names without relying on the browser', () => {
    expect(longDay('2026-11-25', 'bs')).toBe('srijeda, 25. novembar')
    expect(weekdayShort('2026-11-29', 'bs')).toBe('ned')
    expect(monthLabel('2026-12-01', 'bs')).toBe('decembar 2026.')
    expect(
      startsAtParts('2026-11-25T23:30:00Z', 'Europe/Sarajevo', 'bs'),
    ).toEqual({ day: 'četvrtak, 26. novembar 2026.', time: '00:30' })
  })

  test('priceLabel', () => {
    expect(priceLabel(30, 'bs')).toBe('30 KM')
    expect(priceLabel(12.5, 'bs')).toBe('12,50 KM')
    expect(priceLabel(12.5, 'en')).toBe('12.50 KM')
  })
})
