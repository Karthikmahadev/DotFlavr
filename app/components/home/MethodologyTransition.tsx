"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Seg = { text: string; mark?: string; em?: boolean };

// `mark` = numbered, underlined phrase. `em` = italic tangerine.
const SEGMENTS: Seg[] = [
  { text: "We bridge the gap between a " },
  { text: "culinary idea", mark: "01" },
  { text: ", " },
  { text: "technical formulation", mark: "02" },
  { text: ", and " },
  { text: "commercially viable scale", mark: "03" },
  { text: ". " },
  { text: "Here\u2019s how we build it.", em: true },
];

// Splits after each space so every word keeps its trailing space.
const words = (s: string) => s.split(/(?<= )/);

const UNDERLINE = {
  backgroundImage: "linear-gradient(#ff6f3c, #ff6f3c)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 94%",
  backgroundSize: "0% 2px",
} as const;

export default function MethodologyTransition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Label
        gsap.from(".js-m-tag", {
          autoAlpha: 0,
          y: 14,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });

        // Words light up as you read down the statement.
        gsap.fromTo(
          ".js-mw",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".js-m-text",
              start: "top 80%",
              end: "bottom 50%",
              scrub: true,
            },
          }
        );

        // Underlines draw once the statement is mostly read.
        gsap.to(".js-mark", {
          backgroundSize: "100% 2px",
          duration: 1.1,
          ease: "power3.inOut",
          stagger: 0.25,
          scrollTrigger: { trigger: ".js-m-text", start: "top 45%", once: true },
        });

        // The lid lifts from one side as you scroll. Scrolling back closes it.
        const lift = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".js-cloche",
            start: "top 92%",
            end: "top 46%",
            scrub: 0.6,
          },
        });
        lift
          .fromTo(".js-lid", { rotation: 0, y: 0 }, { rotation: -17, y: -16, svgOrigin: "12 66" }, 0)
          .fromTo(".js-dot", { scale: 0.4, autoAlpha: 0, svgOrigin: "60 57" }, { scale: 1, autoAlpha: 1 }, 0.15)
          .fromTo(".js-steam", { autoAlpha: 0, y: 6 }, { autoAlpha: 0.7, y: -8, stagger: 0.12 }, 0.3);

        // Dot breathes once revealed.
        gsap.to(".js-dot-glow", {
          opacity: 0.55,
          scale: 1.15,
          svgOrigin: "60 57",
          duration: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Reduced motion: everything in its final state.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".js-mw", { opacity: 1 });
        gsap.set(".js-mark", { backgroundSize: "100% 2px" });
        gsap.set(".js-lid", { rotation: -17, y: -16, svgOrigin: "12 66" });
        gsap.set(".js-steam", { autoAlpha: 0.7 });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex w-full flex-col items-center bg-[#fff9eb] px-6 pt-28 text-center text-[#2a0610] md:pt-36"
    >
      <div className="mx-auto flex max-w-[56rem] flex-col items-center">
        {/* Label between two hairlines */}
        <div className="js-m-tag flex w-full max-w-[26rem] items-center gap-4">
          <span className="h-px flex-1 bg-[#2a0610]/20" />
          <span className="flex items-center gap-2.5 font-spacemono text-[11px] uppercase tracking-[0.22em] text-[#2a0610]/65">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
            The thinking behind Dot Flavr
          </span>
          <span className="h-px flex-1 bg-[#2a0610]/20" />
        </div>

        {/* Statement */}
        <h2 className="js-m-text mt-10 font-display text-[clamp(2.1rem,4.6vw,4.4rem)] font-normal leading-[1.1] tracking-[-0.035em] md:mt-12">
          {SEGMENTS.map((seg, i) => {
            if (seg.mark) {
              return (
                <span key={i} className="js-mark [box-decoration-break:clone]" style={UNDERLINE}>
                  {words(seg.text).map((w, j) => (
                    <span key={j} className="js-mw">
                      {w}
                    </span>
                  ))}
                  <sup className="js-mw ml-0.5 align-super font-spacemono text-[0.2em] tracking-[0.1em] text-[#ff6f3c]">
                    {seg.mark}
                  </sup>
                </span>
              );
            }
            return words(seg.text).map((w, j) => (
              <span
                key={`${i}-${j}`}
                className={`js-mw ${seg.em ? "italic text-[#ff6f3c]" : ""}`}
              >
                {w}
              </span>
            ));
          })}
        </h2>
      </div>

      {/* Table edge + cloche */}
      <div className="js-cloche relative mt-20 h-[92px] w-screen md:mt-28">
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[#2a0610]/25" />

        <svg
          viewBox="0 0 120 80"
          className="absolute bottom-0 left-1/2 h-[92px] w-[138px] -translate-x-1/2 overflow-visible"
          aria-hidden
        >
          {/* what is under the lid: the dot */}
          <circle className="js-dot-glow" cx="60" cy="57" r="15" fill="#ff6f3c" opacity="0.25" />
          <circle className="js-dot" cx="60" cy="57" r="9" fill="#ff6f3c" />

          {/* steam */}
          {[44, 60, 76].map((x, i) => (
            <path
              key={x}
              className="js-steam"
              d={`M${x} 46 c-4 -6 4 -10 0 -16 ${i === 1 ? "c-3 -5 3 -8 0 -12" : ""}`}
              fill="none"
              stroke="#2a0610"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0"
            />
          ))}

          {/* plate */}
          <path d="M2 66.5h116" stroke="#2a0610" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 70.5h92" stroke="#2a0610" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />

          {/* lid */}
          <g className="js-lid">
            <path d="M12 66 A48 48 0 0 1 108 66 Z" fill="#2a0610" />
            <path
              d="M24 58 A38 38 0 0 1 46 31"
              fill="none"
              stroke="#fff9eb"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="60" cy="16" r="4.5" fill="#2a0610" />
            <rect x="57.5" y="18" width="5" height="4" fill="#2a0610" />
          </g>
        </svg>
      </div>
    </section>
  );
}