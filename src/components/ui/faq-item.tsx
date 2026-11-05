import { useRef } from 'react'
import { Plus } from 'lucide-react'

import { cn } from '#/lib/utils.ts'
import { useHashTarget } from '#/lib/use-hash-target'

/**
 * FAQ as native `<details>`: works without JavaScript, the question stays a
 * real heading (not button text) for crawlers and AI tools, and the shared
 * `name` keeps one answer open at a time. The open/close animation is in
 * styles.css (`::details-content`), where supported.
 */
function FAQItem({
  id,
  title,
  answer,
  defaultOpen,
}: {
  id?: string
  title: string
  answer: string
  defaultOpen?: boolean
}) {
  return (
    <details
      id={id}
      name="faq"
      open={defaultOpen}
      data-slot="faq-item"
      className="faq-item group scroll-mt-24 border-t border-border py-5.5"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 [&::-webkit-details-marker]:hidden">
        <h3 className="m-0 text-base font-bold md:text-[1.0625rem]">{title}</h3>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8">
          <Plus
            aria-hidden="true"
            className="size-3.5 transition-transform duration-400 ease-smooth group-open:rotate-45"
            strokeWidth={2.5}
          />
        </span>
      </summary>
      <p className="m-0 mt-2.5 max-w-160 text-[0.9375rem] leading-[1.55] text-foreground/65">
        {answer}
      </p>
    </details>
  )
}

function FAQAccordion({
  items,
  className,
}: {
  items: Array<{ id?: string; title: string; answer: string }>
  className?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)

  // A link to `#<id>` opens that answer.
  useHashTarget((hash) => {
    const target = listRef.current?.querySelector<HTMLDetailsElement>(
      `details[id="${CSS.escape(hash)}"]`,
    )
    if (target) target.open = true
  })

  return (
    <div
      ref={listRef}
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
          defaultOpen={index === 0}
        />
      ))}
    </div>
  )
}

export { FAQItem, FAQAccordion }
