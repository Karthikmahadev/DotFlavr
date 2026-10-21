
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FOUNDER = {
  name: "Taniskaa ",
  first: "Taniskaa Shanmugam",
  role: "The Founder",
  photo: "/images/taniskaa.jpg",
  alt: "Taniskaa Shanmugam, founder of Dot Flavr",
  quote:
    "I built Dot Flavr to bridge food science and practical product development — helping turn *food ideas into thoughtfully developed products* through formulation, trials and technical problem-solving",
  bio: "Dot Flavr is a food consultancy and innovation studio bridging the gap between kitchen concepts and scalable, market-ready products through rigorous formulation and trial evaluation.",
  facts: [
    { k: "Studio", v: "Dot Flavr, Coimbatore" },
    { k: "Practice", v: "Formulation, stability, scale-up" },
    { k: "Also", v: "The Food Table: learning and industry immersion" },
  ],
};

/** Parse emphasized words while preserving punctuation. */
function parseQuote(q: string) {
  let on = false;

  return q.split(" ").map((token) => {
    if (token.startsWith("*")) on = true;

    const em = on;

    if (token.lastIndexOf("*") > 0) on = false;

    return { w: token.replace(/\*/g, ""), em };
  });
}

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);
  const words = parseQuote(FOUNDER.quote);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Quote lights up word by word as you read down it.
        gsap.fromTo(
          ".js-qw",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".js-quote",
              start: "top 78%",
              end: "bottom 48%",
              scrub: true,
            },
          }
        );

        // Small pieces settle in once.
        gsap.from(".js-a-fade", {
          autoAlpha: 0,
          y: 22,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".js-meta",
            start: "top 88%",
            once: true,
          },
        });

        // Signature underline draws itself.
        gsap.fromTo(
          ".js-sig-line",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".js-meta",
              start: "top 80%",
              once: true,
            },
          }
        );

        // Photo reveals itself.
        gsap.fromTo(
          ".js-print",
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".js-print-wrap",
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.from(".js-tape", {
          scaleX: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: 0.5,
          scrollTrigger: {
            trigger: ".js-print-wrap",
            start: "top 85%",
            once: true,
          },
        });

        const develop = {
          trigger: ".js-print-wrap",
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        };

        gsap.fromTo(
          ".js-photo",
          {
            filter: "grayscale(1) contrast(1.15) brightness(0.8)",
            scale: 1.12,
          },
          {
            filter: "grayscale(0) contrast(1) brightness(1)",
            scale: 1,
            ease: "none",
            scrollTrigger: develop,
          }
        );

        gsap.fromTo(
          ".js-shade",
          { opacity: 0.7 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: develop,
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative bg-[#2a0610] px-5 py-16 text-[#fff9eb] sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-14">
        {/* The print */}
        <div className="js-print-wrap relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:col-span-4 lg:max-w-none">
          <figure className="relative lg:-rotate-[1.5deg]">
            <span
              aria-hidden="true"
              className="js-tape absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[3deg] bg-[#ffb08a]/60"
            />

            <div className="js-print bg-[#fff9eb] p-2.5 pb-8 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.75)] sm:p-3 sm:pb-12">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#3b0c18]">
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 80vw, 90vw"
                  className="js-photo object-cover will-change-transform"
                />

                <div
                  aria-hidden="true"
                  className="js-shade absolute inset-0 bg-[#2a0610] mix-blend-multiply"
                />
              </div>
            </div>
          </figure>
        </div>

        {/* The words */}
        <div className="min-w-0 lg:col-span-8 lg:pt-2">
          <blockquote className="js-quote relative mt-2">
            <span
              aria-hidden="true"
              className="absolute -left-1 -top-8 font-newsreader text-[5rem] italic leading-none text-[#ff6f3c] sm:-top-10 sm:text-[7rem] md:-left-8 md:-top-14 md:text-[10rem]"
            >
              &ldquo;
            </span>

            <p className="font-display text-[clamp(1.8rem,6.2vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] sm:text-[clamp(2rem,4vw,3rem)] sm:leading-[1.08] lg:text-[clamp(2rem,1.9vw,4rem)] lg:leading-[1.05]">
              {words.map((x, i) => (
                <span
                  key={i}
                  className={`js-qw ${x.em ? "italic text-[#ff6f3c]" : ""}`}
                >
                  {x.w}{" "}
                </span>
              ))}
            </p>
          </blockquote>

          {/* Byline */}
          <div className="js-meta mt-9 grid min-w-0 gap-8 border-t border-[#fff9eb]/20 pt-6 sm:mt-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:gap-10 sm:pt-8 md:gap-12">
            <div className="js-a-fade min-w-0">
              <p className="origin-left [transform:rotate(-3deg)] font-newsreader text-[clamp(1.65rem,6vw,2.4rem)] italic leading-tight text-[#fff9eb] sm:text-[2.4rem] sm:leading-none">
                {FOUNDER.first}
              </p>

              <svg
                viewBox="0 0 200 14"
                className="mt-1 h-3.5 w-32 text-[#ff6f3c] sm:w-40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="js-sig-line"
                  d="M2 9 C 40 2, 70 13, 110 6 S 170 4, 198 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                />
              </svg>

              <p className="mt-1 text-[13px] text-[#ff6f3c] sm:mt-0.5 sm:text-[14px]">
                {FOUNDER.role}
              </p>
            </div>

            <div className="js-a-fade min-w-0">
              <p className="text-[14px] leading-[1.75] text-[#fff9eb]/75 sm:text-[15px] sm:leading-[1.65]">
                {FOUNDER.bio}
              </p>

              <dl className="mt-5 text-[13px] sm:mt-6 sm:text-[14px]">
                {FOUNDER.facts.map((f) => (
                  <div
                    key={f.k}
                    className="flex min-w-0 gap-3 border-t border-[#fff9eb]/15 py-3 last:border-b sm:gap-5"
                  >
                    <dt className="w-[4.25rem] shrink-0 break-words font-spacemono text-[10px] uppercase tracking-[0.12em] text-[#fff9eb]/45 sm:w-16 sm:text-[11px] sm:tracking-[0.18em]">
                      {f.k}
                    </dt>

                    <dd className="min-w-0 break-words text-[13px] leading-relaxed text-[#fff9eb]/90 sm:text-[14px]">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
