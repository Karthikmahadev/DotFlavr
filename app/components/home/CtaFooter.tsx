"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Words } from "../ui/Words";

/* ───────────────────────── data ───────────────────────── */

type FLink = { label: string; href: string };
type FGroup = { title: string; links: FLink[] };

// 4-column simplified footer navigation
const COLUMNS: FGroup[] = [
  {
    title: "Dot Flavr",
    links: [
      { label: "Studio Overview", href: "/#about" },
      { label: "Food Consultancy", href: "/#services" },
      { label: "Innovation & R&D", href: "/#process" },
      { label: "Work With Us", href: "/#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Product Development", href: "/#services" },
      { label: "Reformulation", href: "/#services" },
      { label: "Shelf-life & Stability", href: "/#services" },
      { label: "Scale-up", href: "/#services" },
    ],
  },
  {
    title: "The Food Table",
    links: [
      { label: "About Ecosystem", href: "/#the-food-table" },
      { label: "Explore Series", href: "/#explore-series" },
      { label: "Industry Immersion", href: "/#immersion" },
      { label: "Workshops", href: "/#workshops" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Work With Us", href: "/#contact" },
      { label: "College Partnerships", href: "/#contact" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "WhatsApp Chat", href: "https://wa.me/" },
    ],
  },
];

// A sample trial sheet, the kind a food technologist fills in per batch.
const SHEET = {
  no: "07",
  product: "Shelf-stable sauce base",
  rows: [
    { k: "Brix", v: "62°" },
    { k: "pH", v: "3.9" },
    { k: "Water activity", v: "0.84" },
    { k: "Shelf life", v: "9 months" },
  ],
  status: "Cleared for scale-up",
};

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const isExternal = (href: string) => href.startsWith("http");

/* ───────────────────────── small pieces ───────────────────────── */

function Check({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

/** Rotating process stamp: the whole service, written round a dot. */
function Stamp() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="js-stamp h-full w-full"
      aria-hidden
    >
      <defs>
        <path
          id="dotflavr-stamp"
          d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"
        />
      </defs>
      <text
        fontSize="10.5"
        fontWeight="600"
        fill="#fff"
        textLength="292"
        lengthAdjust="spacing"
      >
        <textPath href="#dotflavr-stamp" textLength="292" lengthAdjust="spacing">
          Formulate • Trial • Scale up • Shelf test •
        </textPath>
      </text>
    </svg>
  );
}

/** Footer link with a dot that grows in from the left on hover. */
function FooterLink({ label, href }: FLink) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center text-[12.5px] leading-snug text-neutral-700 transition-colors duration-300 hover:text-neutral-950 focus-visible:text-neutral-950 focus-visible:outline-none"
    >
      <span
        aria-hidden
        className="mr-0 inline-block h-1.5 w-0 rounded-full bg-[#ff6f3c] transition-all duration-300 ease-out group-hover:mr-2 group-hover:w-1.5 group-focus-visible:mr-2 group-focus-visible:w-1.5"
      />
      {label}
    </Link>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function CtaFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".js-cta-photo",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".js-cta-hero",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: ".js-cta-hero", start: "top 60%", once: true },
        });
        tl.from(".js-word", { yPercent: 110, duration: 1.3, stagger: 0.08 })
          .from(".js-cta-fade", { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.09 }, 0.2);

        // the stamp is the one thing that keeps moving
      // Rotate the stamp only when it exists in the rendered DOM.
const stamp = root.current?.querySelector(".js-stamp");

if (stamp) {
  gsap.to(stamp, {
    rotation: 360,
    duration: 26,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });
}
        gsap.from(".js-footer", {
          yPercent: 8,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".js-footer", start: "top 92%", once: true },
        });
        gsap.from(".js-foot-col", {
          autoAlpha: 0,
          y: 16,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".js-footer", start: "top 80%", once: true },
        });
        gsap.from(".js-wordmark", {
          yPercent: 55,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: ".js-footer", start: "top 55%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-[#0e0a09] font-jakarta">
      {/* ───────── Hero ───────── */}
      <div className="js-cta-hero relative h-[72svh] min-h-[540px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_40%,#ff6f3c_0%,#800020_45%,#1f050b_85%)]" />
        <div className="absolute inset-x-0 -inset-y-[8%]">
          <Image
            src="/images/ingredients.jpg"
            alt="Food formulation and innovation"
            fill
            sizes="100vw"
            className="js-cta-photo object-cover object-[60%_30%] opacity-45 will-change-transform"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

        {/* halftone dots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.26) 1.3px, transparent 1.7px)",
            backgroundSize: "20px 20px",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 70% at 88% 45%, #000 0%, transparent 70%)",
            maskImage:
              "radial-gradient(ellipse 55% 70% at 88% 45%, #000 0%, transparent 70%)",
          }}
        />
        {/* film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />

        {/* ── Reduced trial sheet (desktop only) supporting the design ── */}
        {/* <div className="js-cta-fade absolute right-12 top-1/2 hidden -translate-y-[56%] scale-90 lg:block xl:right-20">
          <div className="relative -rotate-[3deg]">
            <div className="w-[15.5rem] rounded-[3px] bg-[#FAFAF8] p-4 text-neutral-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-[10.5px] text-neutral-500">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6f3c]" />
                  Trial sheet
                </span>
                <span className="tabular-nums">Batch {SHEET.no}</span>
              </div>

              <p className="mt-3 text-[16px] font-medium leading-tight tracking-[-0.02em]">
                {SHEET.product}
              </p>

              <dl className="mt-3 text-[11px]">
                {SHEET.rows.map((r) => (
                  <div
                    key={r.k}
                    className="flex items-baseline justify-between border-t border-dashed border-neutral-300 py-1.5"
                  >
                    <dt className="text-neutral-500">{r.k}</dt>
                    <dd className="font-semibold tabular-nums">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-1 flex items-center gap-2 border-t border-neutral-900 pt-2.5 text-[11px] font-semibold">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ff6f3c] text-white">
                  <Check size={9} />
                </span>
                {SHEET.status}
              </p>
            </div>

           
            <div className="absolute -bottom-10 -left-12 grid h-[6.2rem] w-[6.2rem] place-items-center rounded-full bg-[#800020] shadow-[0_12px_25px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
              <div className="absolute inset-0">
                <Stamp />
              </div>
              <span className="h-4 w-4 rounded-full bg-[#ff6f3c]" aria-hidden />
            </div>
          </div>
        </div> */}

        <div className="relative z-10 flex h-full flex-col justify-center px-6 pb-20 pt-20 text-white md:px-12 lg:px-16">
          <p className="js-cta-fade font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff9eb]/85">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#ff6f3c] align-middle" />
            Dot Flavr · Food R&amp;D Studio
          </p>

          <h2 className="mt-4 text-[clamp(2.3rem,4.8vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            <Words text="Have a food idea?" mask />
            <br />
            <Words text="Let's make it work." mask />
          </h2>

          <p className="js-cta-fade mt-3 max-w-lg text-[15px] font-normal leading-relaxed text-white/80">
            From first concept to formulation and scale-up, let&apos;s explore what your product needs.
          </p>

          <div className="js-cta-fade mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fff9eb] py-2.5 pl-6 pr-2.5 text-[13px] font-medium text-[#0e0a09] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Work With Us
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ff6f3c] text-white transition-transform duration-300 group-hover:scale-110">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </Link>
            <Link
              href="/#the-food-table"
              className="rounded-full bg-white/10 px-6 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore The Food Table
            </Link>
          </div>
        </div>
      </div>

      {/* ───────── Footer card with 4 columns ───────── */}
      <footer className="js-footer relative z-10 -mt-10 mx-1 overflow-hidden rounded-t-[1.6rem] bg-[#FAFAF8] px-6 pt-10 text-neutral-900 md:mx-1.5 md:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.8fr)] items-start">
          {/* Left: Brand info & simplified studio details */}
          <div className="js-foot-col">
            <Link
              href="/"
              className="inline-block font-syne text-[24px] font-extrabold leading-none tracking-[-0.04em]"
              aria-label="Dot Flavr home"
            >
              <img
                src="/dotflavrnavbar.png"
                alt="Dot Flavr"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-[19rem] text-[12.5px] leading-relaxed text-neutral-600">
              Food consultancy and product innovation studio based in Coimbatore.
            </p>

            <div className="mt-6 flex items-start gap-3 border-l-2 border-[#ff6f3c] pl-3">
              <div>
                <p className="text-[12px] font-semibold text-neutral-900">Founder &amp; Studio</p>
                <p className="mt-0.5 text-[12px] text-neutral-600">Taniskaa Shanmugam</p>
                <p className="mt-0.5 text-[11px] text-neutral-400">
                  Coimbatore, Tamil Nadu, India
                </p>
              </div>
            </div>
          </div>

          {/* Right: 4 Balanced Columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title} className="js-foot-col">
                <nav aria-label={col.title} className="relative border-t border-neutral-200 pt-4">
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 h-[2px] w-8 bg-[#ff6f3c]"
                  />
                  <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-950">
                    {col.title}
                  </h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FooterLink {...l} />
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized background wordmark (reduced slightly in height/scale) */}
        <div
          aria-hidden
          className="mt-8 select-none overflow-hidden"
        >
          <div className="js-wordmark whitespace-nowrap font-syne text-[clamp(2.8rem,10.5vw,9.5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-[#ece7df]">
            Dot Flavr<span className="text-[#ff6f3c]">.</span>
          </div>
        </div>

        {/* Compact Legal row */}
        <div className="relative flex flex-col gap-2 border-t border-neutral-200 py-4 text-[11px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dot Flavr. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-neutral-900">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-neutral-900">Terms of Service</Link>
            <Link href="/#contact" className="transition-colors hover:text-[#ff6f3c]">Contact</Link>
          </div>
        </div>
      </footer>
    </section>
  );
}