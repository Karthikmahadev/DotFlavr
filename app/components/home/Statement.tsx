"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "motion/react";
import type { IconHandle } from "@animateicons/react";
import {
  AtomIcon,
  CoffeeIcon,
  CookieIcon,
  FlaskConicalIcon,
  LeafIcon,
  LightbulbIcon,
  RocketIcon,
  SproutIcon,
  ThermometerIcon,
  TimerIcon,
} from "@animateicons/react/lucide";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

type IconComp = typeof FlaskConicalIcon;

type Item =
  | { kind: "text"; markup: string }
  | {
      kind: "icon";
      Icon: IconComp;
      bg: string;
      fg: string;
      tilt: number;
    };

const CONTENT: Item[] = [
  { kind: "text", markup: "Good ideas." },
  {
    kind: "icon",
    Icon: LightbulbIcon,
    bg: "#ffb08a",
    fg: "#800020",
    tilt: -7,
  },
  { kind: "text", markup: "Better *food products.*" },
  {
    kind: "icon",
    Icon: CookieIcon,
    bg: "#ff6f3c",
    fg: "#fff9eb",
    tilt: 5,
  },
  {
    kind: "text",
    markup:
      "We bring together *food science,* practical trials and product innovation",
  },
  {
    kind: "icon",
    Icon: FlaskConicalIcon,
    bg: "#800020",
    fg: "#fff9eb",
    tilt: -5,
  },
  {
    kind: "text",
    markup: "to move ideas towards *commercialisation.*",
  },
  {
    kind: "icon",
    Icon: RocketIcon,
    bg: "#ff6f3c",
    fg: "#fff9eb",
    tilt: 6,
  },
];

const DOODLES: {
  Icon: IconComp;
  cls: string;
  depth: number;
}[] = [
  {
    Icon: LeafIcon,
    cls: "left-[5%] top-[12%] h-14 w-14 md:h-24 md:w-24",
    depth: 0.7,
  },
  {
    Icon: AtomIcon,
    cls: "right-[6%] top-[10%] h-16 w-16 md:h-28 md:w-28",
    depth: 1.2,
  },
  {
    Icon: SproutIcon,
    cls: "left-[8%] bottom-[12%] h-14 w-14 md:h-24 md:w-24",
    depth: 1,
  },
  {
    Icon: CoffeeIcon,
    cls: "right-[7%] bottom-[13%] h-14 w-14 md:h-24 md:w-24",
    depth: 0.55,
  },
  {
    Icon: ThermometerIcon,
    cls: "left-[2%] top-[44%] hidden h-20 w-20 lg:block",
    depth: 1.4,
  },
  {
    Icon: TimerIcon,
    cls: "right-[2.5%] top-[46%] hidden h-20 w-20 lg:block",
    depth: 0.85,
  },
];

const INK = "#800020";
const ORANGE = "#ff6f3c";

/* ------------------------------------------------------------------ */
/* Icon sticker                                                       */
/* ------------------------------------------------------------------ */

function Sticker({
  item,
  index,
  active,
}: {
  item: Extract<Item, { kind: "icon" }>;
  index: number;
  active: boolean;
}) {
  const ref = useRef<IconHandle>(null);
  const { Icon } = item;

  useEffect(() => {
    if (!active) return;

    const id = window.setInterval(
      () => ref.current?.startAnimation(),
      4200 + index * 900
    );

    return () => window.clearInterval(id);
  }, [active, index]);

  return (
    <span
      aria-hidden="true"
      className="js-item js-pic pointer-events-auto relative inline-flex h-[0.74em] w-[1.4em] shrink-0 align-middle"
    >
      <motion.span
        animate={{ rotate: item.tilt }}
        whileHover={{
          scale: 1.16,
          rotate: -item.tilt * 1.4,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 13,
        }}
        onHoverStart={() => ref.current?.startAnimation()}
        onHoverEnd={() => ref.current?.stopAnimation()}
        className="grid h-full w-full cursor-pointer place-items-center rounded-full shadow-md ring-1 ring-[#800020]/15"
        style={
          {
            backgroundColor: item.bg,
            color: item.fg,
          } as CSSProperties
        }
      >
        <Icon
          ref={ref}
          color={item.fg}
          className="h-[0.42em] w-[0.42em] [&_svg]:h-full [&_svg]:w-full"
        />
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Background doodle                                                  */
/* ------------------------------------------------------------------ */

function Doodle({
  Icon,
  cls,
  depth,
}: {
  Icon: IconComp;
  cls: string;
  depth: number;
}) {
  const ref = useRef<IconHandle>(null);

  return (
    <div
      aria-hidden="true"
      className={`js-doodle absolute z-0 ${cls}`}
      data-depth={depth}
    >
      <div className="js-drift h-full w-full" data-depth={depth}>
        <motion.div
          whileHover={{ scale: 1.18, rotate: 9 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          onHoverStart={() => ref.current?.startAnimation()}
          className="h-full w-full text-[#800020] opacity-[0.15] transition-opacity duration-500 hover:opacity-80 [&_svg]:h-full [&_svg]:w-full [&_svg]:[stroke-width:1.1]"
        >
          <Icon ref={ref} className="h-full w-full" />
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Statement section                                                  */
/* ------------------------------------------------------------------ */

export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.35 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* -------------------------------------------------------------- */
      /* Scroll animation: text and icons visible by default, doodles move.*/
      /* -------------------------------------------------------------- */

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".js-tok", {
          yPercent: 0,
          opacity: 1,
        });

        gsap.set(".js-word", {
          y: 0,
          scale: 1,
        });

        gsap.set(".js-mark", {
          scaleX: 1,
        });

        gsap.set(".js-pic", {
          scale: 1,
          opacity: 1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            // FIX: re-measure pin width/height whenever layout changes
            // (e.g. when the vertical scrollbar appears), so the
            // pin-spacer never keeps a stale, too-wide pixel width.
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
          defaults: { ease: "none" },
        });

        tl.to({}, { duration: 0.6 });

        tl.to(
          ".js-doodle",
          {
            y: (_i: number, el: HTMLElement) =>
              -Number(el.dataset.depth) * 110,
            rotate: (_i: number, el: HTMLElement) =>
              Number(el.dataset.depth) * 14,
            duration: tl.duration(),
          },
          0
        );
      });

      /* -------------------------------------------------------------- */
      /* Cursor effects for mouse / trackpad users.                     */
      /* -------------------------------------------------------------- */

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = root.current;
          if (!el) return;

          const lamp = el.querySelector<HTMLElement>(".js-lamp");
          const words = gsap.utils.toArray<HTMLElement>(
            ".js-word",
            el
          );

          const toks = words.map((w) =>
            w.querySelector<HTMLElement>(".js-tok")
          );

          const near = words.map(() => 0);

          const drifts = gsap.utils
            .toArray<HTMLElement>(".js-drift", el)
            .map((d) => ({
              x: gsap.quickTo(d, "x", {
                duration: 1.2,
                ease: "power3.out",
              }),
              y: gsap.quickTo(d, "y", {
                duration: 1.2,
                ease: "power3.out",
              }),
              k: Number(d.dataset.depth),
            }));

          const pos = {
            x: el.clientWidth * 0.5,
            y: el.clientHeight * 0.45,
          };

          const apply = () => {
            lamp?.style.setProperty("--mx", `${pos.x}px`);
            lamp?.style.setProperty("--my", `${pos.y}px`);
          };

          apply();

          const set = (i: number, f: number) => {
            near[i] = f;

            gsap.to(words[i], {
              y: -f * 12,
              scale: 1 + f * 0.07,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (toks[i]) {
              gsap.to(toks[i], {
                color: gsap.utils.interpolate(INK, ORANGE, f),
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;

            gsap.to(pos, {
              x: px,
              y: py,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
              onUpdate: apply,
            });

            const nx = px / rect.width - 0.5;
            const ny = py / rect.height - 0.5;

            drifts.forEach((d) => {
              d.x(-nx * 34 * d.k);
              d.y(-ny * 34 * d.k);
            });

            words.forEach((w, i) => {
              const r = w.getBoundingClientRect();

              const d = Math.hypot(
                e.clientX - (r.left + r.width / 2),
                e.clientY - (r.top + r.height / 2)
              );

              const f = Math.max(0, 1 - d / 170);

              if (Math.abs(f - near[i]) > 0.02) {
                set(i, f);
              }
            });
          };

          const onLeave = () => {
            words.forEach((_, i) => {
              if (near[i] !== 0) set(i, 0);
            });

            drifts.forEach((d) => {
              d.x(0);
              d.y(0);
            });
          };

          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);

          return () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          };
        }
      );

      /* -------------------------------------------------------------- */
      /* Reduced motion: everything is immediately visible.             */
      /* -------------------------------------------------------------- */

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".js-tok", {
          yPercent: 0,
          opacity: 1,
        });

        gsap.set(".js-word", {
          y: 0,
          scale: 1,
        });

        gsap.set(".js-mark", {
          scaleX: 1,
        });

        gsap.set(".js-pic", {
          scale: 1,
          opacity: 1,
        });

        gsap.set(".js-doodle", {
          y: 0,
          rotate: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // FIX: once everything (fonts, images, other sections) has loaded,
  // re-measure so the pin-spacer width matches the real layout.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }

    document.fonts?.ready.then(refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  let iconIndex = 0;

  return (
    <section
      ref={root}
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#fff9eb] px-5 py-16 text-[#800020] sm:px-8 sm:py-20 lg:h-svh lg:py-0"
    >
      {/* Notebook dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,black_100%)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,black_100%)]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(128,0,32,0.16) 1px, transparent 1.3px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Cursor lantern */}
      <div
        aria-hidden="true"
        className="js-lamp pointer-events-none absolute inset-0 hidden lg:block"
        style={
          {
            "--mx": "50%",
            "--my": "45%",
            background:
              "radial-gradient(circle 30vmax at var(--mx) var(--my), rgba(255,111,60,0.13) 0%, rgba(255,111,60,0) 60%)",
          } as CSSProperties
        }
      />

      {/* Background ingredients */}
      {DOODLES.map((d, i) => (
        <Doodle key={i} {...d} />
      ))}

      {/* Statement */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[76rem]">
        <h2 className="flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-[0.18em] text-center font-serif text-[clamp(2.1rem,4.8vw,5.2rem)] font-medium leading-[1.08] tracking-[-0.03em]">
          {CONTENT.map((item, i) => {
            if (item.kind === "icon") {
              return (
                <Sticker
                  key={i}
                  item={item}
                  index={iconIndex++}
                  active={inView}
                />
              );
            }

            return item.markup.split("*").map((part, pi) => {
              const hot = pi % 2 === 1;

              return part
                .split(/\s+/)
                .filter(Boolean)
                .map((w, wi) => (
                  <span
                    key={`${i}-${pi}-${wi}`}
                    className="js-item js-word relative inline-block py-0.5"
                  >
                    {hot && (
                      <span
                        aria-hidden="true"
                        className="js-mark absolute inset-x-0 bottom-[0.14em] h-[0.4em] origin-left rounded-[0.12em_0.32em_0.16em_0.28em] bg-[#ff6f3c]/30"
                      />
                    )}

                    <span
                      className={`js-tok relative inline-block ${
                        hot ? "italic" : ""
                      }`}
                    >
                      {w}
                    </span>
                  </span>
                ));
            });
          })}
        </h2>
      </div>
    </section>
  );
}