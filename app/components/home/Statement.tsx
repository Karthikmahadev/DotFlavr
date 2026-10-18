"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Token = { t: string } | { img: string; alt: string; bg: string };

// Dot Flavr brand statement highlighting food innovation, R&D trials, and commercialization
const CONTENT: Token[] = [
  { t: "We engineer market-ready food products through formulation" },
  { img: "/images/formulation-trials.jpg", alt: "Food product formulation trials", bg: "#ff6f3c" },
  { t: "precision R&D" },
  { img: "/images/food-science-lab.avif", alt: "Food science laboratory trials", bg: "#800020" },
  { t: "shelf-life stability and scalable" },
  { img: "/images/commercial-scaleup.jpg", alt: "Commercial food production scale up", bg: "#ff6f3c" },
  { t: "commercialization" },
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Every word and inline visual fades up cleanly on scroll
        gsap.fromTo(
          ".js-tok",
          { opacity: 0.15, yPercent: 28 },
          {
            opacity: 1,
            yPercent: 0,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: root.current,
              start: "top 72%",
              end: "center 45%",
              scrub: true,
            },
          }
        );

        // Inline product/R&D visuals pop in with a subtle dynamic rotation
        gsap.from(".js-pic", {
          scale: 0,
          rotate: -12,
          duration: 0.85,
          ease: "back.out(1.8)",
          stagger: 0.16,
          scrollTrigger: { trigger: root.current, start: "top 55%", once: true },
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
      className="relative flex min-h-svh items-center justify-center bg-[#fff9eb] px-6 py-32 text-[#800020]"
    >
      <h2 className="mx-auto max-w-[16em] text-balance text-center font-serif text-[clamp(2.25rem,6vw,6rem)] font-medium leading-[1.02] tracking-[-0.035em]">
        {CONTENT.map((tok, i) =>
          "t" in tok ? (
            tok.t.split(" ").map((w, j) => (
              <span key={`${i}-${j}`}>
                <span className="js-tok inline-block will-change-transform">{w}</span>{" "}
              </span>
            ))
          ) : (
            <span
              key={i}
              className="js-tok js-pic relative mr-[0.14em] inline-block h-[0.8em] w-[1.12em] overflow-hidden align-[-0.05em] shadow-md ring-1 ring-[#800020]/15"
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
    </section>
  );
}