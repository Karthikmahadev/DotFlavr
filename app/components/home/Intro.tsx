"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Words } from "../ui/Words";

/* ───────────────────────── data ───────────────────────── */

type IconName = "check" | "sliders" | "cap" | "factory" | "star";

type Seat = {
  id: string;
  zone: string;
  tag: string;
  img: string;
  imgAlt: string;
  badge: string;
  title: string;
  desc: ReactNode;
  r1Label: string;
  r1: string;
  r2Label: string;
  r2: ReactNode;
  status: string;
  icon: IconName;
  pos: string; // xl-only placement of the card wrapper
};

const SEATS: Seat[] = [
  {
    id: "01",
    zone: "Commerce",
    tag: "SEAT 01 // COMMERCE",
    img: "/images/image1.avif",
    imgAlt: "A cook weighing and mixing ingredients in a kitchen",
    badge: "CAL: RETORT 121°C",
    title: "Food Brands & CPG",
    desc: "Scale artisanal kitchen recipes into shelf-stable market formulations without losing mouthfeel or volatile aromatics.",
    r1Label: "Target stakeholder:",
    r1: "Global Pantry & Sauce CPGs",
    r2Label: "Bench protocol:",
    r2: (
      <>
        WATER ACTIVITY a<sub>w</sub> &lt; 0.85
      </>
    ),
    status: "Occupied",
    icon: "check",
    pos: "xl:left-[2.5%] xl:top-[64px]",
  },
  {
    id: "02",
    zone: "Innovation",
    tag: "SEAT 02 // INNOVATION",
    img: "/images/image2.avif",
    imgAlt: "Two chefs prototyping a sauce on a busy bench",
    badge: "SPRINT: 14-DAY BENCH",
    title: "CPG Startups",
    desc: (
      <>
        Rapid benchtop prototyping, pilot-batch iteration and precise pH/a<sub>w</sub> calibration
        to beat legacy incumbents.
      </>
    ),
    r1Label: "Target stakeholder:",
    r1: "Venture-Backed Functional Foods",
    r2Label: "Incubation speed:",
    r2: "14-DAY PILOT CYCLES",
    status: "Active",
    icon: "sliders",
    pos: "xl:right-[2.5%] xl:top-[64px]",
  },
  {
    id: "03",
    zone: "Learning",
    tag: "SEAT 03 // LEARNING",
    img: "/images/image3.avif",
    imgAlt: "A researcher in a white coat in a fermentation lab",
    badge: "RESIDENCY: TERM 24-B",
    title: "Students & Technologists",
    desc: "Direct immersion into applied bio-fermentation, mass spectrometry data and commercial-grade food science tooling.",
    r1Label: "Academic rotation:",
    r1: "Graduate Biochemistry Fellows",
    r2Label: "Instrumentation:",
    r2: "GC-MS AROMA INDEXING",
    status: "Enrolling",
    icon: "cap",
    pos: "xl:left-[2.5%] xl:bottom-[40px]",
  },
  {
    id: "04",
    zone: "Community",
    tag: "SEAT 04 // COMMUNITY",
    img: "/images/image4.avif",
    imgAlt: "A food production line with workers in hairnets",
    badge: "SCALE: 10,000 L / HR",
    title: "Scale Manufacturers",
    desc: "Seamless pilot-to-production pipelines, strict HACCP parameter mapping and line batch consistency verification.",
    r1Label: "Co-packing:",
    r1: "Aseptic, Cold-Fill & Pouch",
    r2Label: "Certification:",
    r2: "SQF / BRCGS GRADE AA",
    status: "Online",
    icon: "factory",
    pos: "xl:right-[2.5%] xl:bottom-[40px]",
  },
  {
    id: "05",
    zone: "Visionaries",
    tag: "SEAT 05 // VISIONARIES",
    img: "/images/image5.avif",
    imgAlt: "Chefs tasting and discussing a dish together",
    badge: "MASTER CURATOR SEAT",
    title: "Culinary Innovators & Chefs",
    desc: "Bridging raw culinary instinct with empirical sensory codification. Reclaiming lost heritage fermentation.",
    r1Label: "Creative mandate:",
    r1: "Empirical Umami Reconstruction",
    r2Label: "Atelier vault:",
    r2: "SPECIMEN #001 — #418",
    status: "Seated",
    icon: "star",
    pos: "xl:inset-x-0 xl:mx-auto xl:bottom-[40px]",
  },
];

const TICKER = "FROM A FRENCH DELICACY TO A VIETNAMESE STREET ICON";

/* ───────────────────────── icons ───────────────────────── */

function Icon({ name }: { name: IconName }) {
  const p = {
    width: "1.15em",
    height: "1.15em",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "check":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...p}>
          <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
        </svg>
      );
    case "cap":
      return (
        <svg {...p}>
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      );
    case "factory":
      return (
        <svg {...p}>
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M17 18h1M12 18h1M7 18h1" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      );
  }
}

function RadarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2" />
    </svg>
  );
}

/* ───────────────────────── seat card ───────────────────────── */

function SeatCard({
  seat,
  active,
  orbit,
  onSelect,
}: {
  seat: Seat;
  active: boolean;
  orbit: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      tabIndex={0}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      aria-label={`${seat.tag}: ${seat.title}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[0.9em] border bg-[#17100e]/90 outline-none backdrop-blur-md transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#F0623A] ${
        orbit ? "xl:flex-row" : ""
      } ${
        active
          ? "border-[#F0623A]/70 shadow-[0_0_0_1px_rgba(240,98,58,0.22),0_24px_60px_-18px_rgba(240,98,58,0.4)]"
          : "border-white/10 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.9)]"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-32 w-full shrink-0 overflow-hidden bg-[#2a1d17] ${
          orbit ? "xl:h-auto xl:w-[5em]" : ""
        }`}
      >
        <Image
          src={seat.img}
          alt={seat.imgAlt}
          fill
          sizes="(min-width:1280px) 320px, (min-width:640px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 group-hover:scale-110 ${
            active ? "opacity-100" : "opacity-70"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17100e] via-transparent to-black/20 xl:bg-gradient-to-r xl:from-transparent xl:via-transparent xl:to-[#17100e]/70" />
        <span
          className={`absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 font-spacemono text-[10px] uppercase tracking-wider text-[#F2C9A8] ${
            orbit ? "xl:hidden" : ""
          }`}
        >
          {seat.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-4 xl:p-[0.85em]">
        <div className="flex items-center gap-[0.5em] font-spacemono text-[0.7em] font-bold uppercase tracking-[0.16em] text-[#F2A07B]">
          <span
            className={`h-[0.6em] w-[0.6em] shrink-0 rounded-full bg-[#F0623A] ${
              active ? "animate-pulse" : ""
            }`}
          />
          <span className="truncate">{seat.tag}</span>
        </div>

        <h3 className="mt-[0.45em] font-newsreader text-[1.5em] font-medium leading-[1.1] tracking-tight text-[#EDE6DC]">
          {seat.title}
        </h3>

        <p
          className={`mt-[0.4em] font-jakarta text-[0.82em] leading-[1.35] text-white/55 ${
            orbit ? "xl:line-clamp-2" : ""
          }`}
        >
          {seat.desc}
        </p>

        {/* Detail rows: matrix view + small screens only */}
        <div
          className={`mt-[0.9em] space-y-[0.5em] border-t border-white/10 pt-[0.8em] ${
            orbit ? "max-xl:block xl:hidden" : "block"
          }`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-spacemono text-[0.68em] uppercase tracking-wider text-white/35">
              {seat.r1Label}
            </span>
            <span className="text-right font-jakarta text-[0.8em] text-[#EDE6DC]">{seat.r1}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-spacemono text-[0.68em] uppercase tracking-wider text-white/35">
              {seat.r2Label}
            </span>
            <span className="text-right font-spacemono text-[0.72em] uppercase tracking-wider text-[#F2A07B]">
              {seat.r2}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-[0.7em] font-spacemono text-[0.68em] uppercase tracking-wider text-[#F2A07B]">
          <span className={`truncate text-white/45 ${orbit ? "max-xl:hidden" : "hidden"}`}>
            {seat.badge}
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-[0.4em]">
            {seat.status}
            <Icon name={seat.icon} />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);
  const prevView = useRef<"orbit" | "matrix">("orbit");

  const [view, setView] = useState<"orbit" | "matrix">("orbit");
  const [active, setActive] = useState(0);
  const orbit = view === "orbit";

  // Auto-advance the active seat (pauses on hover / hidden tab).
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setActive((a) => (a + 1) % SEATS.length);
      }
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  // Scroll reveals + ambient loops.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".js-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              end: "top 10%",
              scrub: true,
            },
          }
        );

        gsap.from(".js-seat", {
          autoAlpha: 0,
          y: 40,
          scale: 0.96,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });

        gsap.to(".js-radar", { rotation: 360, duration: 12, ease: "none", repeat: -1 });
        gsap.to(".js-ticker", { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".js-word", { opacity: 1 });
      });
    },
    { scope: root }
  );

  // Re-stagger the cards when the layout switches (safe under StrictMode).
  useGSAP(
    () => {
      if (prevView.current === view) return;
      prevView.current = view;
      gsap.fromTo(
        ".js-seat",
        { autoAlpha: 0, y: 24, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          overwrite: "auto",
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    },
    { scope: root, dependencies: [view] }
  );

  const current = SEATS[active];

  // One base font size drives every em inside the cards.
  const cardFont = orbit
    ? "xl:[font-size:clamp(13px,min(1.02vw,1.8vh),16px)]"
    : "xl:[font-size:clamp(12px,0.95vw,14px)]";

  return (
    <section
      ref={root}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="relative overflow-hidden bg-[#0e0a09] px-5 py-20 text-[#EDE6DC] sm:px-8 xl:box-border xl:h-svh xl:min-h-[600px] xl:px-0 xl:pb-0 xl:pt-16"
    >
      {/* ── Ambient decor ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(240,98,58,0.14),transparent_60%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />
      </div>

      <div
        className={`relative mx-auto w-full max-w-[1720px] ${
          orbit ? "xl:h-full" : "xl:flex xl:h-full xl:flex-col"
        }`}
      >
        {/* ── Orbit decor (xl only), centred on the stage ── */}
        <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
          {/* radar sweep */}
          <div className="absolute left-1/2 top-1/2 aspect-square h-[104%] -translate-x-1/2 -translate-y-1/2">
            <div
              className="js-radar h-full w-full rounded-full opacity-60 [mask-image:radial-gradient(circle,black_10%,transparent_68%)]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg 300deg, rgba(240,98,58,0.10) 335deg, rgba(240,98,58,0.5) 360deg)",
              }}
            />
          </div>

          {/* rings (height in % of stage) */}
          {[46, 72, 100, 134].map((h) => (
            <div
              key={h}
              className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#F0623A]/25"
              style={{ height: `${h}%` }}
            />
          ))}

          {/* solid inner ring + beacons on the 72% ring */}
          <div className="absolute left-1/2 top-1/2 aspect-square h-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <div className="absolute left-1/2 top-1/2 aspect-square h-[72%] -translate-x-1/2 -translate-y-1/2">
            {[
              "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
            ].map((c) => (
              <span key={c} className={`absolute h-1.5 w-1.5 rounded-full bg-[#F0623A] ${c}`}>
                <span className="absolute inset-0 animate-ping rounded-full bg-[#F0623A] opacity-70" />
              </span>
            ))}
          </div>

          {/* axes */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ── Top bar ── */}
        <div
          className={`relative z-30 mb-10 flex flex-wrap items-center justify-between gap-4 ${
            orbit
              ? "xl:absolute xl:inset-x-[2.5%] xl:top-3 xl:mb-0"
              : "xl:mb-0 xl:px-[2.5%] xl:pt-3"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="hidden font-spacemono text-xs uppercase tracking-[0.2em] text-white/40 sm:block">
              Configuration:
            </span>
            <div
              role="tablist"
              aria-label="Layout"
              className="hidden rounded-md border border-white/10 bg-black/30 p-1 xl:flex"
            >
              {(["orbit", "matrix"] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded px-3.5 py-1.5 font-spacemono text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                    view === v ? "bg-[#F0623A] text-[#1a0e09]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {v === "orbit" ? "Orbit View" : "Seating Matrix"}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="flex items-center gap-6 font-spacemono text-[11px] uppercase tracking-[0.15em]">
            <span className="hidden items-center gap-2 text-white/45 md:flex">
              <span className="h-2 w-2 rounded-full bg-[#F2A07B]" />
              Polar coordinate matrix [N=5]
            </span>
            <span className="flex items-center gap-2 text-[#F2A07B]">
              <RadarIcon />
              Beacon radar active
            </span>
          </div> */}
        </div>

        {/* ── Headline block (centre) ── */}
        <div
          className={`relative z-10 my-14 text-center xl:my-0 ${
            orbit
              ? "xl:absolute xl:left-1/2 xl:top-[46%] xl:w-max xl:-translate-x-1/2 xl:-translate-y-1/2"
              : "xl:flex xl:flex-1 xl:flex-col xl:items-center xl:justify-center"
          }`}
        >
          <p className="mb-4 font-spacemono text-[11px] uppercase tracking-[0.25em] text-[#F2A07B]/80">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#F0623A] align-middle" />
            Focus: {current.zone}
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/40">
              {current.id} of {String(SEATS.length).padStart(2, "0")}
            </span>
          </p>

          <h2
            className={`font-newsreader text-[clamp(2.4rem,9vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-[#EDE6DC] ${
              orbit
                ? "xl:whitespace-nowrap xl:[font-size:min(4.4vw,7vh)]"
                : "xl:[font-size:min(4vw,6.4vh)]"
            }`}
          >
            <Words text="Every industry has a table." />
            <br />
            <Words text="But who's" />
            <br />
            <span className="italic text-[#F0623A] [text-shadow:0_0_40px_rgba(240,98,58,0.4)]">
              <Words text="sitting around it?" />
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-[24em] font-jakarta text-[clamp(14px,1.2vw,19px)] leading-snug text-white/55 xl:[font-size:clamp(13px,min(1.2vw,2.1vh),19px)]">
            Five seats. Infinite formulations. The communal bench for living culinary intelligence.
          </p>

          {/* Pager */}
          <div
            role="tablist"
            aria-label="Seats"
            className="mx-auto mt-4 inline-flex rounded-full border border-white/10 bg-[#1c1411]/90 p-1 backdrop-blur"
          >
            {SEATS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`h-8 w-11 rounded-full font-spacemono text-xs transition-all duration-300 sm:w-12 ${
                  i === active
                    ? "bg-[#F0623A] font-bold text-[#1a0e09]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* ── Seat cards ── */}
        <div
          className={`relative z-20 grid gap-4 sm:grid-cols-2 ${
            orbit ? "xl:contents" : "xl:grid-cols-5 xl:gap-4 xl:px-[2.5%] xl:pb-10"
          }`}
        >
          {SEATS.map((seat, i) => (
            <div
              key={seat.id}
              className={`text-[14px] ${cardFont} ${
                orbit ? `xl:absolute xl:w-[21em] ${seat.pos}` : ""
              }`}
            >
              <div className="js-seat h-full">
                <SeatCard
                  seat={seat}
                  active={i === active}
                  orbit={orbit}
                  onSelect={() => setActive(i)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Ticker (bottom edge, xl only) ── */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-7 overflow-hidden border-t border-white/10 bg-black/30 xl:block"
          aria-hidden
        >
          <div className="js-ticker flex h-full w-max items-center whitespace-nowrap font-spacemono text-[11px] tracking-[0.4em] text-white/45">
            {[0, 1].map((n) => (
              <span key={n} className="flex items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex items-center">
                    <span className="px-6">{TICKER}</span>
                    <span className="text-[#F0623A]">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}