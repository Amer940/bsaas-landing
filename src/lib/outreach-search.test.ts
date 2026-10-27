import { describe, expect, test } from 'vitest'
import { instagramProfileUrl, normalizeInstagram } from './outreach-search'

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
