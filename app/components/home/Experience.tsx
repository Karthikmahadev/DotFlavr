"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Words } from "../ui/Words";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Burst() {
  return (
    <svg width="15" height="15" viewBox="-12 -12 24 24" fill="currentColor" aria-hidden>
      {[0, 45, 90, 135].map((a) => (
        <path
          key={a}
          d="M0 -11 L2 -2 L11 0 L2 2 L0 11 L-2 2 L-11 0 L-2 -2Z"
          transform={`rotate(${a})`}
        />
      ))}
    </svg>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          })
          .from(".js-exp-label", { autoAlpha: 0, y: 14, duration: 0.8, clearProps: "all" })
          .from(".js-word", { yPercent: 110, duration: 1.3, stagger: 0.05, clearProps: "all" }, 0.1)
          .from(".js-exp-copy", { autoAlpha: 0, y: 20, duration: 1, clearProps: "all" }, 0.4)
          .fromTo(
            ".js-exp-pill",
            { autoAlpha: 0, y: 24, scale: 0.95 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, clearProps: "all" },
            0.6
          );

        // Gentle floating accent dot
        gsap.to(".js-exp-dot", {
          y: 12,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[#fff9eb] px-6 py-24 font-sans text-[#800020] md:py-32"
    >
      {/* Floating Accent Dot */}
      <span
        aria-hidden
        className="js-exp-dot absolute right-[18%] top-12 hidden h-3 w-3 rounded-full bg-[#ff6f3c] shadow-[0_0_12px_rgba(255,111,60,0.5)] md:block"
      />

      <div className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
        {/* Category Label */}
        <div className="js-exp-label inline-flex items-center gap-2 rounded-full border border-[#ff6f3c]/30 bg-[#ff6f3c]/10 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6f3c]">
          <Burst />
          <span>Scientific Capability &bull; Real Trials</span>
        </div>

        {/* Editorial Headline */}
        <h2 className="mt-8 text-balance font-serif text-[clamp(2.4rem,4.4vw,3.8rem)] font-normal leading-[1.1] tracking-[-0.025em] text-[#800020]">
          <Words text="Food science." mask />{" "}
          <em className="italic text-[#ff6f3c]">
            <Words text="Practical trials." mask />
          </em>{" "}
          <Words text="Better products." mask />
        </h2>

        {/* Body Narrative */}
        <p className="js-exp-copy mt-7 max-w-[42rem] text-[15px] leading-[1.7] text-[#800020]/80 sm:text-[17px]">
          Dot Flavr combines food science with hands-on product development. We help businesses refine formulations, evaluate product quality and develop practical processes for their next stage of growth.
        </p>

        {/* 3 Grounded Pillars / Bento Cards Structure */}
        <div className="mt-14 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3 items-stretch">
          {[
            {
              num: "01",
              tag: "SCIENCE",
              title: "Product & Ingredient Science",
              desc: "Ingredient functionality, formulation parameters and product quality evaluation.",
            },
            {
              num: "02",
              tag: "TRIALS",
              title: "Formulation & Testing",
              desc: "Prototype development, sensory evaluation and iterative refinement.",
            },
            {
              num: "03",
              tag: "PROCESS",
              title: "Production Readiness",
              desc: "SOP development, process standardisation and scale-up guidance.",
            },
          ].map((pillar) => (
            <div
              key={pillar.num}
              className="js-exp-pill group relative flex flex-col justify-between rounded-2xl bg-white/70 p-7 shadow-sm ring-1 ring-[#800020]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md hover:ring-[#ff6f3c]/40"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#ff6f3c]">
                  <span>{pillar.num} / {pillar.tag}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]/50 transition-colors group-hover:bg-[#ff6f3c]" />
                </div>
                <h3 className="mt-4 font-serif text-[1.25rem] font-medium leading-snug text-[#800020]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#800020]/75">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-8 border-t border-[#800020]/10 pt-3 font-mono text-[9px] uppercase tracking-wider text-[#800020]/40">
                Dot Flavr Protocol
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}