import { useEffect, useState } from 'react'
import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import step1Img from '#/images/landing/step-1.webp'
import step2Img from '#/images/landing/step-2.webp'
import step3Img from '#/images/landing/step-3.webp'

const STEP_IMAGES = [step1Img, step2Img, step3Img]

/** How long each step stays active; keep in sync with the progress bar animation. */
const STEP_DURATION_MS = 8000

const glowClass =
  'pointer-events-none absolute -inset-x-[10%] top-52.5 h-225 rounded-[50%] bg-[radial-gradient(60%_40%_at_50%_10%,rgba(255,255,255,.10),rgba(255,255,255,.03)_60%,transparent)]'

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

  const items = c.items.map((item, i) => ({
    ...item,
    id: String(i + 1).padStart(2, '0'),
    img: STEP_IMAGES[i],
  }))
  const activeItem = items[active]

  return (
    <section
      id="kako-radi"
      className="mx-auto max-w-300 scroll-mt-24 px-5 pt-14 md:pt-27.5 xl:px-0"
    >
      <SectionHeading eyebrow={c.eyebrow}>
        <RichText text={c.title} />
      </SectionHeading>
      <p className="m-0 mt-3.5 max-w-130 text-[1.0625rem] leading-normal text-foreground/65 md:mx-auto md:text-center md:text-lg">
        {c.body}
      </p>

      {/* Mobile */}
      <div className="md:hidden mt-8">
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
        <h3 className="m-0 mt-4 text-xl font-bold tracking-[-0.02em]">
          {activeItem.title}
        </h3>
        <p className="m-0 mt-1.5 text-[0.9375rem] leading-normal text-foreground/60">
          {activeItem.text}
        </p>
        <div className="relative mt-6 h-117.5 overflow-hidden">
          <div className={glowClass} style={{ top: 160 }} />
          {items.map((item, i) => (
            <img
              key={item.id}
              src={item.img}
              alt={item.imageAlt}
              width={304}
              height={658}
              loading="lazy"
              aria-hidden={active !== i}
              className={cn(
                'absolute left-1/2 top-0 w-67.5 max-w-none -translate-x-1/2 transition-opacity duration-500',
                active === i ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
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

        <div className="relative mt-14 h-150 overflow-hidden">
          <div className={glowClass} />
          <div className="absolute inset-0 flex items-start justify-around px-10">
            {items.map((item, i) => {
              const isActive = active === i
              return (
                <img
                  key={item.id}
                  src={item.img}
                  alt={item.imageAlt}
                  width={304}
                  height={658}
                  loading="lazy"
                  className={cn(
                    'h-auto shrink-0 transition-all duration-500 ease-out',
                    isActive
                      ? 'mt-0 w-76 opacity-100'
                      : 'mt-30 w-64.25 opacity-50',
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepsSection
