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
      <div className="flex justify-between items-center py-[16px] md:py-[24px]">
        <span className="text-[14px] md:text-[18px] font-medium text-black">
          {title}
        </span>
        <div className="relative w-[14px] h-[14px] md:w-[17px] md:h-[17px] shrink-0 ml-4">
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
        <div className="pl-2 md:pr-[48px] overflow-hidden">
          <span className="block pb-[16px] md:pb-[24px] text-[12px] md:text-[16px] font-medium text-muted-foreground">
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
    <div className={cn('flex flex-col', className)}>
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
  )
}

export { FAQItem, FAQAccordion, faqVariants }
