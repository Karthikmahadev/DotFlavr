"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────────── data ───────────────────────── */

const PHASES = [
  { num: "01", title: "Think", desc: "Problem framing, benchmark scoping, consumer organoleptics, and ingredient feasibility before touching laboratory glassware.", focus: "Market matrix & FSSAI bounds" },
  { num: "02", title: "Discuss", desc: "Rigorous peer and scientist critique. Deconstruct formulation hurdles, regulatory boundaries (FSSAI/FDA), and unit COGS reality checks.", focus: "COGS, claims & preservatives" },
  { num: "03", title: "Build", desc: "Physical benchtop prototyping. Fine-tune water activity (aw), pH equilibrium, humectant binding, texture profile, and thermal pilot trials.", focus: "45-day accelerated stability" },
  { num: "04", title: "Present", desc: "Structured sensory evaluation panels, commercial batch documentation dossiers, and handover to industrial contract manufacturers.", focus: "Co-packer spec sheet delivery" },
];

const COHORTS = [
  { tag: "Cohort 01", category: "Academia to lab", title: "Students & Food Science Graduates", desc: "Move beyond academic theory into applied benchtop science. Master industry tools, sensory panels, food rheology, and complete pilot dossier formulation to create a portfolio that hiring food companies fight over.", highlight: "Real benchtop trials • Dossier formulation" },
  { tag: "Cohort 02", category: "Professional upscale", title: "Early & Mid-Career Food Technologists", desc: "Upskill in modern clean-label replacement strategies, retort and hot-fill thermodynamics, packaging barrier migration checks, and co-packer plant scaling protocols.", highlight: "Clean-label hydrocolloids • Retort mastery" },
  { tag: "Cohort 03", category: "Founders & operators", title: "Food Entrepreneurs & D2C Founders", desc: "Translate kitchen recipes into commercial formulations with validated 6–12 month shelf-life, certified FSSAI nutritional labeling, and unit-economic viable COGS that scale smoothly.", highlight: "Zero-spoilage engineering • Pilot run readiness" },
  { tag: "Cohort 04", category: "Colleges & institutes", title: "Colleges & Academic Institutions", desc: "Complement existing curricula with pragmatic industry casework, formulation challenges, live pilot runs, and guest masterclasses from seasoned food R&D directors.", highlight: "Hands-on module integration • Faculty immersion" },
];

const SPECS_1 = [
  ["Duration", "1 month hybrid"],
  ["Workshops", "6 live masterclasses"],
  ["Practical lab", "2 bench sprints"],
  ["Batch size", "Strictly 8–10 seats"],
  ["All-inclusive fee", "₹2,500"],
  ["Credential", "Dot Flavr certificate"],
];

const KIT = [
  ["Trial ingredient kit", "shipped to your doorstep with standardised benchmark ingredients."],
  ["Digital formulation dossier", "Brix/pH balancing sheets, aw calculators and COGS formulas."],
  ["Direct feedback", "from Dot Flavr food technologists on your formulation sample submissions."],
];

const MILESTONES = [
  { wk: "Week 1–2", t: "Raw sourcing & benchtop feasibility", d: "Active ingredient chemistry, moisture profiling, and raw supplier vetting." },
  { wk: "Week 3–4", t: "Stabilisation & sensory panels", d: "Thermal death curves, humectants, water activity (aw < 0.65 thresholding), and clean binding." },
  { wk: "Week 5–6", t: "Factory pilot run handover", d: "Machine clearance, line yield calculation, and full FSSAI/COGS dossier sign-off." },
];

const AUDIENCES = [
  { title: "For Universities & Colleges", desc: "Semester-long applied formulation modules, benchtop immersion workshops, and student placement pipelines." },
  { title: "For Ingredient Manufacturers", desc: "Feature your novel hydrocolloids, botanical extracts, or clean fibres in active student and founder formulation batches." },
  { title: "For Co-Packers & Processors", desc: "Receive standardised, line-validated pilot batches that run with zero line jams or separation issues." },
];

/* ───────────────────────── small pieces ───────────────────────── */

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 font-spacemono text-[11px] uppercase tracking-[0.22em] ${
        dark ? "text-[#ffb08a]" : "text-[#2a0610]/65"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
      {children}
    </p>
  );
}

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6f3c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-1 shrink-0">
      <path d="M3 13.5 9 19 21 4.5" />
    </svg>
  );
}

function Stamp({ id, text, className = "" }: { id: string; text: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="#ff6f3c" />
      <g className="js-stamp" style={{ transformOrigin: "100px 100px" }}>
        <text fontSize="15" fontWeight="700" letterSpacing="3" fill="#fff9eb">
          <textPath href={`#${id}`} textLength="470" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="8" fill="#fff9eb" />
    </svg>
  );
}

function Print({
  src,
  alt,
  fig,
  title,
  note,
  className = "",
  ratio,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  fig: string;
  title: string;
  note?: string;
  className?: string;
  ratio: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure className={`js-print relative bg-white p-2.5 pb-3 shadow-[0_30px_60px_-28px_rgba(42,6,16,0.5)] sm:p-3 ${className}`}>
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] bg-[#ffb08a]/60"
      />
      <div className={`relative overflow-hidden bg-[#3b0c18] ${ratio}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 px-0.5">
        <span className="font-newsreader text-[1.02rem] italic leading-snug text-[#2a0610]">{title}</span>
        <span className="shrink-0 pt-1 font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#2a0610]/45">
          {fig}
          {note ? ` · ${note}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function FoodTablePage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Generic reveals
        gsap.utils.toArray<HTMLElement>(".js-rv").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              clearProps: "all",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }
          );
        });

        // Hero headline lines rise through a mask.
        gsap.fromTo(
          ".js-h-line",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.1 }
        );

        // Prints wipe open.
        gsap.utils.toArray<HTMLElement>(".js-print").forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)", y: 30 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              delay: i * 0.08,
              clearProps: "clipPath,y",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }
          );
        });

        // Phase line draws, nodes pop.
        gsap.fromTo(
          ".js-p-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left",
            scrollTrigger: { trigger: ".js-phases", start: "top 80%", end: "bottom 60%", scrub: true },
          }
        );
        gsap.from(".js-p-node", {
          scale: 0,
          duration: 0.6,
          ease: "back.out(2.4)",
          stagger: 0.18,
          scrollTrigger: { trigger: ".js-phases", start: "top 80%", once: true },
        });
        gsap.from(".js-p-item", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.12,
          clearProps: "all",
          scrollTrigger: { trigger: ".js-phases", start: "top 82%", once: true },
        });

        // Cohort cells arrive in a loose order.
        gsap.from(".js-cell", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "all",
          scrollTrigger: { trigger: ".js-cells", start: "top 88%", once: true },
        });

        // Timeline rail draws on programme 02.
        gsap.fromTo(
          ".js-rail",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: { trigger: ".js-rail-wrap", start: "top 75%", end: "bottom 65%", scrub: true },
          }
        );

        // Stamps turn slowly.
        gsap.to(".js-stamp", { rotation: 360, duration: 26, ease: "none", repeat: -1 });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="w-full overflow-x-clip bg-[#fff9eb] text-[#2a0610] selection:bg-[#ff6f3c] selection:text-white"
    >
      {/* ──────────────── 1. HERO ──────────────── */}
      <section className="relative px-6 pb-24 pt-28 md:px-12 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <Label>Dot Flavr community &amp; learning lab</Label>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,9.4vw,9rem)] font-medium leading-[0.88] tracking-[-0.05em]">
            <span className="block overflow-hidden py-[0.05em]">
              <span className="js-h-line block">Where the food</span>
            </span>
            <span className="block overflow-hidden py-[0.05em]">
              <span className="js-h-line block">
                industry <em className="text-[#ff6f3c]">comes together.</em>
              </span>
            </span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <p className="js-rv font-newsreader text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.4] text-[#2a0610]/85 lg:col-span-7">
              Bridging the gap between food science theory, benchtop craft, and commercial reality.
              An open collaborative table for aspiring food technologists, product developers,
              ambitious founders, and industry leaders.
            </p>
            <div className="js-rv flex flex-col items-start gap-5 lg:col-span-5 lg:items-end lg:justify-end">
              <Link
                href="#programmes"
                className="group inline-flex h-12 items-center gap-3 bg-[#2a0610] px-7 text-[14px] font-semibold text-[#fff9eb] transition-colors duration-300 hover:bg-[#ff6f3c]"
              >
                Explore programmes
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </Link>
              <Link
                href="#collaborate"
                className="text-[14px] underline decoration-[#2a0610]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]"
              >
                For colleges &amp; industry →
              </Link>
            </div>
          </div>

          {/* Pinned prints */}
          <div className="mt-20 items-start grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            <Print
              className="md:col-span-7 lg:-rotate-[1deg]"
              src="/images/work/01.jpg"
              alt="Precision benchtop formulation trials"
              fig="Fig. 01"
              note="Batch 04-R"
              title="Benchtop formulation: pH, water activity and emulsion stability."
              ratio="aspect-[16/11]"
              priority
              sizes="(min-width:1024px) 700px, 100vw"
            />
            <div className="flex flex-col gap-10 md:col-span-5 md:pt-14">
              <Print
                className="lg:rotate-[1.2deg]"
                src="/images/work/02.jpg"
                alt="Citrus and fibre pectin trials"
                fig="Fig. 02"
                title="Citrus & fibre pectin cross-linking."
                ratio="aspect-[16/10]"
                sizes="(min-width:1024px) 480px, 100vw"
              />
              <Print
                className="md:ml-8 lg:-rotate-[0.8deg]"
                src="/images/work/03.jpg"
                alt="Sensory evaluation panels"
                fig="Fig. 03"
                title="Target sweetness & texture curve."
                ratio="aspect-[16/10]"
                sizes="(min-width:1024px) 480px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. CONTEXT & 4-PHASE PROCESS ──────────────── */}
      <section className="border-t border-[#2a0610]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="js-rv max-w-3xl">
            <Label>01 / The context &amp; gap</Label>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,4.8vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
              Bridging the gap between food science theory and{" "}
              <em className="text-[#ff6f3c]">real-world commercial scale.</em>
            </h2>
            <p className="mt-7 max-w-2xl text-[16px] leading-[1.7] text-[#2a0610]/75">
              Before products succeed on supermarket shelves or cold-chain distribution, they
              encounter a silent failure zone. University programmes emphasise textbook equations
              and Petri dishes; domestic kitchens produce delicious samples that separate inside
              commercial retort autoclaves. The Food Table was established by Dot Flavr to replace
              trial-and-error guesswork with industrial R&amp;D rigour.
            </p>
          </div>

          <div className="js-phases relative mt-20 grid gap-x-8 lg:grid-cols-4">
            <span aria-hidden className="absolute left-0 right-0 top-0 hidden h-px bg-[#2a0610]/15 lg:block" />
            <span aria-hidden className="js-p-line absolute left-0 right-0 top-0 hidden h-px bg-[#ff6f3c] lg:block" />

            {PHASES.map((p) => (
              <article
                key={p.num}
                className="js-p-item relative border-l border-[#2a0610]/15 pb-12 pl-7 last:pb-0 lg:border-l-0 lg:pb-0 lg:pl-0 lg:pt-10"
              >
                <span
                  aria-hidden
                  className="js-p-node absolute -left-[6px] top-1 h-3 w-3 rounded-full bg-[#ff6f3c] ring-4 ring-[#fff9eb] lg:left-0 lg:top-0 lg:-translate-y-1/2"
                />
                <p className="font-display text-[clamp(3.4rem,5vw,5rem)] font-medium leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(42,6,16,0.35)]">
                  {p.num}
                </p>
                <h3 className="mt-4 font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#2a0610]/70">{p.desc}</p>
                <p className="mt-5 border-t border-[#2a0610]/15 pt-3 font-spacemono text-[10px] uppercase tracking-[0.16em] text-[#2a0610]/55">
                  Focus · <span className="text-[#ff6f3c]">{p.focus}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 3. FOUR COHORTS ──────────────── */}
      <section className="border-t border-[#2a0610]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="js-rv flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Label>02 / Community cohorts</Label>
              <h2 className="mt-5 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-medium leading-[0.94] tracking-[-0.045em]">
                Four cohorts.
                <br />
                <em className="text-[#ff6f3c]">One unified bench.</em>
              </h2>
            </div>
            <p className="max-w-[22rem] text-[15px] leading-[1.65] text-[#2a0610]/70 md:pb-2">
              Designed for those who want to turn conceptual culinary ideas into stable, safe, and
              commercialisable packaged goods.
            </p>
          </div>

          <div className="js-cells mt-16 grid border-l border-t border-[#2a0610]/20 md:grid-cols-2">
            {COHORTS.map((c, i) => (
              <article
                key={c.tag}
                className="js-cell group relative flex flex-col justify-between overflow-hidden border-b border-r border-[#2a0610]/20 p-7 transition-colors duration-500 hover:bg-[#2a0610] hover:text-[#fff9eb] sm:p-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-6 font-display text-[9rem] font-medium leading-none tracking-[-0.06em] text-[#2a0610]/[0.05] transition-colors duration-500 group-hover:text-[#ff6f3c]/20"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <p className="flex items-center justify-between gap-4 font-spacemono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-[#ff6f3c]">{c.tag}</span>
                    <span className="text-[#2a0610]/50 transition-colors group-hover:text-[#fff9eb]/55">
                      {c.category}
                    </span>
                  </p>
                  <h3 className="mt-6 max-w-[22rem] font-display text-[clamp(1.7rem,2.5vw,2.3rem)] font-medium leading-[1.02] tracking-[-0.035em]">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[30rem] text-[14px] leading-[1.7] text-[#2a0610]/70 transition-colors group-hover:text-[#fff9eb]/75">
                    {c.desc}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-current/15 pt-4">
                  <span className="font-newsreader text-[1rem] italic text-[#2a0610]/65 transition-colors group-hover:text-[#ffb08a]">
                    {c.highlight}
                  </span>
                  <Link
                    href="/#contact"
                    className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold outline-none transition-colors group-hover:text-[#ff6f3c] focus-visible:text-[#ff6f3c]"
                  >
                    Learn more
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 4. PROGRAMME 01 ──────────────── */}
      <section id="programmes" className="px-6 py-16 md:px-12 lg:px-16">
        <div className="js-rv relative mx-auto max-w-[1240px] bg-[#f5e8c8] p-3 shadow-[0_40px_80px_-40px_rgba(42,6,16,0.35)] sm:p-4">
          <Stamp
            id="stamp-p1"
            text="LIMITED SEATS • 8–10 PER BATCH • LIMITED SEATS • 8–10 PER BATCH •"
            className="absolute -top-9 right-6 z-10 h-24 w-24 sm:right-12 sm:h-28 sm:w-28"
          />

          <div className="border border-dashed border-[#2a0610]/35 p-6 sm:p-10 md:p-14">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <Label>Programme 01 · Foundational immersion</Label>
                <h2 className="mt-5 font-display text-[clamp(2.3rem,4.4vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
                  Explore Series:
                  <br />
                  <em className="text-[#ff6f3c]">Food tech &amp; formulation</em> fundamentals
                </h2>
                <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#2a0610]/75">
                  An intensive one-month hybrid immersion designed to build solid muscle memory in
                  recipe scale-up, water activity thresholds, clean-label binders, and sensory
                  evaluation matrices.
                </p>

                <dl className="mt-10 grid border-t border-[#2a0610]/25 sm:grid-cols-2">
                  {SPECS_1.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 border-b border-[#2a0610]/25 py-3.5 sm:odd:pr-6 sm:even:pl-6 sm:even:border-l sm:even:border-[#2a0610]/25">
                      <dt className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#2a0610]/55">{k}</dt>
                      <dd className="text-right font-display text-[1.1rem] font-medium tracking-[-0.02em]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href="/#contact"
                    className="inline-flex h-12 items-center bg-[#2a0610] px-7 text-[14px] font-semibold text-[#fff9eb] transition-colors duration-300 hover:bg-[#ff6f3c]"
                  >
                    Apply for next cohort
                  </Link>
                  <Link
                    href="/#contact"
                    className="text-[14px] underline decoration-[#2a0610]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]"
                  >
                    View curriculum details →
                  </Link>
                </div>
              </div>

              <aside className="bg-[#fff9eb] p-7 shadow-[0_20px_50px_-30px_rgba(42,6,16,0.4)] sm:p-8 lg:col-span-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-spacemono text-[10px] uppercase tracking-[0.2em] text-[#ff6f3c]">Next cohort</p>
                    <p className="mt-1 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.025em]">
                      Starting the first Saturday of the month
                    </p>
                  </div>
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                </div>

                <p className="mt-7 font-newsreader text-[1.05rem] italic text-[#2a0610]/60">In the kit</p>
                <ul className="mt-3 divide-y divide-[#2a0610]/15 border-y border-[#2a0610]/15">
                  {KIT.map(([b, rest]) => (
                    <li key={b} className="flex gap-3 py-4 text-[14px] leading-[1.6] text-[#2a0610]/75">
                      <Tick />
                      <span>
                        <strong className="font-semibold text-[#2a0610]">{b}:</strong> {rest}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#2a0610]/70">
                  Scholarships available for students
                  <Link href="/#contact" className="font-semibold text-[#2a0610] underline decoration-[#ff6f3c] underline-offset-4 hover:text-[#ff6f3c]">
                    Inquire here
                  </Link>
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. PROGRAMME 02 ──────────────── */}
      <section className="px-6 py-16 md:px-12 lg:px-16">
        <div className="js-rv mx-auto max-w-[1240px] bg-[#2a0610] p-8 text-[#fff9eb] shadow-[0_50px_90px_-40px_rgba(42,6,16,0.7)] sm:p-12 md:p-16">
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Label dark>Programme 02 · Intensive benchtop fellowship</Label>
              <p className="mt-5 inline-block border border-[#ff6f3c]/60 px-3 py-1 font-spacemono text-[10px] uppercase tracking-[0.2em] text-[#ff6f3c]">
                Strictly 2–4 fellows per track
              </p>

              <h2 className="mt-6 font-display text-[clamp(2.4rem,4.8vw,4.4rem)] font-medium leading-[0.96] tracking-[-0.045em]">
                Industry immersion:
                <br />
                <em className="text-[#ff6f3c]">commercial product development</em>
              </h2>

              <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#fff9eb]/75">
                A hands-on, high-intensity laboratory fellowship. Co-develop an actual commercial SKU
                under Dot Flavr&rsquo;s R&amp;D directors, from bench chemistry and water activity
                testing to pilot runs on industrial retort and extrusion machinery.
              </p>

              <div className="mt-10 grid items-end gap-8 border-y border-[#fff9eb]/20 py-8 sm:grid-cols-[1fr_auto]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#fff9eb]/50">Intensive duration</p>
                    <p className="mt-1 font-display text-[1.25rem] font-medium tracking-[-0.02em]">45 days applied</p>
                  </div>
                  <div>
                    <p className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#fff9eb]/50">Cohort capacity</p>
                    <p className="mt-1 font-display text-[1.25rem] font-medium tracking-[-0.02em]">2–4 fellows max</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#fff9eb]/50">Programme fee</p>
                  <p className="font-display text-[clamp(3rem,5vw,4.6rem)] font-medium leading-none tracking-[-0.05em] text-[#ff6f3c]">
                    ₹7,500
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
                <Link
                  href="/#contact"
                  className="inline-flex h-12 items-center bg-[#ff6f3c] px-7 text-[14px] font-semibold text-[#2a0610] transition-colors duration-300 hover:bg-[#fff9eb]"
                >
                  Submit application dossier
                </Link>
                <span className="font-newsreader text-[1.05rem] italic text-[#fff9eb]/60">
                  Selection by screening &amp; portfolio interview
                </span>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <p className="font-spacemono text-[10px] uppercase tracking-[0.22em] text-[#ffb08a]">Fellowship milestones</p>

              <div className="js-rail-wrap relative mt-7 pl-9">
                <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-[#fff9eb]/15" />
                <span aria-hidden className="js-rail absolute bottom-2 left-[7px] top-2 w-px bg-[#ff6f3c]" />

                <ol className="space-y-10">
                  {MILESTONES.map((m) => (
                    <li key={m.wk} className="relative">
                      <span aria-hidden className="absolute -left-9 top-1 h-[15px] w-[15px] rounded-full border-2 border-[#ff6f3c] bg-[#2a0610]" />
                      <p className="font-spacemono text-[10px] uppercase tracking-[0.2em] text-[#ff6f3c]">{m.wk}</p>
                      <p className="mt-1.5 font-display text-[1.3rem] font-medium leading-tight tracking-[-0.025em]">{m.t}</p>
                      <p className="mt-1.5 text-[14px] leading-[1.6] text-[#fff9eb]/65">{m.d}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-10 flex items-center justify-between gap-4 border-t border-[#fff9eb]/20 pt-4 font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#ffb08a]">
                <span>Outcome: market-ready SKU</span>
                <span>100% IP protected</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ──────────────── 6. COLLABORATION ──────────────── */}
      <section id="collaborate" className="mt-16 border-t border-[#2a0610]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1240px] items-start gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="js-rv lg:col-span-6 lg:sticky lg:top-28">
            <Label>03 / Collaboration</Label>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5.2vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.045em]">
              Let&rsquo;s create more <em className="text-[#ff6f3c]">meaningful industry experiences.</em>
            </h2>
            <p className="mt-7 max-w-lg text-[16px] leading-[1.7] text-[#2a0610]/75">
              Are you an ingredient supplier seeking application development? A university dean
              looking to bridge academia with actual commercial benchwork? Or a co-packer searching
              for trial-tested client formulations? We actively co-design custom learning modules,
              factory tours, and sponsored innovation briefs.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/#contact"
                className="group inline-flex h-12 items-center gap-3 bg-[#2a0610] px-7 text-[14px] font-semibold text-[#fff9eb] transition-colors duration-300 hover:bg-[#ff6f3c]"
              >
                Partner with us
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="mailto:hello@dotflavr.com"
                className="text-[14px] underline decoration-[#2a0610]/30 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]"
              >
                hello@dotflavr.com
              </a>
            </div>
          </div>

          <ul className="lg:col-span-6">
            {AUDIENCES.map((a, i) => (
              <li key={a.title} className="js-rv group border-t border-[#2a0610]/20 last:border-b">
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-8 sm:grid-cols-[3.5rem_1fr]">
                  <span className="pt-1.5 font-spacemono text-[11px] text-[#ff6f3c]">{String(i + 1).padStart(2, "0")}</span>
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[1.02] tracking-[-0.035em] transition-colors duration-300 group-hover:text-[#ff6f3c]">
                      {a.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[14px] leading-[1.65] text-[#2a0610]/70">{a.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}