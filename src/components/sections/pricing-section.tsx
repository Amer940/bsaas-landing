import { Button } from '../ui/button'
import arrowSvg from '../../images/arrow-svg.svg'
import FeatureItem from '../ui/pricing-feature-label'
import { RichText } from '../rich-text'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'

function PricingSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].pricing

  return (
    <div id="kupi" className="w-full md:px-4 px-2 scroll-mt-24">
      <div className="site-container site-border border md:py-20 flex flex-col md:gap-24 gap-8 py-10">
        <div className="flex w-full flex-col md:items-center md:text-center text-left mx-auto md:px-0 px-2">
          <h2 className="md:text-[50px] max-w-157 text-[36px] tracking-[-0.015em] leading-[110%] font-medium ">
            <RichText text={c.title} />
          </h2>
          <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground mt-5 md:max-w-157">
            {c.body}
          </p>
        </div>
        <div className="max-w-253.75 xl:px-0 md:px-6 px-2 items-center justify-between w-full flex  mx-auto">
          <div className="flex min-w-full md:flex-row flex-col md:gap-0 gap-8 ">
            <div className="flex md:w-auto w-full">
              <div className="flex flex-col gap-8 md:pr-20 pr-0 md:w-auto w-full">
                <div className="flex flex-col md:gap-8 gap-4">
                  <div className="flex flex-col gap-6 ">
                    <p className="md:text-14-medium text-[12px]  font-medium uppercase text-muted-foreground">
                      {c.plan}
                    </p>
                    <h3 className="lg:text-128-medium text-96-medium lg:h-auto h-24 md:text-black text-primary leading-24">
                      {c.price}
                      <span className="lg:text-14-medium text-[12px] font-medium uppercase md:text-muted-foreground text-black">
                        {c.period}
                      </span>
                    </h3>
                  </div>
                  <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground md:max-w-107.5">
                    {c.description}
                  </p>
                </div>
                <div className="flex lg:gap-8 gap-2 items-center md:flex-row flex-col md:w-auto w-full">
                  <Button
                    variant="outline"
                    className="font-semibold md:min-w-auto min-w-full"
                  >
                    {c.cta} <img src={arrowSvg} alt="" />
                  </Button>
                  <p className="md:text-16-regular text-12-regular text-muted-foreground">
                    {c.note}
                  </p>
                </div>
              </div>
            </div>
            <div className="feature-border flex flex-col ">
              <p className="text-18-medium md:text-14-medium uppercase md:text-muted-foreground text-black">
                {c.plan}
              </p>
              <div className="flex flex-col gap-6 md:gap-8">
                {c.features.map((feature) => (
                  <FeatureItem key={feature} text={feature} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PricingSection }
