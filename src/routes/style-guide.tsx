import { Navbar } from '#/components/navigation'
import { FAQSection } from '#/components/sections/faq-sections'
import { Button } from '#/components/ui/button'
import { FAQAccordion } from '#/components/ui/faq-item'
import { FeatureCard } from '#/components/ui/features-card'
import { EmailInput } from '#/components/ui/input'
import placeHolder from '../images/placeholder-image-1.png'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/style-guide')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="md:p-8 bg-amber-200 gap-4 flex pt-37.5 ">
      <Navbar />
      <div className="w-full mx-auto max-w-[1400px] flex flex-col items-center gap-4">
        <Button>Benjamin</Button>
        <Button variant="outline">Benjamin</Button>
        <Button variant="submit">Sign Up</Button>
        <EmailInput></EmailInput>
        <FeatureCard
          title="Ubacuj u kalendar"
          description="One flat fee unlocks your chair..."
          media={<img src={placeHolder} />}
          textPosition="top"
        />
        <FeatureCard
          title="Upravljaj profilom"
          description="One flat fee unlocks your chair on Faded. Set your hours."
          media={<img src={placeHolder} />}
          textPosition="bottom"
        />
        <div className="bg-white py-16 w-full mx-auto max-w-[1400px]">
          <FAQSection></FAQSection>
        </div>
      </div>
    </div>
  )
}
