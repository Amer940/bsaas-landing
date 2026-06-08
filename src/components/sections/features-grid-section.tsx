import { FeatureCard } from '../ui/features-card'

function FeaturesGridSection({ className }: { className?: string }) {
  return (
    <div className={`w-full md:px-4 px-2 ${className ?? ''}`}>
      <div className="site-container site-border md:py-20">
        <div className="border border-y border-x-0 -mx-2 md:mx-0">
          <div className="grid md:grid-cols-[1fr_2.93fr] flex-col flex ">
            <FeatureCard
              title="Upravljaj profilom"
              description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
              textPosition="bottom"
              media={
                <div className="rounded-sm overflow-hidden min-h-103.5 bg-[#111]" />
              }
              className="md:flex hidden border-0"
            />
            <FeatureCard
              title="Upravljaj profilom"
              description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
              textPosition="top"
              media={
                <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#111]" />
              }
              className="md:hidden flex border-0 border-b"
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
                  className="border-0 md:border-l border-b md:border-b-0"
                />

                <FeatureCard
                  title="Prati statistiku"
                  description="One flat fee unlocks your chair on Faded. Set your hours."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className="justify-between border-0 md:border-l"
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
                  className="md:flex hidden border-b-0"
                />

                <FeatureCard
                  title="Ocijeni klijenta"
                  description="One flat fee unlocks your chair on Faded. Set your hours, list your services."
                  textPosition="top"
                  media={
                    <div className="rounded-sm overflow-hidden md:h-40 h-37.5 bg-[#1a1a1a]" />
                  }
                  className="md:hidden flex border-0 border-t"
                />

                <FeatureCard
                  media={
                    <div className="rounded-sm absolute top-2 left-2 right-2 bottom-2 bg-[#1a1a1a]" />
                  }
                  className="md:block hidden border-0 border-t"
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
