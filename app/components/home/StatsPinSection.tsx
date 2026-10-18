"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StatItem = {
  number: string;
  label: string;
  sublabel: string;
  description: string;
  img: string;
  alt: string;
};

const STATS: StatItem[] = [
  {
    number: "120+",
    label: "Formulations",
    sublabel: "Engineered",
    description:
      "Benchtop prototypes, commercial clean-label recipes, and nutritional balancing. Each formulation designed for real shelf-life.",
    img: "/images/work/01.jpg",
    alt: "Food laboratory benchtop formulation trials",
  },
  {
    number: "45+",
    label: "Sensory Panels",
    sublabel: "& Field Trials",
    description:
      "Organoleptic profiling, texture analysis, and blind consumer taste panels across ambient and refrigerated formats.",
    img: "/images/work/02.jpg",
    alt: "Sensory evaluation and consumer tasting panels",
  },
  {
    number: "98%",
    label: "Scale-Up",
    sublabel: "Success Rate",
    description:
      "Formulations engineered from kitchen grams to industrial metric tonnes without flavor drift or emulsion separation.",
    img: "/images/work/03.jpg",
    alt: "Commercial food plant pilot production and packaging line",
  },
  {
    number: "15+",
    label: "FMCG Brands",
    sublabel: "& Innovators",
    description:
      "From D2C beverage startups to heritage regional food enterprises and university food technology cohorts.",
    img: "/images/work/04.jpg",
    alt: "Food founders and technologists at The Food Table",
  },
];

export default function StatsPinSection() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!root.current) return;

        // Pinned timeline driving the number strip, images, and text
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${STATS.length * 100}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Calculate which index is currently active based on progress
              const idx = Math.min(
                STATS.length - 1,
                Math.floor(self.progress * STATS.length)
              );
              setActiveIndex(idx);
            },
          },
        });

        // Translate the vertical gigantic numbers reel
        tl.to(".js-stats-number-strip", {
          yPercent: -((STATS.length - 1) / STATS.length) * 100,
          ease: "none",
        });
      });

      // Subtle parallax entrance for non-desktop
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".js-stats-mobile-card", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative w-full bg-[#fff9eb] px-6 py-24 text-[#800020] md:px-12 lg:h-screen lg:px-20 lg:py-0"
    >
      {/* Top Header Tag */}
      <div className="pt-8 text-center lg:absolute lg:left-0 lg:top-12 lg:w-full lg:pt-0">
        <p className="font-serif text-[clamp(1.1rem,1.7vw,1.45rem)] italic text-[#800020]/75">
          Where food science meets culinary craft
        </p>
      </div>

      {/* ──────────────── Desktop View: Pinned Layout ──────────────── */}
      <div className="relative mx-auto hidden h-full max-w-7xl items-center justify-between lg:grid lg:grid-cols-[1.1fr_1.6fr_1fr] lg:gap-12">
        {/* Left: Changing Label */}
        <div className="flex flex-col justify-center">
          <div className="overflow-hidden">
            <h3 className="font-barlow text-[clamp(2.8rem,4.2vw,4.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#800020]">
              {STATS[activeIndex].label}
              <br />
              <span className="text-[#ff6f3c]">
                {STATS[activeIndex].sublabel}
              </span>
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#800020]/60">
              0{activeIndex + 1}
            </span>
            <span className="h-0.5 w-8 bg-[#800020]/20">
              <span
                className="block h-full bg-[#ff6f3c] transition-all duration-300"
                style={{
                  width: `${((activeIndex + 1) / STATS.length) * 100}%`,
                }}
              />
            </span>
            <span className="font-mono text-xs font-semibold text-[#800020]/40">
              0{STATS.length}
            </span>
          </div>
        </div>

        {/* Center: Rotated Image Card with Vertical Scrolling Numbers */}
        <div className="relative flex h-[520px] w-full items-center justify-center">
          {/* Faded Background Ghost Numbers that scroll vertically */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div
              className="js-stats-number-strip flex flex-col items-center will-change-transform"
              style={{ height: `${STATS.length * 100}%` }}
            >
              {STATS.map((item, i) => (
                <div
                  key={i}
                  className="flex h-[520px] items-center justify-center font-barlow text-[clamp(9rem,16vw,17rem)] font-black tracking-tighter text-[#800020]/[0.08]"
                >
                  {item.number}
                </div>
              ))}
            </div>
          </div>

          {/* Central Tilted Framed Window */}
          <div className="relative h-[340px] w-[460px] -rotate-3 overflow-hidden rounded-[26px] shadow-2xl ring-1 ring-[#800020]/15 transition-transform duration-500 hover:rotate-0">
            {/* Active Image Layer */}
            {STATS.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeIndex === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={item.img}
                  alt={item.alt}
                  fill
                  sizes="460px"
                  priority={i === 0}
                  className="object-cover"
                />
                {/* Subtle dark gradient overlay to make neon-lime / vibrant text pop */}
                <div className="absolute inset-0 bg-[#800020]/30 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}

            {/* Glowing Lime/Tangerine Stat Number on top of image */}
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <span className="font-barlow text-[clamp(6rem,9vw,9.5rem)] font-extrabold tracking-tight text-[#d5ff5f] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                {STATS[activeIndex].number}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Punchy Editorial Copy */}
        <div className="flex flex-col justify-center">
          <p className="max-w-[260px] text-[15px] leading-relaxed text-[#800020]/80">
            {STATS[activeIndex].description}
          </p>
        </div>
      </div>

      {/* ──────────────── Mobile / Tablet Fallback View ──────────────── */}
      <div className="mt-14 flex flex-col gap-12 lg:hidden">
        {STATS.map((item, i) => (
          <div
            key={i}
            className="js-stats-mobile-card flex flex-col rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-[#800020]/10"
          >
            <div className="relative aspect-[4/3] w-full -rotate-1 overflow-hidden rounded-xl shadow-md">
              <Image
                src={item.img}
                alt={item.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex h-full items-center justify-center">
                <span className="font-barlow text-6xl font-black text-[#d5ff5f] drop-shadow-md">
                  {item.number}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="font-barlow text-2xl font-bold uppercase text-[#800020]">
                {item.label}{" "}
                <span className="text-[#ff6f3c]">{item.sublabel}</span>
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#800020]/75">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}