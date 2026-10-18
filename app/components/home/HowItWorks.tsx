"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ───────────────────────── data ───────────────────────── */

const STEPS = [
  {
    n: "1",
    title: "Ideation & Feasibility",
    body: "Ingredient selection, regulatory compliance, nutrition profiling, and initial benchmark mapping.",
  },
  {
    n: "2",
    title: "Formulation & Trials",
    body: "Recipe engineering, sensory evaluation, flavor balancing, and active benchtop trial iterations.",
  },
  {
    n: "3",
    title: "Shelf-Life & Stability",
    body: "Water activity testing, microbial analysis, barrier packaging checks, and accelerated aging studies.",
  },
  {
    n: "4",
    title: "Scale-Up & Commercialization",
    body: "Factory pilot runs, COGS optimization, ingredient vendor sourcing, and final retail packaging handover.",
  },
];

// Replaced clinical biomarkers with Food R&D Lab Formulation Parameters
const DATA_ROWS = [
  "Batch Master",
  "Brix / Acidity",
  "Moisture Level",
  "Water Activity (aw)",
  "Texture Profile",
  "Sensory Score",
  "Preservative Load",
];

// Replaced clinical actions with Food Product Development Bench Milestones
const ACTIONS = [
  { name: "Clean-Label Binding", sub: "Optimizes texture without synthetic gums" },
  { name: "Sensory & Sweetness Curve", sub: "Natural flavor recovery & taste balancing" },
  { name: "Barrier Foil Packaging", sub: "Prevents moisture migration & oxidation" },
];

/* ───────────────────────── small pieces ───────────────────────── */

function Badge({ n, dark = false }: { n: string; dark?: boolean }) {
  return (
    <span
      className={`absolute left-3 top-3 z-20 grid h-6 w-6 place-items-center rounded-md text-[11px] font-semibold backdrop-blur-md ${
        dark ? "bg-black/10 text-neutral-800" : "bg-black/35 text-white"
      }`}
    >
      {n}
    </span>
  );
}

function Glass({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-black/45 text-white shadow-xl backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

function Photo({ src, tone }: { src: string; tone: string }) {
  return (
    <>
      <div className={`absolute inset-0 ${tone}`} />
      <Image
        src={src}
        alt="Food product development and formulation"
        fill
        sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
        className="js-photo object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
    </>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: root.current, start: "top 70%", once: true };

        // Heading
        gsap.from(".js-head", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: trigger,
        });

        // Cards rise in one after another
        gsap.from(".js-card", {
          autoAlpha: 0,
          y: 50,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { ...trigger, start: "top 60%" },
        });

        // Photos settle from a slight zoom
        gsap.from(".js-photo", {
          scale: 1.18,
          duration: 1.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { ...trigger, start: "top 60%" },
        });

        const after = { ...trigger, start: "top 55%" };

        // Card 1: Feasibility Approved notification pill + tick
        gsap.from(".js-pill", {
          autoAlpha: 0,
          y: 16,
          scale: 0.94,
          duration: 0.9,
          ease: "back.out(1.5)",
          delay: 0.5,
          scrollTrigger: after,
        });
        gsap.from(".js-tick", {
          scale: 0,
          duration: 0.6,
          ease: "back.out(2.4)",
          delay: 1.1,
          scrollTrigger: after,
        });

        // Card 2: Phone mock slides up, rows stagger, sensory score counts up to 94
        gsap.from(".js-phone", {
          yPercent: 18,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.4,
          scrollTrigger: after,
        });
        gsap.from(".js-row", {
          autoAlpha: 0,
          x: -8,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          delay: 1,
          scrollTrigger: after,
        });
        const counter = { v: 0 };
        gsap.to(counter, {
          v: 94,
          duration: 1.8,
          ease: "power2.out",
          delay: 1,
          scrollTrigger: after,
          onUpdate: () => {
            const el = root.current?.querySelector(".js-score");
            if (el) el.textContent = String(Math.round(counter.v));
          },
        });

        // Card 3: action rows slide in
        gsap.from(".js-action", {
          autoAlpha: 0,
          x: 14,
          duration: 0.7,
          stagger: 0.14,
          ease: "expo.out",
          delay: 0.9,
          scrollTrigger: after,
        });

        // Card 4: Shelf stability curve draws left to right
        gsap.fromTo(
          ".js-line",
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.8,
            ease: "power2.inOut",
            delay: 0.8,
            scrollTrigger: after,
          }
        );
        gsap.from(".js-dot", {
          scale: 0,
          duration: 0.5,
          ease: "back.out(2.4)",
          stagger: 0.6,
          delay: 0.9,
          scrollTrigger: after,
        });
        gsap.from(".js-retest", {
          autoAlpha: 0,
          y: 8,
          duration: 0.6,
          ease: "expo.out",
          delay: 2.3,
          scrollTrigger: after,
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="bg-white px-5 py-24 font-jakarta text-neutral-900 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Heading */}
        <div className="mb-14 text-center md:mb-16">
          <p className="js-head text-xs font-semibold uppercase tracking-widest text-[#ff6f3c]">
            Consulting Methodology
          </p>
          <h2 className="js-head mt-2 text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-[#800020]">
            How we develop food products
          </h2>
          <p className="js-head mt-3 text-sm text-neutral-500">
            From raw bench concept to production line trials and shelf-ready commercial launch.
          </p>
        </div>

        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── 1 · Ideation & Feasibility ── */}
          <article className="js-card group">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Photo src="/images/ingredients.jpg" tone="bg-gradient-to-br from-[#d9b8a0] to-[#8a6a55]" />
              <Badge n="1" />
              <Glass className="js-pill absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center gap-3 px-3.5 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#ff6f3c]/25 text-[#ff6f3c]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium leading-tight">
                    Feasibility Confirmed
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-white/70">
                    FSSAI Compliance &amp; Nutritional Target
                  </span>
                </span>
                <span className="js-tick grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff6f3c] text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
              </Glass>
            </div>
            <Caption {...STEPS[0]} />
          </article>

          {/* ── 2 · Formulation & Trials (Lab Spec Mockup) ── */}
          <article className="js-card group">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4f2ee]">
              <Badge n="2" dark />
              <div className="js-phone absolute inset-x-[14%] bottom-0 top-[11%] overflow-hidden rounded-t-[1.6rem] border border-b-0 border-black/10 bg-white px-3.5 pt-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:-translate-y-1.5">
                <div className="flex items-center justify-between text-[7px] font-semibold text-neutral-700">
                  <span>DOT FLAVR</span>
                  <span className="font-bold tracking-wide text-[#800020]">R&amp;D LAB</span>
                  <span className="flex gap-0.5">
                    <i className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
                    <i className="h-1.5 w-1.5 rounded-full bg-[#800020]" />
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-1.5">
                  <div>
                    <p className="text-[11px] font-semibold leading-none text-[#800020]">Trial Spec #04</p>
                    <p className="mt-0.5 text-[6px] text-neutral-400">Benchtop formulation matrix</p>
                    <ul className="mt-2.5 space-y-[4.5px]">
                      {DATA_ROWS.map((r, i) => (
                        <li
                          key={r}
                          className={`js-row flex items-center gap-1.5 rounded px-1 py-[2px] text-[7px] ${
                            i === 0 ? "bg-[#fff9eb] font-semibold text-[#800020]" : "text-neutral-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full border ${
                              i === 0 ? "border-[#800020] bg-[#800020]" : "border-[#ff6f3c] bg-[#ff6f3c]"
                            }`}
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clean beaker / test flask graphic */}
                  <div className="relative mr-1 mt-4 flex w-10 flex-col items-center justify-center opacity-85" aria-hidden>
                    <span className="h-4 w-2 rounded-t bg-neutral-200" />
                    <span className="h-14 w-8 rounded-b-xl border border-neutral-300 bg-[#fff9eb] flex items-end p-1">
                      <span className="h-7 w-full rounded-b bg-[#ff6f3c]/25 border-t border-[#ff6f3c]" />
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-end gap-5 border-t border-neutral-100 pt-2.5">
                  <div>
                    <p className="flex items-baseline gap-px text-[15px] font-semibold leading-none text-[#800020]">
                      <span className="js-score">94</span>
                      <span className="text-[8px] text-neutral-400">/100</span>
                    </p>
                    <p className="mt-1 text-[6px] text-neutral-400">Sensory acceptance</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold leading-none text-[#ff6f3c]">4.8 pH</p>
                    <p className="mt-1 text-[6px] text-neutral-400">Target equilibrium</p>
                  </div>
                </div>
              </div>
            </div>
            <Caption {...STEPS[1]} />
          </article>

          {/* ── 3 · Shelf-Life & Stability (Intervention Protocols) ── */}
          <article className="js-card group">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Photo src="/images/formulation-trials.jpg" tone="bg-gradient-to-br from-[#c98a5a] to-[#5b3a28]" />
              <Badge n="3" />
              <Glass className="absolute inset-x-3 bottom-3 overflow-hidden p-0">
                <p className="border-b border-white/10 px-3 py-2 text-[9px] font-medium text-white/80">
                  Critical Stability Interventions
                </p>
                <ul className="divide-y divide-white/10">
                  {ACTIONS.map((a, i) => (
                    <li key={a.name} className="js-action flex items-center gap-2.5 px-3 py-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-[#ff6f3c]/30 text-[9px] font-semibold text-[#ff6f3c]">
                        0{i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-medium leading-tight">
                          {a.name}
                        </span>
                        <span className="block truncate text-[8px] text-white/60">{a.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Glass>
            </div>
            <Caption {...STEPS[2]} />
          </article>

          {/* ── 4 · Scale-Up & Commercialization (Shelf Stability Curve) ── */}
          <article className="js-card group">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Photo src="/images/image1.avif" tone="bg-gradient-to-br from-[#d8c9b0] to-[#7a6a52]" />
              <Badge n="4" />
              <Glass className="absolute inset-x-3 bottom-3 h-[56%] p-3">
                {/* Guide lines */}
                <span className="absolute inset-x-3 top-[28%] border-t border-dashed border-white/25" />
                <span className="absolute left-3 top-[28%] -translate-y-full pb-0.5 text-[7px] text-white/60">
                  Target Retort / Shelf Line
                </span>
                <span className="absolute inset-x-3 top-[66%] border-t border-dashed border-white/25" />

                {/* The growth/stability trajectory line */}
                <div className="absolute inset-x-5 bottom-8 top-4">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="js-line absolute inset-0 h-full w-full overflow-visible"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="food-curve" x1="0" x2="1">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
                        <stop offset="0.5" stopColor="#ff6f3c" />
                        <stop offset="1" stopColor="#ffb347" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 88 L48 58 L100 14"
                      fill="none"
                      stroke="url(#food-curve)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <span className="js-dot absolute left-0 top-[88%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40" />
                  <span className="js-dot absolute left-[48%] top-[58%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6f3c] shadow-[0_0_10px_rgba(255,111,60,0.8)]" />
                  <span className="js-dot absolute left-full top-[14%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb347] shadow-[0_0_10px_rgba(255,179,71,0.9)]" />
                </div>

                <span className="js-retest absolute right-3 top-[-14px] rounded-md bg-[#800020] px-2 py-1 text-[8px] font-semibold text-white shadow-md">
                  Scale-Ready ✓
                </span>

                <div className="absolute inset-x-3 bottom-2.5 flex justify-between text-[8px] text-white/70">
                  <span>Lab Trial</span>
                  <span>Pilot Factory Run</span>
                  <span>Retail Shelf</span>
                </div>
              </Glass>
            </div>
            <Caption {...STEPS[3]} />
          </article>
        </div>
      </div>
    </section>
  );
}

function Caption({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-[#800020]">{title}</h3>
      <p className="mt-1.5 max-w-[17rem] text-[13px] leading-snug text-neutral-600">{body}</p>
    </>
  );
}