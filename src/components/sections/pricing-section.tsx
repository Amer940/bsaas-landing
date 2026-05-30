import { Button } from '../ui/button'
import arrowSvg from '../../images/arrow-svg.svg'
import FeatureItem from '../ui/pricing-feature-label'

function PricingSection({ className }: { className?: string }) {
  return (
    <div className="w-full md:px-4 px-2">
      <div className="site-container site-border border md:py-20 flex flex-col md:gap-24 gap-8">
        <div className="flex flex-col md:items-center md:text-center text-left mx-auto md:px-0 px-2">
          <h2 className="md:text-[50px] max-w-157 text-[36px] tracking-[-0.015em] leading-[110%] font-medium md:mt-0 mt-10">
            One{' '}
            <span className="text-primary md:inline inline-block"> price.</span>
            <br className="md:block hidden"></br>
            <span className="block md:inline">Something included.</span>
          </h2>
          <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground mt-5 md:max-w-157">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been.
          </p>
        </div>
        <div className="max-w-253.75 xl:px-0 md:px-6 px-2 items-center justify-between w-full flex  mx-auto">
          <div className="flex min-w-full md:flex-row flex-col md:gap-0 gap-8 ">
            <div className="flex md:w-auto w-full">
              <div className="flex flex-col gap-8 md:pr-20 pr-0 md:w-auto w-full">
                <div className="flex flex-col md:gap-8 gap-4">
                  <div className="flex flex-col gap-6 ">
                    <p className="md:text-14-medium text-[12px]  font-medium uppercase text-muted-foreground">
                      The Chair • Monthly
                    </p>
                    <h3 className="lg:text-128-medium text-96-medium lg:h-auto h-24 md:text-black text-primary leading-24">
                      $29
                      <span className="lg:text-14-medium text-[12px] font-medium uppercase md:text-muted-foreground text-black">
                        / Month
                      </span>
                    </h3>
                  </div>
                  <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground md:max-w-107.5">
                    Built for modern barbershops that want faster bookings,
                    fewer no-shows, and a smoother client experience.
                  </p>
                </div>
                <div className="flex lg:gap-8 gap-2 items-center md:flex-row flex-col md:w-auto w-full">
                  <Button
                    variant="outline"
                    className="font-semibold md:min-w-auto min-w-full"
                  >
                    START YOUR CHAIR <img src={arrowSvg}></img>
                  </Button>
                  <p className="md:text-16-regular text-12-regular text-muted-foreground">
                    14 days Free • Cancel Anytime
                  </p>
                </div>
              </div>
            </div>
            <div className="feature-border flex flex-col ">
              <p className="text-18-medium md:text-14-medium uppercase md:text-muted-foreground text-black">
                The Chair • Monthly
              </p>
              <div className="flex flex-col gap-6 md:gap-8">
                <FeatureItem text={'Online appointment booking 24/7'} />
                <FeatureItem text={'SMS & email appointment reminders'} />
                <FeatureItem text={'Staff and chair management'} />
                <FeatureItem text={'Customer history & visit tracking'} />
                <FeatureItem text={'Simple dashboard with booking analytics'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PricingSection }
