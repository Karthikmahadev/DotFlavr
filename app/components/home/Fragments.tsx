"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Card = {
  img: string;
  alt: string;
  title: string;
  body: string;
  color: string; // overlay block colour
  box: string; // position + size of the block, in % of the photo
};

const CARDS: Card[] = [
  {
    img: "/images/image1.avif",
    alt: "A person slumped over a desk, exhausted",
    title: "Meeting prep is a scavenger hunt.",
    body: "Everything your team knows about the account is scattered across inboxes, recordings, and half-filled CRM fields. Reps spend 30 minutes reconstructing it before every call. Reevo preps the full picture automatically.",
    color: "#F4B9A0",
    box: "left-[50%] top-[15%] h-[28%] w-[33%]",
  },
  {
    img: "/images/image2.avif",
    alt: "A person bending over backward on an office chair",
    title: "Bending over backward to move deals.",
    body: "No single tool saw the whole conversation, so next steps depend on what the rep remembers to type. Reevo captures what was actually said, drafts the follow-up, and updates the record on its own.",
    color: "#52D79B",
    box: "left-[40%] top-[47%] h-[35%] w-[33%]",
  },
  {
    img: "/images/image3.avif",
    alt: "Hands reaching out from behind a pillar",
    title: "Coaching in the dark.",
    body: "Managers coach from what reps report in the pipeline meeting, not from what happened on the calls. Reevo grounds every coaching conversation in real call evidence, for every rep, every week.",
    color: "#C9A0DC",
    box: "left-[53%] top-[38%] h-[33%] w-[32%]",
  },
];

export default function Fragments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline + intro
        gsap.from(".js-head", {
          autoAlpha: 0,
          y: 30,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });

        // Each card: photo wipes open, block pops in, text fades up
        gsap.utils.toArray<HTMLElement>(".js-card").forEach((card) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
            defaults: { ease: "expo.out" },
          });
          tl.fromTo(
            card.querySelector(".js-photo"),
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 1.2 }
          )
            .from(card.querySelector(".js-img"), { scale: 1.25, duration: 1.6 }, 0)
            .from(
              card.querySelector(".js-block"),
              { scale: 0, autoAlpha: 0, duration: 0.8, ease: "back.out(1.7)" },
              0.5
            )
            .from(card.querySelectorAll(".js-copy"), { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1 }, 0.5);
        });

        // Blocks drift against the photo as you scroll
        gsap.utils.toArray<HTMLElement>(".js-block").forEach((block) => {
          gsap.to(block, {
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-[#0b0b0b] px-6 py-24 text-white md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="js-head max-w-3xl font-sans text-[clamp(2rem,4.2vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.03em]">
          None of your tools can see <strong className="font-bold">the whole deal.</strong>
        </h2>

        <p className="js-head mt-5 max-w-lg text-[15px] leading-relaxed text-white/80">
          A CRM nobody updates. A call recorder. An outbound tool. Each one sees a fragment, so
          the AI bolted onto them is guessing. AI without the full picture is just guessing.
        </p>

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
          {CARDS.map((c) => (
            <article key={c.title} className="js-card group">
              <div className="js-photo relative aspect-square overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="js-img object-cover grayscale contrast-110 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  className={`js-block absolute mix-blend-normal opacity-90 transition-transform duration-500 group-hover:scale-110 ${c.box}`}
                  style={{ backgroundColor: c.color }}
                  aria-hidden
                />
              </div>

              <h3 className="js-copy mt-6 text-[15px] font-bold tracking-tight">{c.title}</h3>
              <p className="js-copy mt-2 text-[13px] leading-relaxed text-white/75">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}