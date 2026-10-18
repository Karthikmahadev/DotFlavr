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
  name: "Taniskaa Shanmugam",
  first: "Taniskaa",
  role: "Founder & Food Technologist",
  photo: "/images/taniskaa.jpg",
  alt: "Taniskaa Shanmugam, founder of Dot Flavr",
  // Words between *asterisks* stay tangerine.
  quote:
    "Building better food products starts with understanding *real industry science*, *practical trials*, and purposeful innovation.",
  bio: "Dot Flavr is a food consultancy and innovation studio bridging the gap between kitchen concepts and scalable, market-ready products through rigorous formulation and trial evaluation.",
  facts: [
    { k: "Studio", v: "Dot Flavr, Coimbatore" },
    { k: "Practice", v: "Formulation, shelf-life, scale-up" },
    { k: "Also", v: "The Food Table: learning and industry immersion" },
  ],
};

/** "a *b c*, d" -> [{w:"a"},{w:"b",em},{w:"c",em},{w:"d"}] with punctuation kept on the word. */
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
          scrollTrigger: { trigger: ".js-meta", start: "top 88%", once: true },
        });

        // Signature underline draws itself.
        gsap.fromTo(
          ".js-sig-line",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ".js-meta", start: "top 80%", once: true },
          }
        );

        // The print: wipes open, then develops from dark mono to colour with scroll.
        gsap.fromTo(
          ".js-print",
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: ".js-print-wrap", start: "top 85%", once: true },
          }
        );
        gsap.from(".js-tape", {
          scaleX: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: 0.5,
          scrollTrigger: { trigger: ".js-print-wrap", start: "top 85%", once: true },
        });

        const develop = {
          trigger: ".js-print-wrap",
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        };
        gsap.fromTo(
          ".js-photo",
          { filter: "grayscale(1) contrast(1.15) brightness(0.8)", scale: 1.12 },
          { filter: "grayscale(0) contrast(1) brightness(1)", scale: 1, ease: "none", scrollTrigger: develop }
        );
        gsap.fromTo(
          ".js-shade",
          { opacity: 0.7 },
          { opacity: 0, ease: "none", scrollTrigger: develop }
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
      className="relative bg-[#2a0610] px-6 py-24 text-[#fff9eb] md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1240px] items-start gap-16 lg:grid-cols-12 lg:gap-14">
        {/* ───── The print ───── */}
        <div className="js-print-wrap relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <figure className="relative lg:-rotate-[1.2deg]">
            <span
              aria-hidden
              className="js-tape absolute left-1/2 top-0 z-10 h-7 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[3deg] bg-[#ffb08a]/60"
            />
            <div className="js-print bg-[#fff9eb] p-3 pb-12 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] sm:p-4 sm:pb-14">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#3b0c18]">
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.alt}
                  fill
                  sizes="(min-width:1024px) 460px, 90vw"
                  className="js-photo object-cover will-change-transform"
                />
                <div aria-hidden className="js-shade absolute inset-0 bg-[#2a0610] mix-blend-multiply" />
              </div>
              <figcaption className="absolute inset-x-4 bottom-3.5 flex items-baseline justify-between text-[#2a0610] sm:bottom-4">
                <span className="font-newsreader text-[1.05rem] italic">{FOUNDER.first}, at the bench</span>
                <span className="font-spacemono text-[10px] uppercase tracking-[0.2em] text-[#2a0610]/55">
                  Fig. 01
                </span>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* ───── The words ───── */}
        <div className="lg:col-span-7 lg:pt-6">
          <p className="font-newsreader text-[1.15rem] italic text-[#ffb08a]">The founder</p>

          <blockquote className="js-quote relative mt-6">
            <span
              aria-hidden
              className="absolute -left-1 -top-10 font-newsreader text-[7rem] italic leading-none text-[#ff6f3c] md:-left-8 md:-top-14 md:text-[10rem]"
            >
              &ldquo;
            </span>
            <p className="font-display text-[clamp(2.1rem,4.5vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.035em]">
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
          <div className="js-meta mt-14 grid gap-10 border-t border-[#fff9eb]/20 pt-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:gap-12">
            <div className="js-a-fade">
              <p className="font-newsreader text-[2.6rem] italic leading-none text-[#fff9eb] [transform:rotate(-3deg)] origin-left">
                {FOUNDER.first}
              </p>
              <svg viewBox="0 0 200 14" className="mt-1 h-3.5 w-44 text-[#ff6f3c]" fill="none" aria-hidden>
                <path
                  className="js-sig-line"
                  d="M2 9 C 40 2, 70 13, 110 6 S 170 4, 198 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                />
              </svg>
              <p className="mt-4 text-[15px] font-semibold">{FOUNDER.name}</p>
              <p className="mt-0.5 text-[14px] text-[#ff6f3c]">{FOUNDER.role}</p>
            </div>

            <div className="js-a-fade">
              <p className="text-[15px] leading-[1.65] text-[#fff9eb]/75">{FOUNDER.bio}</p>
              <dl className="mt-6 text-[14px]">
                {FOUNDER.facts.map((f) => (
                  <div key={f.k} className="flex gap-5 border-t border-[#fff9eb]/15 py-3 last:border-b">
                    <dt className="w-16 shrink-0 font-spacemono text-[11px] uppercase tracking-[0.18em] text-[#fff9eb]/45">
                      {f.k}
                    </dt>
                    <dd className="text-[#fff9eb]/90">{f.v}</dd>
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