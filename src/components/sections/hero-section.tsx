import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { RichText } from '../rich-text'
import { HeroScene } from '../hero-scene'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { LocalizedLink } from '#/i18n/localized-link'
import avatars from '#/images/landing/avatars.webp'

const Hero = () => {
  const { locale, t } = useLocale()
  const c = landingContent[locale].hero

  return (
    <section className="mx-auto grid max-w-300 items-center gap-10 px-5 pt-8 pb-10 md:pt-17.5 lg:grid-cols-[1fr_540px] xl:px-0">
      <div className="flex flex-col gap-5.5">
        <p className="eyebrow m-0">{c.eyebrow}</p>
        <h1 className="m-0 text-[2.75rem] font-bold leading-[1.05] tracking-[-0.035em] md:text-[4.75rem]">
          <RichText text={c.title} />
        </h1>
        <p className="m-0 max-w-117.5 text-[1.0625rem] leading-normal text-foreground/65 md:text-[1.1875rem]">
          {c.body}
        </p>
        <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
          <Button size="lg" asChild>
            <LocalizedLink to="/" hash="prijava">
              {t('nav.cta')}
              <ArrowRight aria-hidden="true" strokeWidth={2.3} />
            </LocalizedLink>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <LocalizedLink to="/" hash="kako-radi">
              {c.howItWorks}
            </LocalizedLink>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2.5 text-sm text-foreground/55 sm:justify-start">
          <img
            src={avatars}
            alt=""
            width={92}
            height={32}
            className="-m-0.5 hidden sm:block"
          />
          {c.note}
        </div>
      </div>

      <HeroScene
        label={c.imageAlt}
        className="mx-auto w-full max-w-[590px] max-lg:translate-x-[6.5%] lg:mr-[-20px] lg:ml-[-30px] lg:w-[590px] lg:max-w-none"
      />
    </section>
  )
}

export default Hero
