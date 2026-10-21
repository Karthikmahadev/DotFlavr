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
  { num: "01", title: "Think", desc: "Identify food product opportunities, understand consumer needs and assess feasibility.", focus: "Market matrix & FSSAI bounds" },
  { num: "02", title: "Discuss", desc: "Exchange ideas, challenge assumptions and explore technical and commercial considerations.", focus: "COGS, claims & preservatives" },
  { num: "03", title: "Build", desc: "Develop prototypes, conduct trials and evaluate product quality through hands-on experimentation.", focus: "Bench stability & trials" },
  { num: "04", title: "Present", desc: "Present outcomes, document learnings and communicate product concepts with industry context.", focus: "Documentation & handover" },
];

const COHORTS = [
  { tag: "Cohort 01", category: "Practical learning", title: "Students & Graduates", desc: "Build practical skills through food product development, hands-on trials and industry-oriented learning.", highlight: "Practical learning • Product development" },
  { tag: "Cohort 02", category: "Technical upskilling", title: "Food Professionals", desc: "Strengthen skills in formulation, product quality, shelf-life assessment and process improvement.", highlight: "Technical upskilling • Applied food science" },
  { tag: "Cohort 03", category: "Commercial readiness", title: "Food Entrepreneurs & Founders", desc: "Turn food ideas into viable products through formulation support, product trials and scale-up guidance.", highlight: "Product development • Commercial readiness" },
  { tag: "Cohort 04", category: "Academic collaboration", title: "Colleges & Institutions", desc: "Connect classroom learning with practical projects, expert-led sessions and industry-relevant challenges.", highlight: "Academic collaboration • Industry engagement" },
];

const AUDIENCES = [
  { title: "Universities & Colleges", desc: "Exploring opportunities for student learning, hands-on experiences, and industry interaction." },
  { title: "Restaurants, Cafés & Cloud Kitchens", desc: "Exploring recipe ideas, flavour combinations, menu concepts, and new food possibilities." },
  { title: "Food Startups & Emerging Brands", desc: "Exchanging ideas around product concepts, formulation, and food innovation." },
  { title: "Aspiring Founders", desc: "Have a food idea you’ve been thinking about? Let’s explore possibilities and see where it could lead." },
];

/* ───────────────────────── small pieces ───────────────────────── */

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${
        dark ? "text-[#ffb08a]" : "text-[#800020]/75"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
      {children}
    </p>
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
    <figure className={`js-print relative bg-white p-2.5 pb-3 shadow-[0_30px_60px_-28px_rgba(128,0,32,0.35)] sm:p-3 ${className}`}>
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] bg-[#ffb08a]/60 shadow-sm"
      />
      <div className={`relative overflow-hidden bg-[#800020] ${ratio}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 px-0.5">
        <span className="font-serif text-[1.025rem] italic leading-snug text-[#800020]">{title}</span>
        <span className="shrink-0 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#800020]/50">
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
        // Hero headline lines rise through a mask.
        gsap.fromTo(
          ".js-h-line",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.3, ease: "power3.out", stagger: 0.1, delay: 0.1 }
        );

        // Prints wipe open.
        gsap.utils.toArray<HTMLElement>(".js-print").forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)", y: 25 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 1.1,
              ease: "power2.out",
              delay: i * 0.06,
              clearProps: "clipPath,y",
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
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
            scrollTrigger: { trigger: ".js-phases", start: "top 90%", end: "bottom 50%", scrub: true },
          }
        );
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="w-full overflow-x-clip bg-[#fff9eb] text-[#800020] selection:bg-[#ff6f3c] selection:text-white"
    >
      {/* ──────────────── 1. HERO ──────────────── */}
      <section className="relative px-6 pb-24 pt-28 md:px-12 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <Label>Dot Flavr community &amp; learning lab</Label>

          <h1 className="mt-8 font-serif text-[clamp(3rem,8.8vw,8.5rem)] font-normal leading-[0.9] tracking-[-0.04em]">
            <span className="block overflow-hidden py-[0.05em]">
              <span className="js-h-line block">Where food science</span>
            </span>
            <span className="block overflow-hidden py-[0.05em]">
              <span className="js-h-line block">
                meets <em className="italic text-[#ff6f3c]">real-world practice.</em>
              </span>
            </span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <p className="font-serif text-[clamp(1.15rem,1.6vw,1.5rem)] leading-[1.5] text-[#800020]/80 lg:col-span-7">
              A collaborative space for aspiring food technologists to learn, experiment and experience how food products are developed.
            </p>
            <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end lg:justify-end">
              <Link
                href="#programmes"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[#800020] px-7 text-[13px] font-semibold text-[#fff9eb] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6f3c] hover:shadow-lg"
              >
                Explore Programmes
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
              </Link>
              <Link
                href="#collaborate"
                className="text-[13px] font-medium text-[#800020] underline decoration-[#ff6f3c]/45 underline-offset-[6px] transition-colors hover:text-[#ff6f3c]"
              >
                For students &middot; Colleges &middot; Industry &rarr;
              </Link>
            </div>
          </div>

          {/* Pinned prints */}
          <div className="mt-20 grid items-start gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
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
                title="Citrus &amp; fibre pectin cross-linking."
                ratio="aspect-[16/10]"
                sizes="(min-width:1024px) 480px, 100vw"
              />
              <Print
                className="md:ml-8 lg:-rotate-[0.8deg]"
                src="/images/work/03.jpg"
                alt="Sensory evaluation panels"
                fig="Fig. 03"
                title="Target sweetness &amp; texture curve."
                ratio="aspect-[16/10]"
                sizes="(min-width:1024px) 480px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. CONTEXT & 4-PHASE PROCESS ──────────────── */}
      <section className="border-t border-[#800020]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <Label>01 / The context &amp; gap</Label>
            <h2 className="mt-4 font-serif text-[clamp(2.4rem,4.6vw,4.2rem)] font-normal leading-[1.05] tracking-[-0.03em]">
              From food science theory to{" "}
              <em className="italic text-[#ff6f3c]">real-world practice.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.7] text-[#800020]/75 sm:text-[16px]">
              Food science goes beyond textbooks. The Food Table brings students, emerging innovators and industry together to explore product development through practical learning, experimentation and real-world challenges.
            </p>
          </div>

          <div className="js-phases relative mt-20 grid gap-x-8 lg:grid-cols-4">
            <span aria-hidden className="absolute left-0 right-0 top-0 hidden h-px bg-[#800020]/20 lg:block" />
            <span aria-hidden className="js-p-line absolute left-0 right-0 top-0 hidden h-px bg-[#ff6f3c] lg:block" />

            {PHASES.map((p) => (
              <article
                key={p.num}
                className="relative border-l border-[#800020]/20 pb-12 pl-7 last:pb-0 lg:border-l-0 lg:pb-0 lg:pl-0 lg:pt-10"
              >
                <span
                  aria-hidden
                  className="absolute -left-[6px] top-1 h-3 w-3 rounded-full bg-[#ff6f3c] ring-4 ring-[#fff9eb] lg:left-0 lg:top-0 lg:-translate-y-1/2"
                />
                <p className="font-serif text-[clamp(3.2rem,4.6vw,4.6rem)] font-light leading-none tracking-[-0.05em] text-[#800020]/20">
                  {p.num}
                </p>
                <h3 className="mt-4 font-serif text-[1.8rem] font-normal leading-tight tracking-[-0.02em] text-[#800020]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-[#800020]/75">{p.desc}</p>
                <p className="mt-5 border-t border-[#800020]/15 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#800020]/60">
                  Focus &bull; <span className="text-[#ff6f3c]">{p.focus}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 3. FOUR COHORTS ──────────────── */}
      <section className="border-t border-[#800020]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Label>02 / Community cohorts</Label>
              <h2 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.6rem)] font-normal leading-[1.05] tracking-[-0.03em]">
                Four cohorts.
                <br />
                <em className="italic text-[#ff6f3c]">One unified bench.</em>
              </h2>
            </div>
            <p className="max-w-[22rem] text-[15px] leading-[1.65] text-[#800020]/75 md:pb-2">
              A shared space for students, food professionals, founders and institutions to learn, experiment and build better food products.
            </p>
          </div>

          <div className="mt-16 grid border-l border-t border-[#800020]/20 md:grid-cols-2">
            {COHORTS.map((c, i) => (
              <article
                key={c.tag}
                className="group relative flex flex-col justify-between overflow-hidden border-b border-r border-[#800020]/20 p-7 transition-colors duration-500 hover:bg-[#800020] hover:text-[#fff9eb] sm:p-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-6 font-serif text-[9rem] font-light leading-none tracking-[-0.06em] text-[#800020]/[0.05] transition-colors duration-500 group-hover:text-[#ff6f3c]/20"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <p className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-[#ff6f3c]">{c.tag}</span>
                    <span className="text-[#800020]/55 transition-colors group-hover:text-[#fff9eb]/60">
                      {c.category}
                    </span>
                  </p>
                  <h3 className="mt-5 max-w-[22rem] font-serif text-[clamp(1.7rem,2.4vw,2.2rem)] font-normal leading-[1.05] tracking-[-0.02em]">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[30rem] text-[14px] leading-[1.7] text-[#800020]/75 transition-colors group-hover:text-[#fff9eb]/80">
                    {c.desc}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-current/15 pt-4">
                  <span className="font-serif text-[1rem] italic text-[#800020]/70 transition-colors group-hover:text-[#ffb08a]">
                    {c.highlight}
                  </span>
                  <Link
                    href="/#contact"
                    className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold outline-none transition-colors group-hover:text-[#ff6f3c] focus-visible:text-[#ff6f3c]"
                  >
                    Learn more
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 4. PROGRAMME 01 (OPEN BENCH / EXPLORE SERIES) ──────────────── */}
      <section id="programmes" className="px-6 py-16 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-3xl bg-[#590f1d] p-8 text-[#fff9eb] shadow-xl sm:p-12 md:p-16">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffb08a]">
                  THE FOOD TABLE BY DOT FLAVR PRESENTS
                </p>
                <h2 className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]">
                  Open Bench.
                </h2>
                <p className="mt-2 font-serif text-[clamp(1.6rem,2.5vw,2.4rem)] italic text-[#ffb08a]">
                  What if we tried?
                </p>
                <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[#fff9eb]/85 sm:text-[17px]">
                  A space where questions meet ingredients, ideas become experiments, and learning happens by doing.
                </p>
                <div className="mt-10 border-t border-[#fff9eb]/20 pt-8">
                  <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#ffb08a]">
                    THINK &bull; TINKER &bull; TRY
                  </p>
                  <p className="mt-3 font-serif text-[1.35rem] italic text-[#fff9eb]/90">
                    COMING SOON
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. PROGRAMME 02 (BEYOND THE BENCH / INDUSTRY IMMERSION) ──────────────── */}
      <section className="px-6 py-16 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-3xl bg-[#800020] p-8 text-[#fff9eb] shadow-2xl sm:p-12 md:p-16">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffb08a]">
                  THE FOOD TABLE BY DOT FLAVR PRESENTS
                </p>
                <h2 className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]">
                  Beyond the Bench.
                </h2>
                <p className="mt-2 font-serif text-[clamp(1.6rem,2.5vw,2.4rem)] italic text-[#ffb08a]">
                  From food science to food products.
                </p>
                <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[#fff9eb]/85 sm:text-[17px]">
                  A hands-on industry immersion experience exploring ingredient functionality, formulation, product testing, and the journey from an initial concept to a developed food product.
                </p>
                <div className="mt-10 border-t border-[#fff9eb]/20 pt-8">
                  <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#ffb08a]">
                    EXPLORE &bull; DEVELOP &bull; REFINE
                  </p>
                  <p className="mt-3 font-serif text-[1.35rem] italic text-[#fff9eb]/90">
                    PROGRAMME DETAILS COMING SOON
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 6. COLLABORATION (UPDATED CONTENT) ──────────────── */}
      <section id="collaborate" className="mt-16 border-t border-[#800020]/15 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1240px] items-start gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <Label>03 / Collaboration</Label>
            <h2 className="mt-4 font-serif text-[clamp(2.6rem,4.8vw,4.4rem)] font-normal leading-[1.05] tracking-[-0.03em]">
              Let’s explore what we can <em className="italic text-[#ff6f3c]">create together.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.7] text-[#800020]/75 sm:text-[16px]">
              We’re open to connecting with people who share an interest in food, flavour, and new ideas.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/#contact"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#800020] px-7 text-[13px] font-semibold text-[#fff9eb] transition-all duration-300 hover:bg-[#ff6f3c]"
              >
                Let’s connect
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
              <a
                href="mailto:hello@dotflavr.com"
                className="text-[13px] font-medium text-[#800020] underline decoration-[#ff6f3c]/45 underline-offset-[6px] hover:text-[#ff6f3c]"
              >
                hello@dotflavr.com
              </a>
            </div>
          </div>

          <ul className="lg:col-span-6">
            {AUDIENCES.map((a, i) => (
              <li key={a.title} className="group border-t border-[#800020]/20 last:border-b">
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-8 sm:grid-cols-[3.5rem_1fr]">
                  <span className="pt-1.5 font-mono text-[11px] font-bold text-[#ff6f3c]">{String(i + 1).padStart(2, "0")}</span>
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    <h3 className="font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] font-normal leading-[1.05] tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#ff6f3c]">
                      {a.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[14px] leading-[1.65] text-[#800020]/75">{a.desc}</p>
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