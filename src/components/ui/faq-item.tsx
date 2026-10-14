import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

function FAQItem({
  title,
  answer,
  isOpen,
  onToggle,
}: {
  title: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = useId()

  return (
    <div data-slot="faq-item" className="border-t border-border py-5.5">
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex w-full items-center justify-between gap-4 text-left text-base font-bold md:text-[1.0625rem]"
        >
          {title}
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8">
            <Plus
              aria-hidden="true"
              className={cn(
                'size-3.5 transition-transform duration-300',
                isOpen && 'rotate-45',
              )}
              strokeWidth={2.5}
            />
          </span>
        </button>
      </h3>

      <div
        id={answerId}
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="m-0 mt-2.5 max-w-160 text-[0.9375rem] leading-[1.55] text-foreground/65">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function FAQAccordion({
  items,
  className,
}: {
  items: { title: string; answer: string }[]
  className?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-205 border-b border-border',
        className,
      )}
    >
      {items.map((item, index) => (
        <FAQItem
          key={item.title}
          title={item.title}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex((open) => (open === index ? null : index))
          }
        />
      ))}
    </div>
  )
}

export { FAQItem, FAQAccordion }
