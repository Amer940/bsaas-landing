import { FAQAccordion } from '../ui/faq-item'
import { RichText } from '../rich-text'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'

export function FAQSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].faq

  return (
    <div id="pitanja" className="md:px-4 px-2 scroll-mt-24">
      <div className="w-full bg-white">
        <div className="site-container site-border py-10 md:py-20">
          <div className="w-full flex-col">
            <div className="flex flex-col items-center text-center mx-auto md:mb-16 mb-8">
              <h2 className="md:text-[50px] text-[36px] leading-[110%] font-medium tracking-[-0.015em]">
                <RichText text={c.title} />
              </h2>
              <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground mt-2 md:mt-5 md:max-w-157 max-w-71">
                {c.body}
              </p>
            </div>
            <FAQAccordion className="w-full" items={c.items} />
          </div>
        </div>
      </div>
    </div>
  )
}
