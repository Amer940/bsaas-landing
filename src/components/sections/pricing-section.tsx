import { ArrowRight, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { LocalizedLink } from '#/i18n/localized-link'

function PricingSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].pricing

  return (
    <section
      id="cijena"
      className="mx-auto max-w-300 scroll-mt-24 px-5 pt-14 pb-10 md:pt-27.5 xl:px-0"
    >
      <SectionHeading eyebrow={c.eyebrow} className="mb-6 md:mb-12">
        <RichText text={c.title} />
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-[30px] p-6 md:p-8.5">
          <p className="eyebrow m-0">{c.plan}</p>
          <p className="m-0 mt-2.5 flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-[4.5rem] leading-none font-extrabold tracking-[-0.045em] tabular-nums md:text-8xl">
              {c.price}
            </span>
            <span className="text-[0.9375rem] text-foreground/60">
              {c.period}
            </span>
          </p>
          <p className="m-0 mt-3.5 max-w-90 text-[0.9375rem] leading-normal text-foreground/65">
            {c.description}
          </p>
          <div className="mt-6 flex flex-col gap-3.5 md:flex-row md:flex-wrap md:items-center">
            <Button size="lg" asChild>
              <LocalizedLink to="/" hash="prijava">
                {c.cta}
                <ArrowRight aria-hidden="true" strokeWidth={2.3} />
              </LocalizedLink>
            </Button>
            <span className="text-sm text-foreground/55">{c.note}</span>
          </div>
        </div>

        <div className="glass rounded-[30px] px-5 py-6 md:px-7.5">
          <p className="eyebrow m-0">{c.includedLabel}</p>
          <ul className="m-0 mt-2 list-none p-0">
            {c.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 border-border py-3.5 font-semibold not-first:border-t"
              >
                <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={3}
                  />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { PricingSection }
