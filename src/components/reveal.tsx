import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Plays its `.reveal-item` children's entrance (see styles.css) the first
 * time it scrolls into view. Items that are already on screen when the page
 * loads, or under reduced motion, are left as rendered, so nothing that is
 * visible ever disappears to animate back in.
 */
function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'waiting' | 'play'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    const { top, bottom } = el.getBoundingClientRect()
    if (top < window.innerHeight && bottom > 0) return

    setState('waiting')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setState('play')
        observer.disconnect()
      },
      // Wait until it is well onto the screen, not just peeking in at the
      // bottom, so the entrance plays where the visitor is looking.
      { threshold: 0.3, rootMargin: '0px 0px -20% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  )
}

export { Reveal }
