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

type Project = {
  title: string;
  sub: string;
  stage: string;
  href: string;
  img: string;
  bg: string;
};

const PROJECTS: Project[] = [
  { title: "Protein Bar", sub: "Formulation & texture optimisation", stage: "Bench → Pilot", href: "/projects/protein-bar", img: "/images/work/01.jpg", bg: "#800020" },
  { title: "Clean Brew", sub: "Shelf-life & retort processing", stage: "Pilot → Scale", href: "/projects/clean-brew", img: "/images/work/02.jpg", bg: "#ff6f3c" },
  { title: "Flora Snack", sub: "Moisture & barrier packaging", stage: "Bench", href: "/projects/flora-snack", img: "/images/work/03.jpg", bg: "#3a2a1a" },
  { title: "Millet Crunch", sub: "Extrusion & commercial scale-up", stage: "Pilot → Scale", href: "/projects/millet-crunch", img: "/images/work/04.jpg", bg: "#2d161c" },
  { title: "Hydra Electrolyte", sub: "Functional flavour balancing", stage: "Bench → Pilot", href: "/projects/hydra-electrolyte", img: "/images/work/05.jpg", bg: "#ff6f3c" },
  { title: "Dairy Alternative", sub: "Emulsion & sensory profiling", stage: "Bench", href: "/projects/dairy-alternative", img: "/images/work/06.jpg", bg: "#800020" },
  { title: "Botanical Elixir", sub: "Natural preservation & stability", stage: "Pilot", href: "/projects/botanical-elixir", img: "/images/work/07.jpg", bg: "#4a121a" },
  { title: "Active Spread", sub: "Water activity & viscosity trials", stage: "Bench → Pilot", href: "/projects/active-spread", img: "/images/work/08.jpg", bg: "#ff6f3c" },
  { title: "Bake Lab", sub: "Clean-label reformulation", stage: "Pilot → Scale", href: "/projects/bake-lab", img: "/images/work/09.jpg", bg: "#6b1426" },
];

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

// Shared sizing: card height comes from the space left under the heading.
const CARD_W = "lg:w-[clamp(16rem,calc(var(--card-h)*0.88),24rem)]";
const CARD_H = "h-[22rem] lg:h-[var(--card-h)]";

function Trial({ p, i }: { p: Project; i: number }) {
  const arch = i % 3 === 0;
  const low = i % 2 === 1;

  return (
    <Link
      href={p.href}
      className={`js-trial group block w-[78vw] shrink-0 snap-start outline-none sm:w-[22rem] ${CARD_W} ${
        low ? "lg:mt-[min(3rem,5svh)]" : ""
      }`}
    >
      <div className="mb-2.5 flex items-baseline justify-between font-spacemono text-[11px] uppercase tracking-[0.2em] text-[#2a0610]/55">
        <span>Trial {pad(i + 1, 3)}</span>
        <span className="text-[#ff6f3c]">{p.stage}</span>
      </div>

      <div
        className={`relative overflow-hidden transition-[border-radius] duration-700 ${CARD_H} ${
          arch ? "rounded-t-[999px]" : "rounded-none group-hover:rounded-t-[2.5rem]"
        }`}
        style={{ backgroundColor: p.bg }}
      >
        <Image
          src={p.img}
          alt={`${p.title}: ${p.sub}`}
          fill
          sizes="(min-width:1024px) 384px, 78vw"
          className="js-pimg scale-[1.22] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.3]"
        />
        <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#fff9eb] px-3 py-2 font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#2a0610] opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          View case <span aria-hidden>→</span>
        </span>
      </div>

      <h3 className="mt-4 font-display text-[clamp(1.8rem,2.4vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.04em] transition-colors duration-300 group-hover:text-[#ff6f3c]">
        {p.title}
      </h3>
      <p className="mt-1 font-newsreader text-[1.1rem] italic leading-snug text-[#2a0610]/65">
        {p.sub}
      </p>
    </Link>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".js-w-in", {
          yPercent: 110,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
        gsap.from(".js-w-fade", {
          autoAlpha: 0,
          y: 18,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
      });

      // Desktop: pin, then walk the shelf.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const s = stage.current;
        const v = view.current;
        const t = track.current;
        if (!s || !v || !t) return;

        gsap.set(v, { overflowX: "hidden" });

        const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
        const countEl = s.querySelector<HTMLElement>(".js-count");
        const barEl = s.querySelector<HTMLElement>(".js-bar");
        let last = -1;

        gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: () => `+=${dist()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barEl) barEl.style.transform = `scaleX(${self.progress})`;
              const n = Math.min(
                PROJECTS.length,
                Math.max(1, Math.floor(self.progress * PROJECTS.length) + 1)
              );
              if (countEl && n !== last) {
                last = n;
                countEl.textContent = pad(n);
              }
            },
          },
        });

        // Photos drift inside their frames. The 1.22 scale leaves ~11% spare each side,
        // so a ±5% drift never shows the backing colour.
        gsap.fromTo(
          ".js-pimg",
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: s,
              start: "top top",
              end: () => `+=${dist()}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="projects" className="bg-[#fff9eb] text-[#2a0610]">
      <div
        ref={stage}
        // --card-h = viewport height minus navbar, heading, labels and caption.
        className="flex flex-col justify-center gap-10 py-24 lg:h-svh lg:gap-[2.5svh] lg:overflow-hidden lg:pb-[3svh] lg:pt-[calc(4rem+1.5svh)] lg:[--card-h:clamp(11rem,calc(100svh_-_24.5rem),28rem)]"
      >
        {/* Heading row */}
        <div className="flex flex-col gap-6 px-6 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div>
            <p className="js-w-fade font-newsreader text-[1.1rem] italic text-[#ff6f3c]">
              The trial shelf
            </p>
            <h2 className="mt-1 font-display text-[clamp(2.6rem,5.6vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.045em] lg:text-[min(5.2vw,9.5svh)]">
              <span className="block overflow-hidden py-[0.06em]">
                <span className="js-w-in block">Tested until</span>
              </span>
              <span className="block overflow-hidden py-[0.06em]">
                <span className="js-w-in block">
                  it <em className="text-[#ff6f3c]">tasted right.</em>
                </span>
              </span>
            </h2>
          </div>

          <div className="js-w-fade flex items-end gap-8 lg:gap-10">
            <p className="max-w-[17rem] text-[14px] leading-[1.6] text-[#2a0610]/70">
              A few of the products we have taken from a bench idea to something ready for
              production.
            </p>
            <div className="hidden w-40 shrink-0 lg:block">
              <p className="flex items-baseline justify-between font-spacemono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-[#2a0610]/50">Trial</span>
                <span>
                  <span className="js-count text-[#ff6f3c]">01</span>
                  <span className="text-[#2a0610]/40"> / {pad(PROJECTS.length)}</span>
                </span>
              </p>
              <span className="mt-2 block h-px bg-[#2a0610]/20">
                <span
                  className="js-bar block h-full origin-left bg-[#ff6f3c]"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* The shelf */}
        <div
          ref={view}
          className="js-view snap-x snap-mandatory overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:snap-none lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={track}
            className="js-track flex w-max items-start gap-6 px-6 md:px-12 lg:gap-10 lg:px-16"
          >
            {PROJECTS.map((p, i) => (
              <Trial key={p.title} p={p} i={i} />
            ))}

            {/* Last slide: an invitation, same height as the photos */}
            <Link
              href="/#contact"
              className={`group relative flex w-[78vw] shrink-0 snap-start flex-col justify-between overflow-hidden bg-[#2a0610] p-8 text-[#fff9eb] sm:w-[22rem] lg:mr-[6vw] lg:mt-[calc(1.1rem+10px)] ${CARD_W} ${CARD_H}`}
            >
              <span className="font-spacemono text-[11px] uppercase tracking-[0.2em] text-[#ffb08a]">
                Trial {pad(PROJECTS.length + 1, 3)}
              </span>
              <span className="font-display text-[clamp(2.2rem,3.2vw,3.2rem)] font-medium leading-[0.92] tracking-[-0.04em]">
                Next trial:
                <br />
                <em className="text-[#ff6f3c]">yours.</em>
              </span>
              <span className="flex items-center gap-3 text-[15px]">
                Pull up a chair
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}