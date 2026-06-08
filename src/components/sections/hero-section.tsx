import { Button } from '../ui/button'
import { CalendarAnimation } from '../calendar-animation'

const Hero = () => {
  return (
    <div className="md:px-4 px-2">
      <div className="w-full bg-white">
        <div className="site-container site-border ">
          <div className="-mx-2 md:mx-0 flex flex-col md:grid md:grid-cols-2 md:border-b border-t md:border-t-0">
            <div className="bg-[#F7F5F0] gap-4 px-8 py-8 md:py-[160px] flex flex-col items-start justify-start md:border-r ">
              <div className="md:block hidden text-[14px] text-[#000000]/50 font-medium leading-[100%] font-sans">
                Prati statistiku
              </div>
              <div className="flex flex-col gap-8 w-full items-center md:items-start">
                <div className="text-[36px] text-center md:text-left md:text-[64px] font-medium text-black leading-[100%] font-sans">
                  Your chair <br />
                  always <span className="text-primary">full</span>.
                </div>
                <div className="text-[14px] text-muted-foreground font-sans max-w-[400px] leading-[150%] md:text-left text-center">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nobis nemo ratione delectus aliquam soluta tenetur
                  praesentium. Voluptatem molestias suscipit repellat!
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-2 md:gap-4">
                  <Button variant="default">Zapocni danas</Button>
                  <Button variant="outline">Kako radi</Button>
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
