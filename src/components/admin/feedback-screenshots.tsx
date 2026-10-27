import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog } from 'radix-ui'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

const BUCKET = 'feedback-screenshots'
const EXPIRES_IN = 60 * 60 // seconds
const CHUNK = 100

/** Signed URL per object path; null when the object is missing. */
type ScreenshotUrls = Map<string, string | null>

/**
 * Signed URLs for every screenshot on the loaded feedback, in as few
 * requests as possible (one per 100 paths). They last an hour, so they're
 * refreshed after 50 minutes, before anything on screen expires.
 */
function useScreenshotUrls(paths: string[]) {
  const unique = [...new Set(paths)].sort()

  return useQuery({
    queryKey: ['feedback', 'screenshot_urls', unique],
    queryFn: async (): Promise<ScreenshotUrls> => {
      const chunks: string[][] = []
      for (let i = 0; i < unique.length; i += CHUNK) {
        chunks.push(unique.slice(i, i + CHUNK))
      }
      const results = await Promise.all(
        chunks.map(async (chunk) => {
          const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrls(chunk, EXPIRES_IN)
          if (error) throw error
          return data
        }),
      )
      const urls: ScreenshotUrls = new Map(unique.map((path) => [path, null]))
      for (const item of results.flat()) {
        if (item.path && item.signedUrl && !item.error) {
          urls.set(item.path, item.signedUrl)
        }
      }
      return urls
    },
    enabled: unique.length > 0,
    staleTime: 50 * 60 * 1000,
    refetchInterval: 50 * 60 * 1000,
  })
}

interface ScreenshotStripProps {
  paths: string[]
  /** Undefined while the signed URLs are loading. */
  urls: ScreenshotUrls | undefined
}

/** Thumbnails for one feedback entry; a click opens the large preview. */
function ScreenshotStrip({ paths, urls }: ScreenshotStripProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {paths.map((path, index) => (
          <li key={`${path}-${index}`}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`Open screenshot ${index + 1} of ${paths.length}`}
              className="block size-16 overflow-hidden rounded-md bg-white/6 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] transition-opacity outline-none hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground/60"
            >
              <Screenshot url={urls?.get(path)} loading={!urls} size="thumb" />
            </button>
          </li>
        ))}
      </ul>
      <ScreenshotViewer
        paths={paths}
        urls={urls}
        index={open}
        onIndexChange={setOpen}
      />
    </>
  )
}

interface ScreenshotProps {
  /** undefined: not known yet; null: the object is missing. */
  url: string | null | undefined
  loading: boolean
  size: 'thumb' | 'large'
}

/** One image, or a placeholder when it's missing or its link has expired. */
function Screenshot({ url, loading, size }: ScreenshotProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'block animate-pulse bg-white/6',
          size === 'thumb' ? 'size-full' : 'size-64 rounded-md',
        )}
      />
    )
  }

  if (!url || failedUrl === url) {
    return (
      <span
        className={cn(
          'flex flex-col items-center justify-center gap-2 text-center text-muted-foreground',
          size === 'thumb'
            ? 'size-full'
            : 'size-64 max-w-full rounded-md bg-white/6 p-4 text-sm',
        )}
      >
        <ImageOff aria-hidden="true" className="size-5" />
        {size === 'large' ? (
          'This image is missing or its link has expired.'
        ) : (
          <span className="sr-only">Image unavailable</span>
        )}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt=""
      loading={size === 'thumb' ? 'lazy' : undefined}
      onError={() => setFailedUrl(url)}
      className={
        size === 'thumb'
          ? 'size-full object-cover'
          : 'max-h-[80svh] max-w-full rounded-md object-contain'
      }
    />
  )
}

interface ScreenshotViewerProps {
  paths: string[]
  urls: ScreenshotUrls | undefined
  index: number | null
  onIndexChange: (index: number | null) => void
}

/**
 * Large preview over the page. Escape or a click outside the image closes
 * it; the arrow keys (or buttons) step through the entry's screenshots.
 */
function ScreenshotViewer({
  paths,
  urls,
  index,
  onIndexChange,
}: ScreenshotViewerProps) {
  const count = paths.length
  const many = count > 1

  function step(by: number) {
    if (index === null) return
    onIndexChange((index + by + count) % count)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!many) return
    if (event.key === 'ArrowRight') step(1)
    else if (event.key === 'ArrowLeft') step(-1)
    else return
    event.preventDefault()
  }

  const path = index === null ? null : paths[index]
  const controlClass =
    'flex size-10 items-center justify-center rounded-md bg-white/10 text-foreground transition-colors outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-foreground/60'

  return (
    <Dialog.Root
      open={index !== null}
      onOpenChange={(open) => {
        if (!open) onIndexChange(null)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={handleKeyDown}
          // The content fills the screen; a click on its empty area is a
          // click outside the image.
          onClick={(event) => {
            if (event.target === event.currentTarget) onIndexChange(null)
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none md:p-10"
        >
          <Dialog.Title className="sr-only">
            Screenshot {index === null ? '' : index + 1} of {count}
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close"
            className={cn(controlClass, 'absolute top-4 right-4')}
          >
            <X className="size-5" />
          </Dialog.Close>

          {path !== null && (
            <Screenshot
              key={path}
              url={urls?.get(path)}
              loading={!urls}
              size="large"
            />
          )}

          {many && index !== null && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={() => step(-1)}
                className={controlClass}
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="min-w-12 text-center text-sm text-foreground/75 tabular-nums">
                {index + 1} / {count}
              </span>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={() => step(1)}
                className={controlClass}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ScreenshotStrip, useScreenshotUrls }
export type { ScreenshotUrls }
