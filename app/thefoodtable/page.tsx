"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";

import FoodTablePage from "../components/the-food-table/FoodTablePage";
import { useLenis } from "@/app/lib/scroll";
import { usePreloaderDone } from "@/app/lib/loader-store";

const ease = [0.16, 1, 0.3, 1] as const;
const wipe = [0.76, 0, 0.24, 1] as const;

/**
 * The four parts of the ecosystem. They drop onto the "table" in the intro,
 * and later live on as a section rail on the right edge of the page.
 * `id` is the section id on the page; sections that don't exist are skipped.
 */
const PLACES = [
  { id: "explore-series", label: "Explore" },
  { id: "immersion", label: "Immersion" },
  { id: "workshops", label: "Workshops" },
  { id: "future-ecosystem", label: "Next" }, // hollow: still to come
] as const;

/* ─────────────────────────── shared state ─────────────────────────── */

const StageCtx = createContext({ revealed: false, reduced: false });
const useStage = () => useContext(StageCtx);

/* ─────────────────────────── the stage ───────────────────────────
 *  1. a tabletop line draws across the middle of the screen
 *  2. four dots drop onto it and bounce: three filled, one hollow
 *     (the last is "coming as we grow")
 *  3. the table is pulled apart: top half up, bottom half down
 *  4. the page stands up like a menu card
 * ──────────────────────────────────────────────────────────────── */

function Stage({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const ready = usePreloaderDone();
  const reduced = !!useReducedMotion();

  const [scope, animate] = useAnimate();
  const [playing, setPlaying] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (reduced) {
      setRevealed(true);
      setPlaying(false);
      return;
    }

    let cancelled = false;
    lenisRef.current?.stop();
    window.scrollTo(0, 0);

    (async () => {
      await animate(".ft-line", { scaleX: 1 }, { duration: 0.8, ease: wipe });
      if (cancelled) return;

      animate(".ft-title", { y: "0%" }, { duration: 0.9, ease });
      await animate(
        ".ft-dot",
        { y: ["-70vh", "0vh"] },
        { type: "spring", bounce: 0.4, duration: 1, delay: stagger(0.13) }
      );
      if (cancelled) return;

      await animate(".ft-label", { y: "0%" }, { duration: 0.6, ease, delay: stagger(0.06) });
      if (cancelled) return;

      await new Promise((r) => setTimeout(r, 450));
      if (cancelled) return;

      animate(".ft-line", { opacity: 0 }, { duration: 0.25 });
      setRevealed(true);

      await Promise.all([
        animate(".ft-top", { y: "-100%" }, { duration: 1.1, ease: wipe }),
        animate(".ft-bottom", { y: "100%" }, { duration: 1.1, ease: wipe }),
      ]);
      if (cancelled) return;

      lenisRef.current?.start();
      setPlaying(false);
    })();

    return () => {
      cancelled = true;
      lenisRef.current?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced]);

  const dotCell = "grid w-20 place-items-center md:w-28";

  return (
    <StageCtx.Provider value={{ revealed, reduced }}>
      {children}

      {playing && !reduced && (
        <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
          {/* top half: the title and the dots, standing on the tabletop */}
          <div className="ft-top absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#2a0610]">
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
              <div className="overflow-hidden pb-[0.12em]">
                <p
                  className="ft-title font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#fff9eb]"
                  style={{ transform: "translateY(110%)" }}
                >
                  The Food Table
                </p>
              </div>
              <div className="mt-8 flex gap-5 md:gap-10">
                {PLACES.map((p, i) => (
                  <div key={p.id} className={dotCell}>
                    <span
                      className={`ft-dot block h-12 w-12 rounded-full md:h-14 md:w-14 ${
                        i === PLACES.length - 1
                          ? "border-2 border-dashed border-[#ff6f3c]"
                          : "bg-[#ff6f3c]"
                      }`}
                      style={{ transform: "translateY(-70vh)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom half: a name under each dot */}
          <div className="ft-bottom absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-[#0e0a09]">
            <div className="flex justify-center gap-5 pt-5 md:gap-10">
              {PLACES.map((p) => (
                <div key={p.id} className={`${dotCell} overflow-hidden pb-1`}>
                  <span
                    className="ft-label block text-[12.5px] font-medium text-[#fff9eb]/80"
                    style={{ transform: "translateY(110%)" }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* the tabletop edge */}
          <div
            className="ft-line absolute inset-x-0 top-1/2 z-10 -mt-px h-[2px] origin-left bg-[#ff6f3c]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      )}
    </StageCtx.Provider>
  );
}

/* ─────────────────────────── reveal wrapper ───────────────────────────
 *  The page tips up from the table like a menu card standing upright.
 * ───────────────────────────────────────────────────────────────────── */

const HIDDEN = { y: 80, rotateX: 14, opacity: 0, transformPerspective: 1400 };
const SHOWN = { y: 0, rotateX: 0, opacity: 1, transformPerspective: 1400 };

function Reveal({ children }: { children: ReactNode }) {
  const { revealed, reduced } = useStage();
  const ref = useRef<HTMLDivElement>(null);

  if (reduced) return <>{children}</>;

  return (
    <div className="overflow-x-clip">
      <motion.div
        ref={ref}
        style={{ transformOrigin: "50% 0%" }}
        initial={HIDDEN}
        animate={revealed ? SHOWN : HIDDEN}
        transition={{ duration: 1.3, ease, delay: 0.2 }}
        onAnimationComplete={() => {
          // once upright, drop the transform so sticky / pinned sections behave normally
          if (revealed && ref.current) ref.current.style.transform = "none";
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── section rail ───────────────────────────
 *  The same four dots, now a little capsule on the right edge that
 *  tracks which part of the page you're in. Click to jump.
 *  Only shows dots for sections that actually exist on the page.
 * ───────────────────────────────────────────────────────────────────── */

function SectionRail() {
  const { revealed } = useStage();
  const lenis = useLenis();

  const [found, setFound] = useState<(typeof PLACES)[number][]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!revealed) return;

    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    let io: IntersectionObserver | undefined;

    const scan = () => {
      const list = PLACES.filter((p) => document.getElementById(p.id));
      if (list.length) {
        setFound([...list]);
        // a thin band through the middle of the screen decides the active section
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
          },
          { rootMargin: "-45% 0px -45% 0px" }
        );
        list.forEach((p) => io!.observe(document.getElementById(p.id)!));
      } else if (++tries < 8) {
        timer = setTimeout(scan, 500); // the page may still be mounting
      }
    };

    timer = setTimeout(scan, 600);
    return () => {
      clearTimeout(timer);
      io?.disconnect();
    };
  }, [revealed]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -56, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  if (!revealed || found.length < 2) return null;

  return (
    <motion.nav
      aria-label="Sections"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease }}
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <ul className="flex flex-col items-center gap-3 rounded-full bg-[#0e0a09]/80 px-2.5 py-4 backdrop-blur-md">
        {found.map((p) => {
          const on = active === p.id;
          const hollow = p.id === "future-ecosystem";
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => go(p.id)}
                aria-label={`Go to ${p.label}`}
                aria-current={on ? "true" : undefined}
                className="group relative grid h-5 w-5 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f3c]"
              >
                <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-full bg-[#0e0a09] px-3 py-1 font-jakarta text-[12px] font-medium text-[#fff9eb] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {p.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    on
                      ? "h-3.5 w-3.5 bg-[#ff6f3c]"
                      : hollow
                      ? "h-2.5 w-2.5 border border-dashed border-[#fff9eb]/70"
                      : "h-2.5 w-2.5 bg-[#fff9eb]/40 group-hover:bg-[#fff9eb]/80"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function TheFoodTable() {
  return (
    <Stage>
      <Reveal>
        <FoodTablePage />
      </Reveal>
      <SectionRail />
    </Stage>
  );
}