"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DotFlavrPhilosophy() {
  const root = useRef<HTMLElement>(null);

  const imgsrc = "/image/image1.avif"

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Reveal the headline and graphic
        gsap.from(".js-philosophy-head", {
          autoAlpha: 0,
          y: 35,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        });

        // Reveal the supporting description
        gsap.from(".js-philosophy-copy", {
          autoAlpha: 0,
          y: 25,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".js-philosophy-copy",
            start: "top 85%",
            once: true,
          },
        });

        // Image reveal animation
        const imageTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".js-philosophy-image",
            start: "top 85%",
            once: true,
          },
          defaults: {
            ease: "expo.out",
          },
        });

        imageTimeline
          .fromTo(
            ".js-image-reveal",
            {
              clipPath: "inset(0 0 100% 0)",
            },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
            }
          )
          .from(
            ".js-philosophy-img",
            {
              scale: 1.2,
              duration: 1.6,
            },
            0
          );

        // Subtle image movement while scrolling
        gsap.to(".js-philosophy-img", {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: ".js-philosophy-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F1EA] px-6 py-20 font-sans antialiased text-[#1A1A1A] md:px-16 md:py-28"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">

        {/* Left Column: Graphic and Headline */}
        <div className="flex flex-col space-y-6 lg:col-span-8">

          {/* Brand Graphic */}
          <div className="js-philosophy-head flex h-20 w-20 items-center justify-center bg-[#E3DEC9] shadow-sm">
            <span className="text-2xl font-semibold tracking-wider text-[#1A1A1A]">
              DF
            </span>
          </div>

          {/* Philosophy Headline */}
          <div className="js-philosophy-head">
            <h2 className="text-4xl font-medium leading-[1.05] tracking-tight text-[#1A1A1A] sm:text-5xl md:text-6xl lg:text-7xl">
              We want the environment on our side. All our signage and
              equipment are produced using strictly ecological and durable
              materials. And everything we design is meant to complement its...
            </h2>
          </div>
        </div>

        {/* Right Column: Description and Image */}
        <div className="flex h-full flex-col justify-between space-y-12 lg:col-span-4 lg:border-l lg:border-[#DCD7C9] lg:pl-10">

          {/* Supporting Description */}
          <div className="js-philosophy-copy text-sm font-normal leading-relaxed text-[#333333] md:text-base">
            <p>
              Born from a collective passion for food innovation and smart
              formulation, Dot Flavr bridges the gap between raw culinary
              concepts and scalable commercial products. We solve complex
              stability, scaling, and R&D challenges so brands can build
              better food experiences.
            </p>
          </div>

          {/* Food R&D Image */}
          <div className="js-philosophy-image relative aspect-[4/3] w-full overflow-hidden bg-[#E3DEC9] shadow-md">
            <div className="js-image-reveal absolute inset-0">
              <Image
                src={imgsrc}
                alt="Food research and development, testing, and product innovation"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="js-philosophy-img object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
