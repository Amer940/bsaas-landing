import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import {
  BookingDemo,
  EarningsDemo,
  RecurringDemo,
  ScheduleDemo,
  TeamDemo,
} from '../feature-demos'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { featureDemos } from '#/content/feature-demos'

function FeaturesGridSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].features
  const demo = featureDemos[locale]

  // Same order as `features.items` in the landing copy.
  const visuals = [
    <ScheduleDemo data={demo.schedule} />,
    <BookingDemo data={demo.booking} />,
    <RecurringDemo data={demo.recurring} />,
    <EarningsDemo data={demo.earnings} />,
    <TeamDemo data={demo.team} />,
  ]

  return (
    <section className="mx-auto max-w-300 px-5 pt-10 pb-10 md:pt-17.5 xl:px-0">
      <SectionHeading eyebrow={c.eyebrow} className="mb-8 md:mb-11">
        <RichText text={c.title} />
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]">
        {c.items.map((item, i) => (
          <article
            key={item.title}
            className={cn(
              'glass flex flex-col gap-5 rounded-[28px] p-5.5 md:p-6.5',
              i === 0 && 'md:row-span-2',
            )}
          >
            <div>
              <h3 className="m-0 text-[1.3125rem] font-bold tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="m-0 mt-1.5 text-[0.9375rem] leading-[1.45] text-foreground/60">
                {item.description}
              </p>
            </div>
            <div aria-hidden="true" className="mt-auto select-none">
              {visuals[i]}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export { FeaturesGridSection }
