import { Button } from '../ui/button'
import { CalendarAnimation } from '../calendar-animation'
import { RichText } from '../rich-text'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { LocalizedLink } from '#/i18n/localized-link'

const Hero = () => {
  const { locale, t } = useLocale()
  const c = landingContent[locale].hero

  return (
    <div className="md:px-4 px-2">
      <div className="w-full bg-white">
        <div className="site-container site-border ">
          <div className="-mx-2 md:mx-0 flex flex-col md:grid md:grid-cols-2 md:border-b border-t md:border-t-0">
            <div className="bg-[#F7F5F0] gap-4 px-8 py-8 md:py-[160px] flex flex-col items-start justify-start md:border-r ">
              <div className="md:block hidden text-[14px] text-[#000000]/50 font-medium leading-[100%] font-sans">
                {c.eyebrow}
              </div>
              <div className="flex flex-col gap-8 w-full items-center md:items-start">
                <h1 className="text-[36px] text-center md:text-left md:text-[64px] font-medium text-black leading-[100%] font-sans">
                  <RichText text={c.title} />
                </h1>
                <div className="text-[14px] text-muted-foreground font-sans max-w-[400px] leading-[150%] md:text-left text-center">
                  {c.body}
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-2 md:gap-4">
                  <Button variant="default" asChild>
                    <LocalizedLink to="/" hash="prijava">
                      {t('nav.cta')}
                    </LocalizedLink>
                  </Button>
                  <Button variant="outline" asChild>
                    <LocalizedLink to="/" hash="kako-radi">
                      {c.howItWorks}
                    </LocalizedLink>
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:py-12 px-2 pb-8 pt-4 md:px-8 flex items-center">
              <CalendarAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
