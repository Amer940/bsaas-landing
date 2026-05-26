import { FeatureCard } from '../ui/features-card'

function FeaturesGridSection({ className }: { className?: string }) {
  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="site-container site-border py-[80px]">
        <div className="border border-y border-x-0">
          <div className="grid md:grid-cols-[1fr_2.93fr] grid-cols-1">
            <FeatureCard
              title="Upravljaj profilom"
              description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
              textPosition="bottom"
              media={
                <div className="rounded-sm overflow-hidden min-h-103.5 bg-[#111]" />
              }
              className="md:flex hidden border-0 border-r border-border"
            />
            <FeatureCard
              title="Upravljaj profilom"
              description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
              textPosition="top"
              media={
                <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#111]" />
              }
              className="md:hidden flex border-b border-t-0 border-border"
            />

            <div className="flex-col w-full">
              <div className="grid md:grid-cols-[2fr_1fr] grid-cols-1">
                <FeatureCard
                  title="Ubacuj u kalendar"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services, and the booking page is online the moment you tap publish."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className=" md:border md:border-l-0 md:border-t-0 border border-l border-r border-b border-border"
                />

                <FeatureCard
                  title="Prati statistiku"
                  description="One flat fee unlocks your chair on Faded. Set your hours."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className="border md:border-r-0 border-r border-b border-t-0 md:border-l-0 border-border justify-between"
                />
              </div>

              <div className="grid md:grid-cols-[1fr_2.3fr]">
                <FeatureCard
                  title="Ocijeni klijenta"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
                  textPosition="bottom"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className="md:flex hidden border-0 border-r border-border"
                />

                <FeatureCard
                  title="Ocijeni klijenta"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className="md:hidden flex border border-r border-border"
                />

                <FeatureCard
                  media={
                    <div className="rounded-sm absolute top-2 left-2 right-2 bottom-2 bg-[#1a1a1a]" />
                  }
                  className="border-0 md:block hidden"
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
