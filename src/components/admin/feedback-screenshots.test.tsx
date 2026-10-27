// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ScreenshotStrip } from './feedback-screenshots'
import type { ScreenshotUrls } from './feedback-screenshots'

// The viewer is handed its URLs, so the client is never called. Mocked so
// the test doesn't need the Supabase env vars (a fresh clone has no .env).
vi.mock('#/lib/supabase', () => ({ supabase: {} }))

afterEach(cleanup)

const paths = ['a.png', 'b.png', 'gone.png']
const urls: ScreenshotUrls = new Map([
  ['a.png', 'https://example.test/a.png?token=1'],
  ['b.png', 'https://example.test/b.png?token=2'],
  ['gone.png', null],
])

function open(index: number) {
  render(<ScreenshotStrip paths={paths} urls={urls} />)
  fireEvent.click(
    screen.getByRole('button', {
      name: `Open screenshot ${index + 1} of ${paths.length}`,
    }),
  )
  return screen.getByRole('dialog')
}

function largeImageSrc(dialog: HTMLElement) {
  return dialog.querySelector('img')?.getAttribute('src') ?? null
}

describe('ScreenshotStrip', () => {
  test('shows a thumbnail per path, with a placeholder for a missing one', () => {
    render(<ScreenshotStrip paths={paths} urls={urls} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByText('Image unavailable')).toBeTruthy()
  })

  test('opens the clicked screenshot large', () => {
    const dialog = open(1)
    expect(largeImageSrc(dialog)).toBe(urls.get('b.png'))
    expect(dialog.textContent).toContain('2 / 3')
  })

  test('arrow keys step through and wrap around', () => {
    const dialog = open(0)
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(dialog.textContent).toContain('3 / 3')
    expect(dialog.textContent).toContain('missing or its link has expired')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(largeImageSrc(dialog)).toBe(urls.get('a.png'))
  })

  test('Escape closes', () => {
    const dialog = open(0)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('a click outside the image closes, a click on it does not', () => {
    const dialog = open(0)
    fireEvent.click(dialog.querySelector('img')!)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    fireEvent.click(dialog)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('an image that fails to load (expired link) becomes a placeholder', () => {
    const dialog = open(0)
    fireEvent.error(dialog.querySelector('img')!)
    expect(dialog.querySelector('img')).toBeNull()
    expect(dialog.textContent).toContain('missing or its link has expired')
  })
})
