import iphoneImg from '#/images/iphone.png'
import ell from '#/images/ell.png'
import { useEffect, useRef, useState } from 'react'

const StepsSection = () => {
  const [active, setActive] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(false)

  useEffect(() => {
    setActive('01')
  }, [])

  const items = [
    {
      id: '01',
      title: 'Pay & go live',
      text: 'One flat fee unlocks your chair on Faded. Set your hours, list your services, and the booking page is online the moment you tap publish.',
      img: iphoneImg,
    },
    {
      id: '02',
      title: 'Share your code',
      text: 'One flat fee unlocks your chair on Faded. Set your hours, list your services, and the booking page is online the moment you tap publish.',
      img: iphoneImg,
    },
    {
      id: '03',
      title: 'It lands in your calendar',
      text: 'One flat fee unlocks your chair on Faded. Set your hours, list your services, and the booking page is online the moment you tap publish.',
      img: iphoneImg,
    },
  ]

  const activeItem = items.find((i) => i.id === active) || items[0]

  const handleCycle = (currentId: string) => {
    const idx = items.findIndex((i) => i.id === currentId)
    const nextIdx = (idx + 1) % items.length
    setActive(items[nextIdx].id)

    if (scrollRef.current) {
      isAutoScrolling.current = true
      const target = scrollRef.current.children[nextIdx] as HTMLElement
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
      setTimeout(() => {
        isAutoScrolling.current = false
      }, 600)
    }
  }

  const handleScroll = () => {
    if (isAutoScrolling.current) return
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.offsetWidth / 2
    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - childCenter)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    }
    const newId = items[closest]?.id
    if (newId && newId !== active) setActive(newId)
  }

  return (
    <div className="w-full md:px-4 px-2">
      <div className="site-container site-border overflow-hidden lg:px-0 md:px-4">
        <div className="flex flex-col relative">
          <div className="bg-linear-to-t from-white/60 absolute bottom-0 left-0 right-0 h-[3%] z-5 hidden md:block"></div>
          <div className="absolute bottom-0 left-0 right-0 w-full hidden md:block">
            <img src={ell} alt="" className="w-full" />
          </div>
          <div className="flex flex-col items-center text-center mx-auto">
            <h2 className="md:text-[50px] max-w-157 text-[36px] tracking-[-0.015em] leading-[110%] font-medium md:mt-0 mt-10">
              From sign-up to{' '}
              <span className="block md:inline">first booking in</span>{' '}
              <span className="text-primary block md:inline">
                under a minute.
              </span>
            </h2>
            <p className="md:text-[18px] text-[14px] font-normal text-muted-foreground mt-5 md:max-w-157">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been.
            </p>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col mt-10 pb-10">
            <div className="flex flex-col gap-2 px-4 max-w-95 mx-auto">
              <div className="flex items-center gap-[3.5px] font-mono text-[12px] font-medium pr-2">
                {activeItem.id}
                <div className="w-full h-0.5 bg-border relative overflow-hidden">
                  <div
                    key={active}
                    className="absolute inset-0 bg-primary"
                    style={{ animation: 'progress-fill 8s linear forwards' }}
                    onAnimationEnd={() => handleCycle(active)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[1.5rem] font-medium">
                  {activeItem.title}
                </span>
                <span className="text-[14px] text-muted-foreground leading-[140%]">
                  {activeItem.text}
                </span>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide mt-8 px-[22%]"
              onScroll={handleScroll}
            >
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="shrink-0 w-fit snap-center flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{
                    width: '90%',
                    scale: active === item.id ? 1 : 0.8,
                  }}
                  onClick={(e) =>
                    (e.currentTarget as HTMLElement).scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    })
                  }
                >
                  <img
                    src={item.img}
                    alt="iPhone preview"
                    className="transition-[filter] duration-500"
                    style={{
                      filter:
                        active == item.id ? 'brightness(1)' : 'brightness(0.9)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex max-w-253.75 mx-auto items-center justify-between w-full gap-8 md:mt-16 mt-10">
            {items.map((item) => (
              <div
                className="flex flex-col gap-16 transition-colors duration-500"
                onClick={() => setActive(item.id)}
                style={{
                  color:
                    active == item.id
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-[3.5px] font-mono text-[14px] font-medium pr-2">
                    {item.id}
                    <div className="w-full h-0.5 bg-border relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-primary"
                        style={
                          active == item.id
                            ? { width: '100%', transition: 'width 8s linear' }
                            : { width: '0%', transition: 'width 400ms ease-in' }
                        }
                        onTransitionEnd={(e) => {
                          if (active == item.id && e.propertyName === 'width') {
                            handleCycle(item.id)
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-24-medium">{item.title}</span>
                    <span className="text-16-regular text-muted-foreground leading-[140%]">
                      {item.text}
                    </span>
                  </div>
                </div>
                <div
                  className="w-full flex items-center justify-center transition-all duration-500 ease-out"
                  style={{
                    scale: active == item.id ? 1 : 0.85,
                    marginBottom: active == item.id ? '-5rem' : '-10rem',
                    marginTop: active == item.id ? 0 : '5rem',
                  }}
                >
                  <img
                    src={item.img}
                    alt="iPhone preview"
                    className="transition-[filter] duration-500"
                    style={{
                      filter:
                        active == item.id
                          ? 'brightness(1)'
                          : 'brightness(0.95)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepsSection
