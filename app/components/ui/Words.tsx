import { Fragment } from "react";

type Props = { text: string; mask?: boolean; className?: string };

export function Words({ text, mask = false, className = "" }: Props) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {mask ? (
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <span className={`js-word inline-block ${className}`}>{word}</span>
            </span>
          ) : (
            <span className={`js-word inline-block ${className}`}>{word}</span>
          )}{" "}
        </Fragment>
      ))}
    </>
  );
}