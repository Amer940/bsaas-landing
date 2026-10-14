import { useEffect, useRef } from 'react'
import { useLocation } from '@tanstack/react-router'

/**
 * Calls `onHash` with the URL hash on load, whenever it changes, and when a
 * link to the hash the URL already has is followed again (the router ignores
 * those, so this also scrolls to the target).
 */
export function useHashTarget(onHash: (hash: string) => void) {
  const hash = useLocation({ select: (l) => l.hash })
  const onHashRef = useRef(onHash)
  onHashRef.current = onHash

  useEffect(() => {
    if (hash) onHashRef.current(hash)
  }, [hash])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest('a')
      if (
        !link?.hash ||
        link.hash !== window.location.hash ||
        link.pathname !== window.location.pathname
      )
        return
      const target = link.hash.slice(1)
      onHashRef.current(target)
      document.getElementById(target)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
