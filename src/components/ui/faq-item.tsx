import { useState } from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils.ts'

const faqVariants = cva(
  'flex flex-col border-t border-border cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-white',
      },
      size: {
        default: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function FAQItem({
  className,
  variant = 'default',
  size = 'default',
  title,
  answer,
  isOpen,
  onClick,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof faqVariants> & {
    title: string
    answer: string
    isOpen: boolean
    onClick: () => void
  }) {
  return (
    <div
      data-slot="faq-item"
      data-variant={variant}
      data-size={size}
      className={cn(faqVariants({ variant, size, className }))}
      onClick={onClick}
      {...props}
    >
      <div className="flex justify-between items-center py-4 md:py-6 ">
        <span className="text-[14px] md:text-[18px] font-medium text-black">
          {title}
        </span>
        <div className="relative w-3.5 h-3.5 md:w-4.25 md:h-4.25 shrink-0 ml-4">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.25 8.5H1.75"
              stroke="#4C4C4C"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8.5 1.75V15.25"
              stroke="#4C4C4C"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                opacity: isOpen ? 0 : 1,
                transition: 'transform 300ms ease, opacity 300ms ease',
                transformOrigin: 'center',
              }}
            />
          </svg>
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="pl-2 md:pr-12 overflow-hidden">
          <span className="block pb-4 md:pb-6 text-[12px] md:text-[16px] font-medium text-muted-foreground">
            {answer}
          </span>
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
    <div className={cn('flex flex-col w-full', className)}>
      <div className="max-w-202 w-full mx-auto md:px-0 px-1">
        {items.map((item, index) => (
          <FAQItem
            key={index}
            title={item.title}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(index)}
            className={index == items.length - 1 ? 'border-y' : ''}
          />
        ))}
      </div>
    </div>
  )
}

export { FAQItem, FAQAccordion, faqVariants }
