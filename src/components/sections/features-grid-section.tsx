import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import scheduleImg from '#/images/landing/feature-schedule.webp'
import bookingImg from '#/images/landing/feature-booking.webp'
import recurringImg from '#/images/landing/feature-recurring.webp'
import analyticsImg from '#/images/landing/feature-analytics.webp'
import teamImg from '#/images/landing/feature-team.webp'

/** Screenshots in the same order as `features.items` in the landing copy. */
const FEATURE_IMAGES = [
  { src: scheduleImg, width: 370, height: 380 },
  { src: bookingImg, width: 333, height: 250 },
  { src: recurringImg, width: 333, height: 174 },
  { src: analyticsImg, width: 333, height: 250 },
  { src: teamImg, width: 333, height: 162 },
]

function FeaturesGridSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].features

  return (
    <section className="mx-auto max-w-300 px-5 pt-10 pb-10 md:pt-17.5 xl:px-0">
      <SectionHeading eyebrow={c.eyebrow} className="mb-8 md:mb-11">
        <RichText text={c.title} />
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr] lg:grid-rows-[330px_330px]">
        {c.items.map((item, i) => {
          const image = FEATURE_IMAGES[i]
          return (
            <article
              key={item.title}
              className={cn(
                'glass flex flex-col overflow-hidden rounded-[28px]',
                i === 0 && 'md:row-span-2',
              )}
            >
              <div className="px-6.5 pt-6.5 pb-4.5">
                <h3 className="m-0 text-[1.3125rem] font-bold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="m-0 mt-1.5 text-[0.9375rem] leading-[1.45] text-foreground/60">
                  {item.description}
                </p>
              </div>
              <div className="px-5.5">
                <img
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className="mx-auto block h-auto w-full"
                  style={{ maxWidth: image.width }}
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export { FeaturesGridSection }
