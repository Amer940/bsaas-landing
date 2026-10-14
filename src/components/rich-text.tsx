import { Fragment } from 'react'

/**
 * Renders `==highlight==` with the accent underline and `\n` as a line break
 * (from `md` up; on phones the heading wraps naturally).
 */
function RichText({ text }: { text: string }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {' '}
          <br className="max-md:hidden" />
        </>
      )}
      {line.split(/(==[^=]+==)/).map((part, j) =>
        part.startsWith('==') && part.endsWith('==') ? (
          <span
            key={j}
            className="whitespace-nowrap underline decoration-primary decoration-[5px] underline-offset-2 [text-decoration-skip-ink:none]"
          >
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        ),
      )}
    </Fragment>
  ))
}

export { RichText }
