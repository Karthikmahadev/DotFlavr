"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Brand = { name: string; logo: string };

const BRANDS: Brand[] = [
  { name: "Burger King", logo: "/images/work/burgerking.jpg" },
  { name: "Happy Ending", logo: "/images/work/happyending.webp" },
  { name: "McDonald's", logo: "/images/work/mcdonalds.jpg" },
  { name: "Subway", logo: "/images/work/subway.jpg" },
  { name: "Wendy's", logo: "/images/work/wendys.jpg" },
  { name: "Starbucks", logo: "/images/work/starbucks.jpg" },
  { name: "Maggi", logo: "/images/work/maggi.jpg" },
  { name: "Nescafe", logo: "/images/work/nescafe.jpg" },
  { name: "Cornetto", logo: "/images/work/cornetto.jpg" },
  { name: "Cheetos", logo: "/images/work/cheetos.jpg" },
  { name: "Reese's", logo: "/images/work/Reeses.jpg" },
  { name: "Hershey's", logo: "/images/work/hersheys.jpg" },
  { name: "Toblerone", logo: "/images/work/toberlone.jpg" },
];

const cell =
  "js-cell group relative flex h-24 items-center justify-center border-b border-r border-[#2a0610]/15 transition-colors duration-500 hover:bg-white sm:h-28 md:h-32";

function BrandCell({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className={cell}>
      {failed ? (
        <span className="px-3 text-center font-display text-base font-medium text-[#2a0610]/60 transition-colors group-hover:text-[#2a0610]">
          {brand.name}
        </span>
      ) : (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={150}
          height={56}
          unoptimized
          onError={() => setFailed(true)}
          style={{ width: "auto", height: "auto" }}
          className="max-h-10 max-w-[68%] object-contain opacity-70 mix-blend-multiply contrast-125 grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-12"
        />
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-3 font-spacemono text-[9px] uppercase tracking-[0.18em] text-[#ff6f3c] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {brand.name}
      </span>
    </li>
  );
}

export default function BrandsTrust() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const head = { trigger: root.current, start: "top 80%", once: true };

        gsap.from(".js-b-head", {
          autoAlpha: 0,
          y: 16,
          duration: 1,
          ease: "expo.out",
          clearProps: "all",
          scrollTrigger: head,
        });

        // The underline draws itself under "worked alongside".
        gsap.fromTo(
          ".js-b-underline",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "expo.out", delay: 0.4, scrollTrigger: head }
        );

        // Cells arrive in a scattered order, like contact-sheet frames developing.
        gsap.from(".js-cell", {
          autoAlpha: 0,
          y: 14,
          duration: 0.8,
          ease: "power2.out",
          stagger: { each: 0.05, from: "random" },
          clearProps: "all",
          scrollTrigger: { trigger: ".js-b-grid", start: "top 88%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-[#fff9eb] px-6 py-24 text-[#2a0610] md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-5xl text-center">
        {/* Heading */}
        <p className="js-b-head font-newsreader text-[clamp(1.4rem,2.4vw,1.9rem)] italic text-[#ff6f3c]">
          Brands we&rsquo;ve{" "}
          <span className="relative inline-block">
            worked alongside
            <span
              aria-hidden
              className="js-b-underline absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#ff6f3c]"
            />
          </span>
        </p>

        {/* Ruled grid: hairlines on top and left, cells add right and bottom */}
        <ul className="js-b-grid mt-14 grid grid-cols-2 border-l border-t border-[#2a0610]/15 md:mt-16 sm:grid-cols-3 md:grid-cols-5">
          {BRANDS.map((b) => (
            <BrandCell key={b.name} brand={b} />
          ))}

          {/* Closing cell: fills the last row and points to contact */}
          <li className={`${cell} col-span-1 !justify-between bg-[#2a0610] px-5 hover:!bg-[#ff6f3c] sm:col-span-2`}>
            <Link
              href="/#contact"
              className="absolute inset-0 flex items-center justify-between px-5 text-left text-[#fff9eb] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#fff9eb]"
            >
              <span className="font-newsreader text-[clamp(1.1rem,1.8vw,1.5rem)] italic leading-tight">
                Your brand, next
              </span>
              <span aria-hidden className="text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}