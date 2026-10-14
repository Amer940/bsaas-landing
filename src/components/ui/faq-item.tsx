import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cn } from '#/lib/utils.ts'
import { useHashTarget } from '#/lib/use-hash-target'

function FAQItem({
  id,
  title,
  answer,
  isOpen,
  onToggle,
}: {
  id?: string
  title: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = useId()

  return (
    <div
      id={id}
      data-slot="faq-item"
      className="scroll-mt-24 border-t border-border py-5.5"
    >
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
                'size-3.5 transition-transform duration-400 ease-smooth',
                isOpen && 'rotate-45',
              )}
              strokeWidth={2.5}
            />
          </span>
        </button>
      </h3>

      <div
        id={answerId}
        className="grid transition-[grid-template-rows] duration-400 ease-smooth"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div
          className={cn(
            'overflow-hidden transition-opacity duration-400 ease-smooth',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
        >
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
  items: { id?: string; title: string; answer: string }[]
  className?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useHashTarget((hash) => {
    const index = items.findIndex((item) => item.id === hash)
    if (index !== -1) setOpenIndex(index)
  })

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
          id={item.id}
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
