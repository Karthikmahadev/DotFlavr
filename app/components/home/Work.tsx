// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// type Project = {
//   title: string;
//   sub: string;
//   stage: string;
//   href: string;
//   img: string;
//   bg: string;
// };

// const PROJECTS: Project[] = [
//   { title: "Protein Bar", sub: "Formulation & texture optimisation", stage: "Bench → Pilot", href: "/projects/protein-bar", img: "/images/work/01.jpg", bg: "#800020" },
//   { title: "Clean Brew", sub: "Shelf-life & retort processing", stage: "Pilot → Scale", href: "/projects/clean-brew", img: "/images/work/02.jpg", bg: "#ff6f3c" },
//   { title: "Flora Snack", sub: "Moisture & barrier packaging", stage: "Bench", href: "/projects/flora-snack", img: "/images/work/03.jpg", bg: "#3a2a1a" },
//   { title: "Millet Crunch", sub: "Extrusion & commercial scale-up", stage: "Pilot → Scale", href: "/projects/millet-crunch", img: "/images/work/04.jpg", bg: "#2d161c" },
//   { title: "Hydra Electrolyte", sub: "Functional flavour balancing", stage: "Bench → Pilot", href: "/projects/hydra-electrolyte", img: "/images/work/05.jpg", bg: "#ff6f3c" },
//   { title: "Dairy Alternative", sub: "Emulsion & sensory profiling", stage: "Bench", href: "/projects/dairy-alternative", img: "/images/work/06.jpg", bg: "#800020" },
//   { title: "Botanical Elixir", sub: "Natural preservation & stability", stage: "Pilot", href: "/projects/botanical-elixir", img: "/images/work/07.jpg", bg: "#4a121a" },
//   { title: "Active Spread", sub: "Water activity & viscosity trials", stage: "Bench → Pilot", href: "/projects/active-spread", img: "/images/work/08.jpg", bg: "#ff6f3c" },
//   { title: "Bake Lab", sub: "Clean-label reformulation", stage: "Pilot → Scale", href: "/projects/bake-lab", img: "/images/work/09.jpg", bg: "#6b1426" },
// ];

// const pad = (n: number, len = 2) => String(n).padStart(len, "0");

// // Shared sizing: card height comes from the space left under the heading.
// const CARD_W = "lg:w-[clamp(16rem,calc(var(--card-h)*0.88),24rem)]";
// const CARD_H = "h-[22rem] lg:h-[var(--card-h)]";

// function Trial({ p, i }: { p: Project; i: number }) {
//   const arch = i % 3 === 0;
//   const low = i % 2 === 1;

//   return (
//     <Link
//       href={p.href}
//       className={`js-trial group block w-[78vw] shrink-0 snap-start outline-none sm:w-[22rem] ${CARD_W} ${
//         low ? "lg:mt-[min(3rem,5svh)]" : ""
//       }`}
//     >
//       <div className="mb-2.5 flex items-baseline justify-between font-spacemono text-[11px] uppercase tracking-[0.2em] text-[#2a0610]/55">
//         <span>Trial {pad(i + 1, 3)}</span>
//         <span className="text-[#ff6f3c]">{p.stage}</span>
//       </div>

//       <div
//         className={`relative overflow-hidden transition-[border-radius] duration-700 ${CARD_H} ${
//           arch ? "rounded-t-[999px]" : "rounded-none group-hover:rounded-t-[2.5rem]"
//         }`}
//         style={{ backgroundColor: p.bg }}
//       >
//         <Image
//           src={p.img}
//           alt={`${p.title}: ${p.sub}`}
//           fill
//           sizes="(min-width:1024px) 384px, 78vw"
//           className="js-pimg scale-[1.22] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.3]"
//         />
//         <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#fff9eb] px-3 py-2 font-spacemono text-[10px] uppercase tracking-[0.18em] text-[#2a0610] opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
//           View case <span aria-hidden>→</span>
//         </span>
//       </div>

//       <h3 className="mt-4 font-display text-[clamp(1.8rem,2.4vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.04em] transition-colors duration-300 group-hover:text-[#ff6f3c]">
//         {p.title}
//       </h3>
//       <p className="mt-1 font-newsreader text-[1.1rem] italic leading-snug text-[#2a0610]/65">
//         {p.sub}
//       </p>
//     </Link>
//   );
// }

// export default function Work() {
//   const root = useRef<HTMLElement>(null);
//   const stage = useRef<HTMLDivElement>(null);
//   const view = useRef<HTMLDivElement>(null);
//   const track = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       const mm = gsap.matchMedia();

//       mm.add("(prefers-reduced-motion: no-preference)", () => {
//         gsap.from(".js-w-in", {
//           yPercent: 110,
//           duration: 1.3,
//           ease: "expo.out",
//           stagger: 0.08,
//           scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
//         });
//         gsap.from(".js-w-fade", {
//           autoAlpha: 0,
//           y: 18,
//           duration: 1,
//           ease: "expo.out",
//           stagger: 0.1,
//           scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
//         });
//       });

//       // Desktop: pin, then walk the shelf.
//       mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
//         const s = stage.current;
//         const v = view.current;
//         const t = track.current;
//         if (!s || !v || !t) return;

//         gsap.set(v, { overflowX: "hidden" });

//         const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
//         const countEl = s.querySelector<HTMLElement>(".js-count");
//         const barEl = s.querySelector<HTMLElement>(".js-bar");
//         let last = -1;

//         gsap.to(t, {
//           x: () => -dist(),
//           ease: "none",
//           scrollTrigger: {
//             trigger: s,
//             start: "top top",
//             end: () => `+=${dist()}`,
//             scrub: 0.6,
//             pin: true,
//             anticipatePin: 1,
//             invalidateOnRefresh: true,
//             onUpdate: (self) => {
//               if (barEl) barEl.style.transform = `scaleX(${self.progress})`;
//               const n = Math.min(
//                 PROJECTS.length,
//                 Math.max(1, Math.floor(self.progress * PROJECTS.length) + 1)
//               );
//               if (countEl && n !== last) {
//                 last = n;
//                 countEl.textContent = pad(n);
//               }
//             },
//           },
//         });

//         // Photos drift inside their frames. The 1.22 scale leaves ~11% spare each side,
//         // so a ±5% drift never shows the backing colour.
//         gsap.fromTo(
//           ".js-pimg",
//           { xPercent: -5 },
//           {
//             xPercent: 5,
//             ease: "none",
//             scrollTrigger: {
//               trigger: s,
//               start: "top top",
//               end: () => `+=${dist()}`,
//               scrub: 0.6,
//               invalidateOnRefresh: true,
//             },
//           }
//         );
//       });
//     },
//     { scope: root }
//   );

//   return (
//     <section ref={root} id="projects" className="bg-[#fff9eb] text-[#2a0610]">
//       <div
//         ref={stage}
//         // --card-h = viewport height minus navbar, heading, labels and caption.
//         className="flex flex-col justify-center gap-10 py-24 lg:h-svh lg:gap-[2.5svh] lg:overflow-hidden lg:pb-[3svh] lg:pt-[calc(4rem+1.5svh)] lg:[--card-h:clamp(11rem,calc(100svh_-_24.5rem),28rem)]"
//       >
//         {/* Heading row */}
//         <div className="flex flex-col gap-6 px-6 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:px-16">
//           <div>
//             <p className="js-w-fade font-newsreader text-[1.1rem] italic text-[#ff6f3c]">
//               The trial shelf
//             </p>
//             <h2 className="mt-1 font-display text-[clamp(2.6rem,5.6vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.045em] lg:text-[min(5.2vw,9.5svh)]">
//               <span className="block overflow-hidden py-[0.06em]">
//                 <span className="js-w-in block">Tested until</span>
//               </span>
//               <span className="block overflow-hidden py-[0.06em]">
//                 <span className="js-w-in block">
//                   it <em className="text-[#ff6f3c]">tasted right.</em>
//                 </span>
//               </span>
//             </h2>
//           </div>

//           <div className="js-w-fade flex items-end gap-8 lg:gap-10">
//             <p className="max-w-[17rem] text-[14px] leading-[1.6] text-[#2a0610]/70">
//               A few of the products we have taken from a bench idea to something ready for
//               production.
//             </p>
//             <div className="hidden w-40 shrink-0 lg:block">
//               <p className="flex items-baseline justify-between font-spacemono text-[11px] uppercase tracking-[0.2em]">
//                 <span className="text-[#2a0610]/50">Trial</span>
//                 <span>
//                   <span className="js-count text-[#ff6f3c]">01</span>
//                   <span className="text-[#2a0610]/40"> / {pad(PROJECTS.length)}</span>
//                 </span>
//               </p>
//               <span className="mt-2 block h-px bg-[#2a0610]/20">
//                 <span
//                   className="js-bar block h-full origin-left bg-[#ff6f3c]"
//                   style={{ transform: "scaleX(0)" }}
//                 />
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* The shelf */}
//         <div
//           ref={view}
//           className="js-view snap-x snap-mandatory overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:snap-none lg:pb-0 [&::-webkit-scrollbar]:hidden"
//         >
//           <div
//             ref={track}
//             className="js-track flex w-max items-start gap-6 px-6 md:px-12 lg:gap-10 lg:px-16"
//           >
//             {PROJECTS.map((p, i) => (
//               <Trial key={p.title} p={p} i={i} />
//             ))}

//             {/* Last slide: an invitation, same height as the photos */}
//             <Link
//               href="/#contact"
//               className={`group relative flex w-[78vw] shrink-0 snap-start flex-col justify-between overflow-hidden bg-[#2a0610] p-8 text-[#fff9eb] sm:w-[22rem] lg:mr-[6vw] lg:mt-[calc(1.1rem+10px)] ${CARD_W} ${CARD_H}`}
//             >
//               <span className="font-spacemono text-[11px] uppercase tracking-[0.2em] text-[#ffb08a]">
//                 Trial {pad(PROJECTS.length + 1, 3)}
//               </span>
//               <span className="font-display text-[clamp(2.2rem,3.2vw,3.2rem)] font-medium leading-[0.92] tracking-[-0.04em]">
//                 Next trial:
//                 <br />
//                 <em className="text-[#ff6f3c]">yours.</em>
//               </span>
//               <span className="flex items-center gap-3 text-[15px]">
//                 Pull up a chair
//                 <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">
//                   →
//                 </span>
//               </span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PROBLEMS = [
  {
    no: "01",
    tag: "Concept to Prototype",
    title: "From idea to formulation",
    desc: "Translating kitchen-table concepts or raw ingredient thoughts into stable, measurable bench prototypes with correct brix, pH, and water activity thresholds.",
    deliverable: "Benchtop sample + initial spec sheet",
  },
  {
    no: "02",
    tag: "Troubleshooting & Stability",
    title: "When a product isn't working",
    desc: "Investigating phase separation, syneresis, textural breakdown, off-flavors, or unexpected microbial shelf-life failure in existing commercial formulations.",
    deliverable: "Root-cause audit + corrective matrix",
  },
  {
    no: "03",
    tag: "Process Standardization",
    title: "From trial to repeatable process",
    desc: "Converting successful lab trials into rigorous Standard Operating Procedures (SOPs) and scaling up safely for co-packer and industrial retort/extrusion runs.",
    deliverable: "Pilot-scale SOP + batch yield calculation",
  },
];

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useGSAP(
    () => {
      // Gentle header entrance animation only
      gsap.from(".js-solve-header", {
        y: 15,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
      });
    },
    { scope: root }
  );

  return (
    <main
      ref={root}
      className="relative min-h-screen bg-[#fff9eb] px-6 py-28 text-[#2a0610] md:px-12 lg:px-20 overflow-x-hidden"
    >
      {/* Subtle Ledger Grid Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(128,0,32,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,0,32,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        {/* Header */}
        <div className="js-solve-header border-b border-[#2a0610]/15 pb-12 pt-6">
          <p className="font-spacemono text-[11px] uppercase tracking-[0.25em] text-[#ff6f3c]">
            02 / What We Solve
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5.5vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Challenges our studio <br />
            <span className="italic text-[#ff6f3c]">helps navigate.</span>
          </h1>
          <p className="mt-5 max-w-2xl font-newsreader text-[1.2rem] italic leading-relaxed text-[#2a0610]/80">
            Before food ideas reach supermarket shelves or cold chains, they hit technical roadblocks. Here is where we step in with bench rigor and industrial experience.
          </p>
        </div>

        {/* Horizontal Row Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {PROBLEMS.map((item, index) => {
            const isOpen = activeTab === index;
            return (
              <div
                key={item.no}
                onClick={() => setActiveTab(index)}
                className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[4px] border transition-all duration-300 ${
                  isOpen
                    ? "border-[#ff6f3c] bg-[#800020] text-[#fff9eb] shadow-[0_20px_40px_-15px_rgba(42,6,16,0.35)] -translate-y-1"
                    : "border-[#2a0610]/15 bg-white/70 text-[#2a0610] hover:border-[#ff6f3c]/60 hover:bg-white"
                } p-6 sm:p-8`}
              >
                <div>
                  {/* Top Meta row */}
                  <div className="flex items-center justify-between font-spacemono text-[11px] uppercase tracking-[0.2em]">
                    <span className={isOpen ? "text-[#ffb08a]" : "text-[#800020]/60"}>
                      {item.no} — {item.tag}
                    </span>
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-[#ff6f3c] text-white" : "border border-[#2a0610]/20"
                      }`}
                    >
                      +
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="mt-6">
                    <h3 className="font-display text-[1.6rem] font-medium leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p
                      className={`mt-3 text-[14px] leading-relaxed ${
                        isOpen ? "text-[#fff9eb]/85" : "text-[#2a0610]/70"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Deliverable Callout Box at bottom of card */}
                <div
                  className={`mt-8 rounded-[3px] p-4 ${
                    isOpen
                      ? "bg-black/25 text-[#fff9eb] ring-1 ring-white/10"
                      : "bg-[#fff9eb] text-[#2a0610]/80 border border-[#2a0610]/10"
                  }`}
                >
                  <p className="font-spacemono text-[10px] uppercase tracking-[0.18em] opacity-60">
                    Typical Deliverable
                  </p>
                  <p className="mt-1 font-newsreader text-[1.05rem] italic">
                    {item.deliverable}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Conversion Banner */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[4px] border border-[#2a0610]/20 bg-[#2a0610] p-8 text-[#fff9eb] sm:flex-row sm:items-center md:p-12">
          <div>
            <p className="font-spacemono text-[11px] uppercase tracking-[0.2em] text-[#ff6f3c]">
              Ready to test your formulation?
            </p>
            <h3 className="mt-2 font-display text-2xl font-medium sm:text-3xl">
              Recognise your own problem here?
            </h3>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#ff6f3c] px-7 text-[13px] font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            Start a Consultation →
          </Link>
        </div>
      </div>
    </main>
  );
}