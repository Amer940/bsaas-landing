import { FeatureCard } from '../ui/features-card'

function FeaturesGridSection({ className }: { className?: string }) {
  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="site-container site-border py-[80px]">
        <div className="border border-y border-x-0">
          <div className="grid grid-cols-[1fr_2.93fr]">
            <FeatureCard
              title="Upravljaj profilom"
              description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
              textPosition="bottom"
              media={
                <div className="rounded-sm overflow-hidden min-h-103.5 bg-[#111]" />
              }
              className="border-0 border-r border-border"
            />

            <div className="flex-col w-full">
              <div className="grid grid-cols-[2fr_1fr]">
                <FeatureCard
                  title="Ubacuj u kalendar"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services, and the booking page is online the moment you tap publish."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden h-36 bg-[#1a1a1a]" />
                  }
                  className="border-0 border-r border-b border-border"
                />
                <FeatureCard
                  title="Prati statistiku"
                  description="One flat fee unlocks your chair on Faded. Set your hours."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden min-h-36 bg-[#1a1a1a]" />
                  }
                  className="border-0 border-b border-border justify-between"
                />
              </div>

              <div className="grid grid-cols-[1fr_2.3fr]">
                {' '}
                <FeatureCard
                  title="Ocijeni klijenta"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
                  textPosition="bottom"
                  media={
                    <div className="rounded-sm overflow-hidden h-40 bg-[#1a1a1a]" />
                  }
                  className="border-0 border-r border-border"
                />
                <FeatureCard
                  media={
                    <div className="rounded-sm absolute top-2 left-2 right-2 bottom-2 bg-[#1a1a1a]" />
                  }
                  className="border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { FeaturesGridSection }
