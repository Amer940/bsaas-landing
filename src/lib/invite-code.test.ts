import { describe, expect, test } from 'vitest'
import { INVITE_CODE_FORMAT, inviteCodeFromName } from './invite-code'

describe('inviteCodeFromName', () => {
  test.each([
    ['Ana Cuts', 'ANA-CUTS'],
    ['Brijačnica Ćiro', 'BRIJACNICA-CIRO'],
    ['Šiša Žuti', 'SISA-ZUTI'],
    ['Đuro đak', 'DURO-DAK'],
    ['BRIJAČNICA ĐURO', 'BRIJACNICA-DURO'],
    ['Café Élan', 'CAFE-ELAN'],
    ['  Cuts & Co.  ', 'CUTS-CO'],
    ['Studio 54', 'STUDIO-54'],
    ['a  -  b', 'A-B'],
  ])('%s -> %s', (name, code) => {
    expect(inviteCodeFromName(name)).toBe(code)
  })

  test('stops at 20 characters without ending on a dash', () => {
    expect(inviteCodeFromName('Barbershop Sarajevo Centar')).toBe(
      'BARBERSHOP-SARAJEVO',
    )
    expect(inviteCodeFromName('x'.repeat(30))).toHaveLength(20)
  })

  test('gives a code the server accepts for ordinary names', () => {
    for (const name of ['Ana Cuts', 'Brijačnica Đuro', 'Studio 54']) {
      expect(INVITE_CODE_FORMAT.test(inviteCodeFromName(name))).toBe(true)
    }
  })

  test('can be too short or empty, which the form then flags', () => {
    expect(inviteCodeFromName('Ana')).toBe('ANA')
    expect(inviteCodeFromName('!!!')).toBe('')
  })
})
