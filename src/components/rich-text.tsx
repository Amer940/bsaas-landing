import { Fragment } from 'react'

/** Renders `==highlight==` in the primary colour and `\n` as a line break. */
function RichText({ text }: { text: string }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(==[^=]+==)/).map((part, j) =>
        part.startsWith('==') && part.endsWith('==') ? (
          <span key={j} className="text-primary">
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
