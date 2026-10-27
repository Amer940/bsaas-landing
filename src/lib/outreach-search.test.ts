import { describe, expect, test } from 'vitest'
import {
  guessField,
  ilikeFilter,
  instagramProfileUrl,
  normalizeInstagram,
  normalizePhone,
  profileSearchFilter,
  sameNamePattern,
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

describe('profileSearchFilter', () => {
  test('is null for blank text', () => {
    expect(profileSearchFilter('  ')).toBeNull()
  })

  test('matches every profile name column and email, trimmed', () => {
    expect(profileSearchFilter(' ana ')).toBe(
      [
        'first_name.ilike."%ana%"',
        'last_name.ilike."%ana%"',
        'full_name.ilike."%ana%"',
        'username.ilike."%ana%"',
        'email.ilike."%ana%"',
      ].join(','),
    )
  })

  test('escapes PostgREST syntax and LIKE wildcards', () => {
    const filter = profileSearchFilter('a,b) or (x"%_')
    expect(filter).toContain('first_name.ilike."%a,b) or (x\\"\\\\%\\\\_%"')
    expect(filter?.split('",').length).toBe(5)
  })
})

describe('sameNamePattern', () => {
  // Postgres ~* and JS RegExp agree on everything these patterns use.
  const matches = (name: string, stored: string) =>
    new RegExp(sameNamePattern(name) ?? '(?!)', 'i').test(stored)

  test('ignores case, outer spaces and repeated inner spaces', () => {
    expect(matches(' Ana  Studio ', 'ana studio')).toBe(true)
    expect(matches('ana studio', '  ANA   Studio')).toBe(true)
  })

  test('matches the whole name only', () => {
    expect(matches('Ana', 'Ana Studio')).toBe(false)
    expect(matches('Ana Studio', 'Ana')).toBe(false)
  })

  test('treats regex characters literally', () => {
    expect(sameNamePattern('A.B (1)+')).toBe('^\\s*A\\.B\\s+\\(1\\)\\+\\s*$')
    expect(matches('A.B', 'AxB')).toBe(false)
    expect(matches('Cuts & Co.', 'cuts & co.')).toBe(true)
  })

  test('is null for a blank name', () => {
    expect(sameNamePattern('   ')).toBeNull()
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
