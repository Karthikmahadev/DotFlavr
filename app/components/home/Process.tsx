"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Phase = {
  label: string;
  station: string; // short name on the rail
  stage: string;
  title: string;
  body: string;
  items: string[];
  img: string;
  alt: string;
  bg: string; // shows until the photo loads
  arch: boolean;
};

const PHASES: Phase[] = [
  {
    label: "Phase 01",
    station: "Understand",
    stage: "Understand & Benchmark",
    title: "Feasibility & Alignment",
    body: "Every engagement begins by defining product parameters, target nutrition profiles, regulatory boundaries, and commercial constraints. We map competitor shelves, verify ingredient availability, and establish the exact sensory and cost targets before running bench trials.",
    items: [
      "Technical Discovery Call",
      "Benchmark & Ingredient Mapping",
      "FSSAI & Regulatory Scoping",
      "Target Shelf-Life Parameters",
      "Formulation Blueprint",
    ],
    img: "/images/image1.avif",
    alt: "Food formulation discovery and ingredient audit",
    bg: "#800020",
    arch: true,
  },
  {
    label: "Phase 02",
    station: "Develop",
    stage: "Develop, Trial & Evaluate",
    title: "Formulation & Stability",
    body: "With the flavor profile locked, we engineer physical trial batches. We test varying humectants, natural binders, and emulsifiers, running water activity checks and accelerated stability tests to ensure the recipe survives ambient supply chains without degradation.",
    items: [
      "Benchtop Prototype Trials",
      "Sensory & Sweetness Optimization",
      "Water Activity (aw) Testing",
      "Shelf-Life & Microbial Verification",
      "Formulation Dossier Documentation",
    ],
    img: "/images/image2.avif",
    alt: "Food laboratory formulation and texture analysis",
    bg: "#ff6f3c",
    arch: false,
  },
  {
    label: "Phase 03",
    station: "Refine & scale",
    stage: "Refine & Scale",
    title: "Scale-Up & Commercialization",
    body: "Once the formula is validated, we translate kitchen measurements into industrial manufacturing specs. We draft standard operating procedures (SOPs), support pilot batch trials at factory facilities, and verify packaging barrier compatibility for retail launch.",
    items: [
      "Pilot Factory Production Runs",
      "Co-Packer Handover SOPs",
      "COGS & Packaging Compatibility",
      "Retail Batch Consistency Audit",
      "Post-Launch Technical Support",
    ],
    img: "/images/image3.avif",
    alt: "Commercial food production line scale-up",
    bg: "#800020",
    arch: true,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Last word of the title becomes italic tangerine. */
function Title({ text }: { text: string }) {
  const i = text.lastIndexOf(" ");
  return (
    <>
      {text.slice(0, i + 1)}
      <em className="text-[#ff6f3c]">{text.slice(i + 1)}</em>
    </>
  );
}

function PhaseRow({ p, i, flip }: { p: Phase; i: number; flip: boolean }) {
  const shape = p.arch ? "rounded-t-[999px]" : "rounded-none";

  return (
    <div className="js-phase flex items-center px-6 py-14 md:px-10 motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:py-0 motion-safe:lg:pb-[12svh] motion-safe:lg:pt-[calc(4rem+1svh)]">
      <div className="js-phase-inner mx-auto grid w-full max-w-[1120px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-[5rem]">
        {/* ───── Text ───── */}
        <div className={`relative ${flip ? "lg:order-2" : ""}`}>
          {/* ghost numeral */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 -top-10 z-0 select-none font-display font-medium leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(42,6,16,0.16)] text-[7.5rem] md:text-[10rem] lg:-top-[0.28em] lg:text-[min(13vw,24svh)]"
          >
            {pad(i + 1)}
          </span>

          <div className="relative z-10">
            <p className="js-ph-in flex flex-wrap items-baseline gap-x-3 border-b border-[#2a0610]/20 pb-3 font-spacemono text-[11px] uppercase tracking-[0.22em]">
              <span className="text-[#ff6f3c]">{p.label}</span>
              <span className="font-newsreader text-[1.05rem] normal-case italic tracking-normal text-[#2a0610]/65">
                {p.stage}
              </span>
            </p>

            <h3 className="js-ph-in mt-[min(2.6rem,4.5svh)] font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[#2a0610] lg:text-[min(3.7vw,6.6svh)]">
              <Title text={p.title} />
            </h3>

            <p className="js-ph-in mt-4 max-w-[30rem] text-[clamp(14px,1.05vw,16px)] leading-[1.6] text-[#2a0610]/75 lg:mt-[min(1.4rem,2.4svh)]">
              {p.body}
            </p>

            <p className="js-ph-in mt-6 font-spacemono text-[10px] uppercase tracking-[0.22em] text-[#2a0610]/55 lg:mt-[min(1.8rem,3svh)]">
              Core deliverables
            </p>

            <ol className="js-ph-in mt-2 grid max-w-[36rem] border-t border-[#2a0610]/20 sm:grid-cols-2 sm:gap-x-8">
              {p.items.map((it, n) => (
                <li
                  key={it}
                  className="flex items-baseline gap-3 border-b border-[#2a0610]/20 py-[min(0.6rem,1.1svh)] text-[14px] leading-snug text-[#2a0610]/85"
                >
                  <span className="font-spacemono text-[10px] text-[#ff6f3c]">{pad(n + 1)}</span>
                  {it}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ───── Plate ───── */}
        <div
          className={`relative mx-auto aspect-square w-full max-w-[34rem] lg:w-auto lg:max-w-none lg:justify-self-center lg:h-[min(58svh,34rem)] ${
            flip ? "lg:order-1" : ""
          }`}
        >
          {/* offset outline */}
          <span
            aria-hidden
            className={`absolute inset-0 translate-x-3 translate-y-3 border border-[#ff6f3c] sm:translate-x-4 sm:translate-y-4 ${shape}`}
          />
          <div className={`js-frame relative h-full w-full overflow-hidden bg-[#3b0c18] ${shape}`} style={{ backgroundColor: p.bg }}>
            <Image
              src={p.img}
              alt={p.alt}
              fill
              sizes="(min-width:1024px) 520px, 100vw"
              className="js-phase-img object-cover"
            />
            <span className="absolute bottom-4 left-4 bg-[#fff9eb] px-3 py-1.5 font-spacemono text-[10px] uppercase tracking-[0.2em] text-[#2a0610]">
              Plate {pad(i + 1)}
            </span>
          </div>
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[#ffb08a]/60"
          />
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin, swap phases, and carry the batch along the rail.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const phases = gsap.utils.toArray<HTMLElement>(".js-phase");
        const stations = gsap.utils.toArray<HTMLElement>(".js-st");
        const last = phases.length - 1;

        gsap.set(phases.slice(1), { autoAlpha: 0 });
        gsap.set(stations.slice(1), { opacity: 0.35 });
        gsap.set(".js-dot", { left: "0%" });
        gsap.set(".js-fill", { scaleX: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ".js-pin",
            start: "top top",
            end: () => `+=${last * 120}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        tl.to({}, { duration: 0.35 }); // hold on phase one

        phases.forEach((ph, i) => {
          if (i === 0) return;
          const at = `swap${i}`;
          tl.addLabel(at)
            .to(phases[i - 1], { autoAlpha: 0, y: -40, duration: 0.5 }, at)
            .fromTo(ph, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, `${at}+=0.25`)
            .fromTo(
              ph.querySelector(".js-frame"),
              { clipPath: "inset(0 0 100% 0)" },
              { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" },
              `${at}+=0.25`
            )
            .fromTo(
              ph.querySelectorAll(".js-ph-in"),
              { y: 26, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06 },
              `${at}+=0.3`
            )
            // the batch moves to the next station
            .to(".js-dot", { left: `${(i / last) * 100}%`, duration: 0.85, ease: "power3.inOut" }, at)
            .to(".js-fill", { scaleX: i / last, duration: 0.85, ease: "power3.inOut" }, at)
            .to(stations[i - 1], { opacity: 0.35, duration: 0.4 }, at)
            .to(stations[i], { opacity: 1, duration: 0.4 }, `${at}+=0.3`)
            .to({}, { duration: 0.45 }); // hold on the new phase
        });
      });

      // Mobile / tablet: each phase fades up as it arrives.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".js-phase-inner").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 35,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="process" className="bg-[#fff9eb] font-sans text-[#2a0610]">
      {/* Header rule */}
      <div className="px-6 pt-1 md:px-10">
        <div className="flex items-center justify-between border-t border-[#2a0610] pt-4 font-spacemono text-[11px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
            Consultancy methodology
          </span>
          <span className="text-[#2a0610]/55">{pad(PHASES.length)} sequential phases</span>
        </div>
      </div>

      {/* Pinned stage */}
      <div className="js-pin relative overflow-hidden motion-safe:lg:h-svh">
        {PHASES.map((p, i) => (
          <PhaseRow key={p.title} p={p} i={i} flip={i % 2 === 1} />
        ))}

        {/* The rail: the batch travels along it (desktop, motion allowed) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[3.5svh] z-20 hidden px-6 md:px-10 motion-safe:lg:block">
          <div className="mx-auto max-w-[1120px]">
            <div className="grid grid-cols-3 font-spacemono text-[10px] uppercase tracking-[0.2em]">
              {PHASES.map((p, i) => (
                <span
                  key={p.station}
                  className={`js-st ${i === 0 ? "text-left" : i === PHASES.length - 1 ? "text-right" : "text-center"}`}
                >
                  <span className="text-[#ff6f3c]">{pad(i + 1)}</span> {p.station}
                </span>
              ))}
            </div>

            <div className="relative mt-3 h-px bg-[#2a0610]/20">
              <span className="js-fill absolute inset-0 origin-left bg-[#ff6f3c]" />

              {/* station ticks */}
              {[0, 50, 100].map((x) => (
                <span
                  key={x}
                  className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[#2a0610]/40"
                  style={{ left: `${x}%` }}
                />
              ))}

              {/* the dot */}
              <span
                aria-hidden
                className="js-dot absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6f3c] shadow-[0_0_0_5px_#fff9eb,0_0_14px_rgba(255,111,60,0.6)]"
                style={{ left: "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}