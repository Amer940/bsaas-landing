import { useState, useEffect } from 'react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const times = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00']

const appointments = [
  { name: 'Diego', service: 'Fade', day: 1, time: 0 },
  { name: 'Kai', service: 'Fade', day: 2, time: 0 },
  { name: 'Marcus', service: 'Fade', day: 0, time: 1 },
  { name: 'Yusuf', service: 'Fade', day: 3, time: 1 },
  { name: 'Andre', service: 'Fade', day: 2, time: 2 },
  { name: 'Noah', service: 'Fade', day: 4, time: 2 },
  { name: 'Theo', service: 'Fade', day: 1, time: 3 },
  { name: 'Jules', service: 'Fade', day: 0, time: 4 },
  { name: 'Alex', service: 'Fade', day: 3, time: 5 },
]

const TOTAL = appointments.length
const APPEAR_MS = 420
const PAUSE_MS = 2500
const FADE_MS = 900
const RESET_MS = 800

export const CalendarAnimation = () => {
  const [visibleCount, setVisibleCount] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const cycle = (step: number) => {
      if (step <= TOTAL) {
        setVisibleCount(step)
        setIsFading(false)
        timeout = setTimeout(
          () => cycle(step + 1),
          step === 0 ? 300 : APPEAR_MS,
        )
      } else if (step === TOTAL + 1) {
        timeout = setTimeout(() => cycle(step + 1), PAUSE_MS)
      } else if (step === TOTAL + 2) {
        setIsFading(true)
        timeout = setTimeout(() => cycle(step + 1), FADE_MS)
      } else {
        setVisibleCount(0)
        setIsFading(false)
        timeout = setTimeout(() => cycle(0), RESET_MS)
      }
    }

    cycle(0)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full bg-[#FAF6EB] rounded-2xl p-2 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: '44px repeat(5, 1fr)',
            gridTemplateRows: `28px repeat(${times.length}, 52px)`,
          }}
        >
          <div />

          {days.map((day, i) => (
            <div
              key={day}
              className="text-center text-[11px] font-medium text-black/40 flex items-center justify-center"
              style={{ gridColumn: i + 2, gridRow: 1 }}
            >
              {day}
            </div>
          ))}

          {times.map((time, i) => (
            <div
              key={time}
              className="text-[11px] text-black/30 font-medium flex items-start justify-end pr-3 pt-1"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {time}
            </div>
          ))}

          {times.map((_, i) => (
            <div
              key={`gridline-${i}`}
              className="border-t border-black/[0.06]"
              style={{ gridColumn: '2 / -1', gridRow: i + 2 }}
            />
          ))}

          {appointments.map((apt, index) => {
            const isVisible = index < visibleCount
            return (
              <div
                key={apt.name}
                className="p-[3px] relative z-10"
                style={{ gridColumn: apt.day + 2, gridRow: apt.time + 2 }}
              >
                <div
                  className="bg-primary rounded-lg px-2.5 py-[7px] h-full"
                  style={{
                    opacity: isVisible && !isFading ? 1 : 0,
                    transform:
                      isVisible && !isFading
                        ? 'translateY(0) scale(1)'
                        : isFading
                          ? 'scale(0.97)'
                          : 'translateY(6px) scale(0.95)',
                    transition: isFading
                      ? `all ${FADE_MS}ms ease-in`
                      : 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div className="text-[11px] font-semibold text-primary-foreground leading-tight">
                    {apt.name}
                  </div>
                  <div className="text-[9px] font-medium text-primary-foreground/60 leading-tight mt-0.5">
                    {apt.service}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
