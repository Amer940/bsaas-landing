import { useEffect, useState } from 'react'
import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { CodeScreen, NewBookingScreen, SettingsScreen } from '../step-demos'
import { featureDemos, stepDemos } from '#/content/feature-demos'

/** How long each step stays active; keep in sync with the progress bar animation. */
const STEP_DURATION_MS = 8000

const glowClass =
  'pointer-events-none absolute -inset-x-[10%] top-24 bottom-0 rounded-[50%] bg-[radial-gradient(60%_50%_at_50%_20%,rgba(255,255,255,.09),rgba(255,255,255,.02)_60%,transparent)]'

const StepsSection = () => {
  const { locale } = useLocale()
  const c = landingContent[locale].steps
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % c.items.length),
      STEP_DURATION_MS,
    )
    return () => clearTimeout(timer)
  }, [active, c.items.length])

  const screens = stepDemos[locale]
  // Same order as `steps.items` in the landing copy.
  const visuals = [
    <SettingsScreen data={screens.settings} />,
    <CodeScreen data={screens.code} />,
    <NewBookingScreen
      data={screens.booking}
      schedule={featureDemos[locale].schedule}
    />,
  ]

  const items = c.items.map((item, i) => ({
    ...item,
    id: String(i + 1).padStart(2, '0'),
    visual: visuals[i],
  }))
  const activeItem = items[active]

  return (
    <section
      id="kako-radi"
      className="mx-auto max-w-300 scroll-mt-24 px-5 pt-14 pb-6 md:pt-27.5 md:pb-10 xl:px-0"
    >
      <SectionHeading eyebrow={c.eyebrow}>
        <RichText text={c.title} />
      </SectionHeading>
      <p className="m-0 mt-3.5 max-w-130 text-[1.0625rem] leading-normal text-foreground/65 md:mx-auto md:text-center md:text-lg">
        {c.body}
      </p>

      {/* Mobile */}
      <div className="mx-auto mt-8 max-w-md lg:hidden">
        <div className="grid grid-cols-3 rounded-full bg-white/8 p-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={cn(
                'h-10 rounded-full text-[0.9375rem] font-bold tabular-nums transition-colors duration-300',
                active === i
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60',
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
        <h3 className="m-0 mt-4 text-xl font-bold tracking-[-0.02em] md:text-center">
          {activeItem.title}
        </h3>
        <p className="m-0 mt-1.5 text-[0.9375rem] leading-normal text-foreground/60 md:text-center">
          {activeItem.text}
        </p>
        <div aria-hidden="true" className="relative mt-6 grid select-none">
          <div className={glowClass} />
          {items.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                'relative col-start-1 row-start-1 mx-auto w-full max-w-80 transition-opacity duration-500',
                active === i ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              {item.visual}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mt-14 flex items-start gap-10">
          {items.map((item, i) => {
            const isActive = active === i
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="flex flex-1 flex-col gap-3 text-left"
              >
                <span className="relative block h-0.5 w-full overflow-hidden bg-white/10">
                  {isActive && (
                    <span
                      key={active}
                      className="absolute inset-y-0 left-0 bg-foreground animate-[progress-fill_8s_linear_forwards] motion-reduce:w-full motion-reduce:animate-none"
                    />
                  )}
                </span>
                <span
                  className={cn(
                    'text-[0.8125rem] font-extrabold tabular-nums transition-opacity duration-500',
                    !isActive && 'opacity-45',
                  )}
                >
                  {item.id}
                </span>
                <span
                  className={cn(
                    'text-[1.375rem] font-bold tracking-[-0.02em] transition-opacity duration-500',
                    !isActive && 'opacity-55',
                  )}
                >
                  {item.title}
                </span>
                <span
                  className={cn(
                    'text-[0.9375rem] leading-normal transition-opacity duration-500',
                    isActive ? 'opacity-60' : 'opacity-40',
                  )}
                >
                  {item.text}
                </span>
              </button>
            )
          })}
        </div>

        <div
          aria-hidden="true"
          className="relative mt-12 grid select-none grid-cols-3 items-start gap-10"
        >
          <div className={glowClass} />
          {items.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                'relative mx-auto w-full max-w-80 transition-all duration-500 ease-out',
                active === i
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 scale-[.96] opacity-40',
              )}
            >
              {item.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StepsSection
