"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePreloaderDone } from "@/app/lib/loader-store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_IMG = "/images/food-table-hero.png";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Note = {
  no: string;
  title: string;
  detail: string;
  pos: string; // where the hotspot sits on the hero
  side: "left" | "right"; // which way the paper tag opens
  tilt: string; // resting angle of the paper tag
  ring: string; // size + angle of the hand-drawn circle around the object
};

const NOTES: Note[] = [
  {
    no: "01",
    title: "Formulation notebook",
    detail: "Every recipe starts as a sketch and a question.",
    pos: "left-[47%] top-[33%]",
    side: "right",
    tilt: "rotate-[2deg]",
    ring: "h-36 w-52 rotate-[-6deg]",
  },
  {
    no: "02",
    title: "The empty chair",
    detail: "Reserved for whoever has the next idea.",
    pos: "left-[67%] top-[56%]",
    side: "left",
    tilt: "rotate-[1.5deg]",
    ring: "h-48 w-56 rotate-[8deg]",
  },
  {
    no: "03",
    title: "The first cup",
    detail: "Tasting starts warm. The honest notes come after.",
    pos: "left-[21%] top-[20%]",
    side: "right",
    tilt: "rotate-[-2deg]",
    ring: "h-24 w-28 rotate-[4deg]",
  },
];

// An imperfect, pen-drawn loop: it overshoots where it started, like a real circle
const RING_PATH =
  "M100 8 C 160 6, 194 34, 190 72 C 186 112, 140 134, 96 132 C 48 130, 8 104, 12 66 C 16 30, 56 10, 108 12 C 130 13, 150 20, 164 30";

// Fine film grain, generated as an inline SVG so no extra asset is needed
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const ArrowDown = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

/**
 * Pulls its children toward the cursor and springs them back.
 * The outer box never moves, so measuring it doesn't feed back into itself.
 */
function Magnetic({
  children,
  strength = 0.3,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const box = outer.current;
          const el = inner.current;
          if (!box || !el) return;

          const xTo = gsap.quickTo(el, "x", {
            duration: 0.7,
            ease: "elastic.out(1, 0.45)",
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.7,
            ease: "elastic.out(1, 0.45)",
          });

          const move = (e: PointerEvent) => {
            const r = box.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * strength);
            yTo((e.clientY - (r.top + r.height / 2)) * strength);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };

          box.addEventListener("pointermove", move);
          box.addEventListener("pointerleave", leave);

          return () => {
            box.removeEventListener("pointermove", move);
            box.removeEventListener("pointerleave", leave);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: outer }
  );

  return (
    <div ref={outer} className="inline-block p-3 -m-3">
      <div ref={inner}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = usePreloaderDone();

  // 1. Initial states, scroll behaviour, cursor lantern + depth parallax.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".js-line", { yPercent: 115, rotate: 3, transformOrigin: "0% 100%" });
        gsap.set(".js-fade", { autoAlpha: 0, y: 14 });
        gsap.set(".js-note", { autoAlpha: 0 });
        gsap.set(".js-dot", { scale: 0 });
        gsap.set(".js-draw", { strokeDashoffset: 1 });
        gsap.set(".js-swash", { strokeDashoffset: 1 });
        gsap.set(".js-photo", { scale: 1.12 });

        const trigger = root.current;

        if (trigger) {
          const scrollOptions = {
            trigger,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };

          gsap.to(".js-photo-wrap", { yPercent: 8, ease: "none", scrollTrigger: scrollOptions });
          gsap.to(".js-title", { yPercent: -10, ease: "none", scrollTrigger: scrollOptions });

          // the photo sinks into the burgundy as you leave the hero
          gsap.to(".js-shade", { opacity: 0.75, ease: "none", scrollTrigger: scrollOptions });

          // the field notes fade first, so they never sit over the next section
          gsap.to(".js-notes-layer", {
            opacity: 0,
            ease: "power2.in",
            scrollTrigger: scrollOptions,
          });

          // the scroll stamp turns as the page turns
          gsap.to(".js-badge-spin", { rotate: 360, ease: "none", scrollTrigger: scrollOptions });
        }
      });

      // Cursor lantern + depth parallax, fine pointers only.
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = root.current;
          const lamp = el?.querySelector<HTMLElement>(".js-lamp");
          const photo = el?.querySelector<HTMLElement>(".js-photo");
          const title = el?.querySelector<HTMLElement>(".js-title");

          if (!el || !lamp) return;

          const pos = { x: el.clientWidth * 0.5, y: el.clientHeight * 0.4 };

          const apply = () => {
            lamp.style.setProperty("--mx", `${pos.x}px`);
            lamp.style.setProperty("--my", `${pos.y}px`);
          };

          apply();

          // photo and headline drift in opposite directions, which reads as depth
          const photoX = photo ? gsap.quickTo(photo, "x", { duration: 1.4, ease: "power3.out" }) : null;
          const photoY = photo ? gsap.quickTo(photo, "y", { duration: 1.4, ease: "power3.out" }) : null;
          const titleX = title ? gsap.quickTo(title, "x", { duration: 1.4, ease: "power3.out" }) : null;

          const onMove = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const px = event.clientX - rect.left;
            const py = event.clientY - rect.top;

            gsap.to(pos, {
              x: px,
              y: py,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
              onUpdate: apply,
            });

            const nx = px / rect.width - 0.5;
            const ny = py / rect.height - 0.5;
            photoX?.(-nx * 28);
            photoY?.(-ny * 14);
            titleX?.(nx * 14);
          };

          el.addEventListener("pointermove", onMove);

          return () => {
            el.removeEventListener("pointermove", onMove);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  // 2. Entrance, played once the preloader has finished.
  useGSAP(
    () => {
      if (!ready) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.to(".js-photo", { scale: 1.04, duration: 2.4, ease: "power3.out" }, 0)
          .to(".js-line", { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.1 }, 0.2)
          .to(".js-fade", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6)
          .to(
            ".js-swash",
            { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.15 },
            1.1
          );

        // each field note is "written" in three beats: dot, pen line, paper
        gsap.utils.toArray<HTMLElement>(".js-note").forEach((note, i) => {
          const q = gsap.utils.selector(note);
          const t = 1.3 + i * 0.3;

          tl.set(note, { autoAlpha: 1 }, t)
            .to(q(".js-dot"), { scale: 1, duration: 0.6, ease: "back.out(3)" }, t)
            .to(
              q(".js-draw"),
              { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
              t + 0.2
            )
            .fromTo(
              q(".js-card"),
              {
                clipPath:
                  note.dataset.side === "left"
                    ? "inset(-14px 0% -30px 100%)"
                    : "inset(-14px 100% -30px 0%)",
              },
              {
                clipPath: "inset(-14px -5% -30px -5%)",
                duration: 0.9,
                ease: "expo.out",
                clearProps: "clipPath",
              },
              t + 0.5
            );
        });
      });

      return () => mm.revert();
    },
    {
      scope: root,
      dependencies: [ready],
      revertOnUpdate: true,
    }
  );

  return (
    <section
      ref={root}
      className="relative h-svh w-full overflow-hidden bg-[#2a0610]"
    >
      {/* Hero background photo */}
      <div className="js-photo-wrap absolute inset-0 -bottom-[8%]">
        <Image
          src={HERO_IMG}
          alt="A food research bench with an open formulation notebook, a mug, a pipette and an empty wooden chair"
          fill
          priority
          sizes="100vw"
          className="js-photo object-cover object-[60%_40%] will-change-transform"
        />
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a0610]/95 via-[#2a0610]/40 to-transparent" />

      {/* Left gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a0610]/70 via-transparent to-transparent" />

      {/* Cursor-following lantern */}
      <div
        className="js-lamp pointer-events-none absolute inset-0 hidden lg:block"
        style={
          {
            "--mx": "50%",
            "--my": "40%",
            background:
              "radial-gradient(circle 42vmax at var(--mx) var(--my), rgba(255,170,90,0.16) 0%, rgba(42,6,16,0) 45%, rgba(42,6,16,0.55) 100%)",
          } as CSSProperties
        }
        aria-hidden="true"
      />

      {/* Film grain: gives the photo an analogue, printed feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
        aria-hidden="true"
      />

      {/* Scroll shade */}
      <div
        className="js-shade pointer-events-none absolute inset-0 bg-[#2a0610] opacity-0"
        aria-hidden="true"
      />

      {/* Field notes: annotations pinned onto the photo */}
      <div className="js-notes-layer absolute inset-0 z-20 hidden lg:block">
        {NOTES.map((note) => (
          <div
            key={note.title}
            className={`js-note group absolute ${note.pos}`}
          >
            {/* A hand-drawn circle around the object, inked when you hover */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 140"
              fill="none"
              className={`pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 overflow-visible ${note.ring}`}
            >
              <path
                pathLength={1}
                d={RING_PATH}
                stroke="#fff9eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[900ms] ease-out group-hover:[stroke-dashoffset:0] group-focus-within:[stroke-dashoffset:0] motion-reduce:transition-none"
              />
            </svg>

            <button
              type="button"
              aria-label={note.title}
              className="relative grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#fff9eb]"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6f3c]/60 motion-reduce:animate-none" />
              <span className="js-dot relative h-2.5 w-2.5 rounded-full bg-[#ff6f3c] ring-2 ring-[#fff9eb] transition-transform duration-300 group-hover:scale-125" />
            </button>

            {/* Pen line + taped paper tag */}
            <div
              className={`absolute top-0 flex -translate-y-1/2 items-center ${
                note.side === "right" ? "left-3" : "right-3 flex-row-reverse"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 56 24"
                fill="none"
                className={`h-6 w-14 shrink-0 overflow-visible ${
                  note.side === "left" ? "-scale-x-100" : ""
                }`}
              >
                <path
                  pathLength={1}
                  d="M0 12 C 10 1, 20 23, 31 12 S 48 9, 56 12"
                  stroke="#fff9eb"
                  strokeOpacity="0.85"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className="js-draw [stroke-dasharray:1]"
                />
              </svg>

              <div className="js-card" data-side={note.side}>
                <div
                  className={`relative ${note.tilt} w-max max-w-[15rem] drop-shadow-[0_14px_22px_rgba(0,0,0,0.38)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:rotate-0 group-hover:-translate-y-1 group-focus-within:rotate-0 group-focus-within:-translate-y-1`}
                >
                  {/* masking tape */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-5 z-10 h-4 w-14 rotate-[-6deg] bg-[#ffb08a]/60 [clip-path:polygon(0_0,100%_0,96%_25%,100%_50%,96%_75%,100%_100%,0_100%,4%_75%,0_50%,4%_25%)]"
                  />

                  {/* ruled paper with a folded corner */}
                  <div className="relative bg-[#fff9eb] bg-[linear-gradient(to_bottom,transparent_calc(100%_-_1px),rgba(42,6,16,0.07)_calc(100%_-_1px))] bg-[length:100%_1.4rem] px-4 pb-3 pt-4 text-[#2a0610] [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_14px),calc(100%_-_14px)_100%,0_100%)]">
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 h-[14px] w-[14px] bg-[#e4d4b2] [clip-path:polygon(0_0,100%_0,0_100%)]"
                    />

                    <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-[#ff6f3c]">
                      No. {note.no}
                    </p>

                    <p className="mt-1.5 font-newsreader text-[17px] italic leading-none">
                      {note.title}
                    </p>

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                      <p className="overflow-hidden font-sans text-[11px] leading-snug text-[#2a0610]/70">
                        <span className="block pt-2">{note.detail}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editorial caption, top right */}
      {/* <p className="js-fade absolute right-[4.4%] top-[calc(4rem+3svh)] z-10 hidden font-newsreader text-sm italic text-[#fff9eb]/70 lg:block">
        Fig. 01 &mdash; The bench, before the first taste.
      </p> */}

      {/* Scroll stamp */}
      {/* <a
        href="#process"
        aria-label="Scroll to see how we work"
        className="js-fade js-badge group absolute bottom-[5svh] right-[4.4%] z-20 hidden h-[clamp(96px,11vw,150px)] w-[clamp(96px,11vw,150px)] lg:block"
      >
        <div className="js-badge-spin h-full w-full">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full animate-[spin_26s_linear_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          >
            <defs>
              <path
                id="badge-path"
                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
              />
            </defs>
            <text
              fill="#fff9eb"
              fontSize="14"
              fontWeight="600"
              letterSpacing="2"
              className="font-sans uppercase"
            >
              <textPath
                href="#badge-path"
                textLength="480"
                lengthAdjust="spacing"
              >
                Scroll &bull; Formulate &bull; Question &bull; Taste &bull;{" "}
              </textPath>
            </text>
          </svg>
        </div>

        <span className="absolute inset-[33%] grid place-items-center overflow-hidden rounded-full bg-[#fff9eb] text-[#2a0610] transition-colors duration-500 group-hover:bg-[#ff6f3c] group-hover:text-[#fff9eb]">
          <ArrowDown className="transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-[200%]" />
          <ArrowDown className="absolute inset-0 m-auto -translate-y-[200%] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-0" />
        </span>
      </a> */}

      {/* Main hero content - compact mobile bottom alignment to remove dead space */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end px-5 pb-6 pt-20 sm:px-8 sm:pb-8 lg:px-[4.4%] lg:pb-[5svh] lg:pt-0">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          {/* Eyebrow integrated tightly above headline on mobile */}
          <p className="js-fade font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff9eb]/85 lg:absolute lg:left-[4.4%] lg:top-[calc(4rem+3svh)] lg:text-xs">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ff6f3c] align-middle" />
            Food R&amp;D studio &middot; Coimbatore
          </p>

          {/* Headline */}
          <h1 className="js-title relative font-display text-[clamp(2.5rem,11vw,5.2rem)] font-medium leading-[0.88] tracking-[-0.04em] text-[#fff9eb] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] lg:text-[min(9.5vw,21svh)]">
            <span className="-my-[0.05em] block overflow-hidden py-[0.05em]">
              <span className="js-line block">We make</span>
            </span>

            <span className="-my-[0.05em] block overflow-hidden py-[0.05em]">
              <span className="js-line block">food ideas</span>
            </span>

            <span className="-my-[0.05em] block overflow-hidden py-[0.05em]">
              <span className="js-line block italic text-[#ff6f3c]">
                work.
              </span>
            </span>

            {/* A pen stroke under "work." that draws itself in */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 24"
              preserveAspectRatio="none"
              fill="none"
              className="pointer-events-none absolute -bottom-[0.06em] left-[1%] h-[0.14em] w-[54%] overflow-visible"
            >
              <path
                pathLength={1}
                d="M4 14 C 60 4, 120 20, 190 10 S 320 6, 396 12"
                stroke="#ffb08a"
                strokeWidth="5"
                strokeLinecap="round"
                className="js-swash [stroke-dasharray:1]"
              />
              <path
                pathLength={1}
                d="M40 20 C 120 14, 220 22, 330 16"
                stroke="#ffb08a"
                strokeOpacity="0.55"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="js-swash [stroke-dasharray:1]"
              />
            </svg>
          </h1>

          {/* Description and actions */}
          <div className="max-w-[22rem] lg:mb-[1.5svh] lg:mr-[calc(clamp(96px,11vw,150px)+2rem)]">
            <p className="js-fade font-newsreader text-[clamp(0.9rem,2vw,1.35rem)] leading-[1.3] text-[#fff9eb]/95 sm:text-[1.05rem]">
              A bench for people who ask{" "}
              <em className="text-[#ffb08a]">&ldquo;what if?&rdquo;</em>{" "}
              We question, formulate and test until the simplest taste moment
              feels deeply considered.
            </p>

            <div className="js-fade mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-4">
              {/* Primary action */}
              <Magnetic>
                <a
                  href="#contact"
                  className="group relative inline-flex h-11 items-center gap-3 overflow-hidden rounded-full bg-[#fff9eb] pl-5 pr-1.5 text-[13px] font-semibold text-[#2a0610] transition-transform duration-300 active:scale-[0.97] sm:text-[14px]"
                >
                  {/* orange fill rises from the bottom with a curved lip */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-[101%] rounded-[50%_50%_0_0] bg-[#ff6f3c] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-0 group-hover:rounded-none"
                  />

                  {/* label rolls up and is replaced by a copy */}
                  <span className="relative block h-[1.25em] overflow-hidden leading-[1.25em]">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full">
                      Pull up a chair
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-full block text-[#fff9eb] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full"
                    >
                      Pull up a chair
                    </span>
                  </span>

                  {/* arrow flies out one corner while a second one flies in */}
                  <span
                    aria-hidden="true"
                    className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#2a0610] text-[#fff9eb] transition-colors duration-500 group-hover:bg-[#fff9eb] group-hover:text-[#2a0610]"
                  >
                    <ArrowUpRight className="transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                    <ArrowUpRight className="absolute inset-0 m-auto -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </a>
              </Magnetic>

              {/* Secondary action: underline is redrawn in orange on hover */}
              <a
                href="#process"
                className="group relative text-[13px] text-[#fff9eb] sm:text-[14px]"
              >
                See how we work
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1.5 h-px bg-[#fff9eb]/40"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-[#ff6f3c] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}