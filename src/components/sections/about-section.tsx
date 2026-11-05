import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'

/** Plain statement of what Chairo is, who it's for and where it's made. */
export function AboutSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].about

  return (
    <section
      id="o-nama"
      className="mx-auto max-w-300 scroll-mt-24 px-5 py-10 md:py-17.5 xl:px-0"
    >
      <SectionHeading eyebrow={c.eyebrow} className="mb-6 md:mb-9">
        <RichText text={c.title} />
      </SectionHeading>
      <div className="mx-auto flex max-w-170 flex-col gap-4 text-[1.0625rem] leading-relaxed text-foreground/70">
        {c.paragraphs.map((text) => (
          <p key={text} className="m-0">
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}
