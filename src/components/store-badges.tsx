import { cn } from '#/lib/utils'
import { APP_STORE_URL, PLAY_STORE_URL } from '#/lib/store-links'
import appStoreBadge from '#/images/badges/app-store.svg'
import googlePlayBadge from '#/images/badges/google-play.png'

// The official badges from Apple and Google, unaltered apart from Google's
// transparent padding being cropped so both line up. Same height, per both
// guidelines; the artwork is English since neither has a current Bosnian one.

interface StoreBadgesProps {
  /** Google Play link; the code pages pass one carrying an install referrer. */
  playHref?: string
  appStore?: boolean
  googlePlay?: boolean
  className?: string
}

const badgeLink =
  'inline-flex rounded-[9px] outline-none transition-opacity duration-300 ease-smooth hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function StoreBadges({
  playHref = PLAY_STORE_URL,
  appStore = true,
  googlePlay = true,
  className,
}: StoreBadgesProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {appStore && (
        <a href={APP_STORE_URL} className={badgeLink}>
          <img
            src={appStoreBadge}
            alt="Download on the App Store"
            width={156}
            height={52}
            className="h-13 w-auto"
          />
        </a>
      )}
      {googlePlay && (
        <a href={playHref} className={badgeLink}>
          <img
            src={googlePlayBadge}
            alt="Get it on Google Play"
            width={175}
            height={52}
            className="h-13 w-auto"
          />
        </a>
      )}
    </div>
  )
}
