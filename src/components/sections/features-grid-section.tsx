import { ArrowUpRight } from 'lucide-react'
import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'
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
import { LocalizedLink } from '#/i18n/localized-link'

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
  // Where a card leads: the matching "How it works" step or FAQ answer.
  const links = ['korak-3', 'korak-2', undefined, 'nedolasci', undefined]

  return (
    <section className="mx-auto max-w-300 px-5 pt-10 pb-10 md:pt-17.5 xl:px-0">
      <SectionHeading eyebrow={c.eyebrow} className="mb-8 md:mb-11">
        <RichText text={c.title} />
      </SectionHeading>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]">
        {c.items.map((item, i) => {
          const hash = links[i]
          // Only the title is the link (so its text is the anchor text); its
          // ::after stretches over the card to keep the whole card clickable.
          const title = hash ? (
            <LocalizedLink
              to="/"
              hash={hash}
              className="text-inherit no-underline outline-none after:absolute after:inset-0 after:rounded-[28px] focus-visible:after:ring-2 focus-visible:after:ring-foreground/60"
            >
              {item.title}
            </LocalizedLink>
          ) : (
            item.title
          )

          return (
            <article
              key={item.title}
              className={cn(
                'glass relative flex min-w-0 flex-col gap-5 rounded-[28px] p-5.5 md:p-6.5',
                i === 0 && 'md:row-span-2',
                hash && 'cursor-pointer',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="m-0 text-[1.3125rem] font-bold tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="m-0 mt-1.5 text-[0.9375rem] leading-[1.45] text-foreground/60">
                    {item.description}
                  </p>
                </div>
                {hash && (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/8">
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={2.3}
                    />
                  </span>
                )}
              </div>
              <Reveal className="mt-auto select-none">
                <div aria-hidden="true">{visuals[i]}</div>
              </Reveal>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export { FeaturesGridSection }
