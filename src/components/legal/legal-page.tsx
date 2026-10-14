import type { ReactNode } from 'react'
import { Navbar } from '#/components/navigation'
import { Footer } from '#/components/sections/footer'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink, isLocalizedPath } from '#/i18n/localized-link'
import { Seo } from '#/i18n/seo'
import type { Locale } from '#/i18n/translations'

/**
 * Inline text supports `**bold**`, `[label](href)` links and bare
 * `name@chairo.app` addresses (rendered as mailto links).
 */
type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: Array<string> }
  | { type: 'table'; head: Array<string>; rows: Array<Array<string>> }

interface LegalDoc {
  title: string
  updated?: string
  blocks: Array<Block>
}

type LocalizedLegalDoc = Record<Locale, LegalDoc>

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[\w.+-]+@chairo\.app)/g

const linkClass =
  'text-foreground underline underline-offset-2 hover:text-primary transition-colors duration-250'

function renderInline(text: string): ReactNode {
  return text.split(INLINE_PATTERN).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {renderInline(part.slice(2, -2))}
        </strong>
      )
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const [, label, href] = link
      return isLocalizedPath(href) ? (
        <LocalizedLink key={i} to={href} className={linkClass}>
          {label}
        </LocalizedLink>
      ) : (
        <a
          key={i}
          href={href}
          className={linkClass}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      )
    }

    if (/^[\w.+-]+@chairo\.app$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className={linkClass}>
          {part}
        </a>
      )
    }

    return part
  })
}

function renderBlock(block: Block, key: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={key}
          className="text-24-medium text-foreground leading-[120%] mt-12 mb-4"
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={key} className="text-18-medium text-foreground mt-8 mb-3">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p key={key} className="mb-4">
          {renderInline(block.text)}
        </p>
      )
    case 'ul':
      return (
        <ul key={key} className="list-disc pl-6 mb-4 flex flex-col gap-2">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div
          key={key}
          className="overflow-x-auto mb-6 rounded-md border border-border"
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary">
              <tr>
                {block.head.map((cell, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 font-medium text-foreground align-top"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-border">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-3 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

/** First paragraph as plain text, for the meta description. */
function describe(doc: LegalDoc): string | undefined {
  const first = doc.blocks.find((block) => block.type === 'p')
  if (!first) return undefined
  return first.text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

interface LegalPageProps {
  content: LocalizedLegalDoc
}

function LegalPage({ content }: LegalPageProps) {
  const { locale } = useLocale()
  const doc = content[locale]

  return (
    <>
      <Seo title={`${doc.title} | Chairo`} description={describe(doc)} />
      <Navbar />
      <main className="md:px-4 px-2">
        <div className="site-container site-border">
          <article className="max-w-3xl mx-auto px-4 md:py-20 py-12 text-16-regular leading-[160%] text-muted-foreground">
            <h1 className="md:text-50-medium text-[36px] leading-[110%] font-medium tracking-[-0.015em] text-foreground mb-4">
              {doc.title}
            </h1>
            {doc.updated && (
              <p className="text-14-regular mb-10">{doc.updated}</p>
            )}
            {doc.blocks.map(renderBlock)}
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export { LegalPage }
export type { LegalDoc, LocalizedLegalDoc }
