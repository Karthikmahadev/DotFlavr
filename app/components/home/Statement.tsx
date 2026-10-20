"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Token = { t: string } | { img: string; alt: string; bg: string };

const CONTENT: Token[] = [
  { t: "Good ideas. Better food products." },
  { img: "/images/formulation-trials.jpg", alt: "Food product formulation trials", bg: "#ff6f3c" },
  { t: "We bring together food science, practical trials and product innovation" },
  { img: "/images/food-science-lab.avif", alt: "Food science laboratory trials", bg: "#800020" },
  { t: "to move ideas towards commercialisation." },
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".js-tok",
          { opacity: 0.15, yPercent: 20 },
          {
            opacity: 1,
            yPercent: 0,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              end: "center 50%",
              scrub: true,
            },
          }
        );

        gsap.from(".js-pic", {
          scale: 0,
          rotate: -12,
          duration: 0.75,
          ease: "back.out(1.8)",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".js-tok", { opacity: 1, yPercent: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#fff9eb] px-8 text-[#800020]"
    >
      {/* Increased max-w to make it wider */}
      <div className="mx-auto w-full max-w-[76rem]">
        {/* Larger clamp font size for bolder impact */}
        <h2 className="flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-[0.18em] text-center font-serif text-[clamp(2.1rem,4.8vw,5.2rem)] font-medium leading-[1.08] tracking-[-0.03em]">
          {CONTENT.map((tok, i) =>
            "t" in tok ? (
              tok.t.split(" ").map((w, j) => (
                <span key={`${i}-${j}`} className="inline-block overflow-hidden py-0.5">
                  <span className="js-tok inline-block will-change-transform">{w}</span>
                </span>
              ))
            ) : (
              <span
                key={i}
                className="js-tok js-pic relative inline-flex h-[0.7em] w-[1.3em] overflow-hidden rounded-lg align-middle shadow-md ring-1 ring-[#800020]/15"
                style={{ backgroundColor: tok.bg }}
              >
                <Image
                  src={tok.img}
                  alt={tok.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </span>
            )
          )}
        </h2>
      </div>
    </section>
  );
}