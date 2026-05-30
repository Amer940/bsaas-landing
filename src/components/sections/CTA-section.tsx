import { EmailInput } from '../ui/input'
import image from '../../images/CTA-background-image.png'

export function CTASection() {
  return (
    <div className="md:px-4 px-2">
      <div
        className="md:site-container bg-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="site-border py-[48px] border-b !border-[#E1E2E4]">
          <div className="w-full md:px-0 px-1 flex flex-col items-center">
            <div className="flex flex-col items-center text-center mx-auto md:mb-8 mb-6">
              <h2 className="md:text-[50px] text-[36px] leading-[110%] font-medium text-white">
                Take care of your <br />
                client today!
              </h2>
              <p className="md:text-[18px] text-[14px] font-normal text-white mt-4 md:max-w-165 max-w-66.25">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been.
              </p>
            </div>
            <EmailInput />
          </div>
        </div>
      </div>
    </div>
  )
}
