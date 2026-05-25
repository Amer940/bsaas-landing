import { Navbar } from '#/components/navigation'
import { Button } from '#/components/ui/button'
import { FeatureCard } from '#/components/ui/features-card'
import { EmailInput } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import placeHolder from '../images/placeholder-image-1.png'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <div className="p-8 bg-amber-200 gap-4 flex pt-37.5">
        <Navbar></Navbar>
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
      </div>
      <FeaturesGridSection />
    </>
  )
}
