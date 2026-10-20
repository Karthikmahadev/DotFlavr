"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePreloaderDone } from "@/app/lib/loader-store";

const HERO_IMG = "/images/food-table-hero.png";

type Note = {
  title: string;
  detail: string;
  pos: string; // dot position, % of the hero
  side: "left" | "right";
  tilt: string;
};

// Pinned to things in the photo. Adjust `pos` to sit on the object.
const NOTES: Note[] = [
  {
    title: "Formulation notebook",
    detail: "Every recipe starts as a sketch and a question.",
    pos: "left-[47%] top-[33%]",
    side: "right",
    tilt: "rotate-[2deg]",
  },
  // {
  //   title: "Pipette & pencil",
  //   detail: "Measured to 0.1 ml. Written down in pencil.",
  //   pos: "left-[27%] top-[66%]",
  //   side: "right",
  //   tilt: "-rotate-[2deg]",
  // },
  {
    title: "The empty chair",
    detail: "Reserved for whoever has the next idea.",
    pos: "left-[67%] top-[56%]",
    side: "left",
    tilt: "rotate-[1.5deg]",
  },
];

function Stamp() {
  return (
    <a
      href="#contact"
      aria-label="Open for projects. Get in touch"
      className="group absolute bottom-[5svh] right-[4.4%] z-20 hidden h-[clamp(96px,11vw,150px)] w-[clamp(96px,11vw,150px)] lg:block"
    >
      <svg viewBox="0 0 200 200" className="js-stamp absolute inset-0 h-full w-full text-[#fff9eb]" aria-hidden>
        <defs>
          <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="15" fontWeight="700" letterSpacing="3" fill="currentColor">
          <textPath href="#stamp-circle" textLength="486" lengthAdjust="spacing">
            OPEN FOR PROJECTS • COIMBATORE • OPEN FOR PROJECTS • COIMBATORE •
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[26%] grid place-items-center rounded-full bg-[#ff6f3c] text-[#fff9eb] transition-transform duration-500 group-hover:scale-110">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
    </a>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = usePreloaderDone();

  // 1) Start state, lantern, scroll exit, ambient loops.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".js-line", { yPercent: 115 });
        gsap.set(".js-fade", { autoAlpha: 0, y: 18 });
        gsap.set(".js-note", { autoAlpha: 0, scale: 0.85 });
        gsap.set(".js-photo", { scale: 1.08 });

        // Stamp turns slowly.
        gsap.to(".js-stamp", { rotation: 360, duration: 24, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

        // Photo and headline drift at different speeds as you leave.
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".js-photo-wrap", { yPercent: 8, ease: "none", scrollTrigger: st });
        gsap.to(".js-title", { yPercent: -14, ease: "none", scrollTrigger: st });
      });

      // Lantern: a pool of light that follows the cursor (fine pointers only).
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        const lamp = el?.querySelector<HTMLElement>(".js-lamp");
        if (!el || !lamp) return;

        const pos = { x: el.clientWidth * 0.5, y: el.clientHeight * 0.4 };
        const apply = () => {
          lamp.style.setProperty("--mx", `${pos.x}px`);
          lamp.style.setProperty("--my", `${pos.y}px`);
        };
        apply();

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(pos, {
            x: e.clientX - r.left,
            y: e.clientY - r.top,
            duration: 0.9,
            ease: "power3.out",
            overwrite: true,
            onUpdate: apply,
          });
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root }
  );

  // 2) Intro plays when the preloader opens.
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(".js-photo", { scale: 1, duration: 2.2, ease: "power3.out" }, 0)
          .to(".js-line", { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.2)
          .to(".js-fade", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.8)
          .to(".js-note", { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.18, ease: "back.out(1.7)" }, 1.3);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section ref={root} className="relative min-h-svh w-full overflow-hidden bg-[#2a0610] lg:h-svh lg:min-h-[560px]">
      {/* Photo: left clean, only darkened where text sits */}
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a0610]/85 via-[#2a0610]/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a0610]/55 via-transparent to-transparent" />

      {/* Lantern: dark at the edges, warm where the cursor is */}
      <div
        className="js-lamp pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          ["--mx" as string]: "50%",
          ["--my" as string]: "40%",
          background:
            "radial-gradient(circle 42vmax at var(--mx) var(--my), rgba(255,170,90,0.14) 0%, rgba(42,6,16,0) 45%, rgba(42,6,16,0.55) 100%)",
        }}
        aria-hidden
      />

      {/* Pinned notes */}
      <div className="absolute inset-0 z-20 hidden lg:block">
        {NOTES.map((n) => (
          <div key={n.title} className={`js-note group absolute ${n.pos}`}>
            <button
              type="button"
              aria-label={n.title}
              className="relative grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#fff9eb]"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6f3c]/60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#ff6f3c] ring-2 ring-[#fff9eb]" />
            </button>

            {/* leader line + paper tag */}
            <div
              className={`pointer-events-none absolute top-0 flex -translate-y-1/2 items-center ${
                n.side === "right" ? "left-3" : "right-3 flex-row-reverse"
              }`}
            >
              <span className="h-px w-8 bg-[#fff9eb]/80 transition-all duration-500 group-hover:w-12 group-focus-within:w-12" />
              <div
                className={`${n.tilt} w-max max-w-[15rem] bg-[#fff9eb] px-3 py-2 text-[#2a0610] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:rotate-0 group-focus-within:rotate-0`}
              >
                <p className="font-newsreader text-[15px] italic leading-none">{n.title}</p>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                  <p className="overflow-hidden font-sans text-[11px] leading-snug text-[#2a0610]/70">
                    <span className="block pt-1.5">{n.detail}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <Stamp /> */}

      {/* Content */}
      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-10 pt-28 lg:absolute lg:inset-0 lg:min-h-0 lg:px-[4.4%] lg:pb-[5svh] lg:pt-0">
        {/* Small eyebrow, top-left under the navbar */}
        <p className="js-fade font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff9eb]/85 lg:absolute lg:left-[4.4%] lg:top-[calc(4rem+3svh)] lg:text-xs">
          <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#ff6f3c] align-middle" />
          Food R&amp;D studio · Coimbatore
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Headline */}
        <h1 className="js-title font-display text-[clamp(3.2rem,15.5vw,8rem)] font-medium leading-[0.86] tracking-[-0.045em] text-[#fff9eb] drop-shadow-[0_6px_30px_rgba(0,0,0,0.35)] lg:text-[min(9.5vw,21svh)]">
            <span className="-my-[0.05em] block overflow-hidden py-[0.05em]">
              <span className="js-line block">We make</span>
            </span>
            <span className="-my-[0.05em] block overflow-hidden py-[0.05em]">
              <span className="js-line block">food ideas</span>
            </span>
            <span className="-my-[0.05em] block overflow-hidden py-[0.05em] ">
              <span className="js-line block italic text-[#ff6f3c]">work.</span>
            </span>
          </h1>

          {/* Statement + actions */}
          <div className="max-w-[22rem] lg:mb-[1.5svh] lg:mr-[calc(clamp(96px,11vw,150px)+2rem)]">
            <p className="js-fade font-newsreader text-[clamp(1.2rem,1.7vw,1.65rem)] leading-[1.25] text-[#fff9eb]">
              A bench for people who ask <em className="text-[#ffb08a]">&ldquo;what if?&rdquo;</em>{" "}
              We question, formulate and test until the simplest taste moment feels deeply
              considered.
            </p>

            <div className="js-fade mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#contact"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#fff9eb] px-6 text-[14px] font-semibold text-[#2a0610] transition-colors duration-300 hover:bg-[#ff6f3c] hover:text-[#fff9eb]"
              >
                Pull up a chair
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a
                href="#process"
                className="text-[14px] text-[#fff9eb] underline decoration-[#fff9eb]/40 underline-offset-[6px] transition-colors hover:decoration-[#ff6f3c]"
              >
                See how we work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}