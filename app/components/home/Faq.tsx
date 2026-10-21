"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ───────────────────────── data ───────────────────────── */

const FAQS = [
  {
    q: "How long does a project take?",
    a: "There’s no one-size-fits-all timeline. Once we understand what you’re looking to make, we’ll map out the steps and agree on an estimated timeline.",
  },
  {
    q: "Can you help with just one part of a project?",
    a: "Of course! Whether it’s refining a formulation or figuring out a specific challenge, we can explore the support you need.",
  },
  {
    q: "Who’s going to work on my project?",
    a: "You’ll work with the Dot Flavr team. The people involved will depend on your project and what it needs.",
  },
  {
    q: "What if I have only a rough idea?",
    a: "That’s a perfectly good place to start. Bring your scribbles, questions, and half-formed ideas. We’ll explore what’s possible together.",
  },
  {
    q: "How much will it cost?",
    a: "It depends on the scope and complexity of the work. Once we understand your requirements, we’ll share the proposed scope and pricing before we begin.",
  },
  {
    q: "Do you work with small businesses and first-time founders?",
    a: "Yes! We’re open to working with food businesses at different stages, from first-time founders exploring an idea to businesses looking to refine an existing product.",
  },
  {
    q: "Can I reach out after a project is completed?",
    a: "Absolutely. If you need further guidance, get in touch and we can discuss the next steps.",
  },
];

/* ───────────────────────── item ───────────────────────── */

function Item({
  n,
  q,
  a,
  open,
  onToggle,
}: {
  n: number;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = `faq-${n}`;

  return (
    <div className="js-faq-row border-t border-[#800020]/15 last:border-b">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-center gap-5 px-[7px] py-[26px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/40 sm:gap-[22px]"
        >
          <span className="w-5 shrink-0 text-[12px] tabular-nums text-[#ff6f3c]">
            {String(n).padStart(2, "0")}.
          </span>
          <span className="flex-1 font-serif text-[clamp(1.05rem,1.6vw,1.375rem)] font-medium leading-snug tracking-[-0.01em] text-[#800020] transition-colors duration-200 group-hover:text-[#ff6f3c]">
            {q}
          </span>

          {/* + turns into − */}
          <span className="relative h-[17px] w-[17px] shrink-0" aria-hidden>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#800020]/40 transition-colors duration-300 group-hover:bg-[#800020]" />
            <span
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#800020]/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#800020] ${
                open ? "rotate-0 opacity-0" : "rotate-90 opacity-100"
              }`}
            />
          </span>
        </button>
      </h3>

      {/* Smooth height: animate the grid row from 0fr to 1fr */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[46rem] px-5 pb-9 pt-1 text-[15px] leading-[1.65] text-[#800020]/80 sm:text-base">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".js-faq-side > *", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });

        gsap.from(".js-faq-row", {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".js-faq-list", start: "top 85%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    // No overflow-hidden here: it would break the sticky column.
    <section
      ref={root}
      id="faq"
      className="bg-[#fff9eb] px-5 py-24 font-sans text-[#800020] sm:px-8 md:py-32 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-[minmax(0,1fr)_322px] lg:gap-20">
        {/* Right column comes first in the DOM order on mobile */}
        <aside className="js-faq-side self-start lg:sticky lg:top-32 lg:order-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff6f3c]">
            Got questions?
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2rem,2.9vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[#800020]">
            Still curious?
          </h2>
          <p className="mt-6 max-w-[15rem] text-[15px] leading-[1.6] text-[#800020]/75">
            Have a question we haven’t answered? We’re all ears.
          </p>
          <Link
            href="/#contact"
            className="mt-7 inline-flex h-[39px] items-center rounded-full bg-[#800020] px-6 text-[14px] font-medium text-[#fff9eb] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6f3c]"
          >
            Let’s talk →
          </Link>
        </aside>

        {/* Accordion */}
        <div className="js-faq-list lg:order-1">
          <div className="mb-8 px-[7px]">
            <p className="font-newsreader text-[1.15rem] italic text-[#ff6f3c]">A few things you might be wondering about.</p>
          </div>
          {FAQS.map((f, i) => (
            <Item
              key={f.q}
              n={i + 1}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}