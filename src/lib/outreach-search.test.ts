import { describe, expect, test } from 'vitest'
import {
  guessField,
  ilikeFilter,
  instagramProfileUrl,
  normalizeInstagram,
  normalizePhone,
  searchFilter,
} from './outreach-search'

describe('normalizeInstagram', () => {
  test.each([
    ['@Chairo.App', 'chairo.app'],
    ['https://www.instagram.com/chairo.app/', 'chairo.app'],
    ['https://instagram.com/Chairo?igsh=abc', 'chairo'],
    ['instagram.com/@chairo/reels', 'chairo'],
    ['chairo_app', 'chairo_app'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizeInstagram(input)).toBe(expected)
  })
})

describe('instagramProfileUrl', () => {
  test.each([
    ['@Chairo.App', 'https://instagram.com/chairo.app'],
    ['https://www.instagram.com/chairo/?hl=en', 'https://instagram.com/chairo'],
    ['instagram.com/chairo_app', 'https://instagram.com/chairo_app'],
  ])('%s -> %s', (input, expected) => {
    expect(instagramProfileUrl(input)).toBe(expected)
  })

  test.each([
    'javascript:alert(1)',
    'https://evil.com/x',
    'http://instagram.com.evil.com/x',
    'data:text/html,<script>alert(1)</script>',
    '.',
    '..',
    'a..b',
    '.hidden',
    'trailing.',
    'two words',
    'a'.repeat(31),
    '',
  ])('rejects %s', (input) => {
    expect(instagramProfileUrl(input)).toBeNull()
  })
})

test('normalizePhone keeps digits only', () => {
  expect(normalizePhone('+387 (61) 123-456')).toBe('38761123456')
})

describe('ilikeFilter', () => {
  test('quotes the value so PostgREST syntax stays literal', () => {
    expect(ilikeFilter('name', 'a,b.c:(d)')).toBe('name.ilike."%a,b.c:(d)%"')
  })

  test('escapes quotes and backslashes', () => {
    expect(ilikeFilter('name', 'say "hi"')).toBe('name.ilike."%say \\"hi\\"%"')
    expect(ilikeFilter('name', 'a\\b')).toBe('name.ilike."%a\\\\\\\\b%"')
  })

  test('makes LIKE wildcards literal', () => {
    expect(ilikeFilter('name', '50%_off*')).toBe(
      'name.ilike."%50\\\\%\\\\_off_%"',
    )
  })
})

describe('searchFilter', () => {
  test('is null for blank text', () => {
    expect(searchFilter('   ')).toBeNull()
  })

  test('matches phone_norm only when there are no letters', () => {
    expect(searchFilter('+387 61')).toContain('phone_norm.ilike."%38761%"')
    expect(searchFilter('john 2')).not.toContain('phone_norm')
  })

  test('skips *_norm columns whose normalized text is empty', () => {
    const filter = searchFilter('@')
    expect(filter).not.toContain('instagram_norm')
    expect(filter).not.toContain('phone_norm')
  })

  test('matches the normalized instagram handle', () => {
    expect(searchFilter('https://www.instagram.com/Chairo/?hl=en')).toContain(
      'instagram_norm.ilike."%chairo%"',
    )
  })
})

describe('guessField', () => {
  test.each([
    ['ana@example.com', 'email'],
    ['@chairo', 'instagram'],
    ['https://instagram.com/chairo', 'instagram'],
    ['+387 61 123 456', 'phone'],
    ['061/123-456', 'phone'],
    ['Ana Anić', 'name'],
    ['Studio 54', 'name'],
  ])('%s -> %s', (input, expected) => {
    expect(guessField(input)).toBe(expected)
  })
})
