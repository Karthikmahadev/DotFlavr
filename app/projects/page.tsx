"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  stagger,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import Work from "../components/home/Work";
import { useLenis } from "@/app/lib/scroll";
import { usePreloaderDone } from "@/app/lib/loader-store";

const ease = [0.16, 1, 0.3, 1] as const;
const wipe = [0.76, 0, 0.24, 1] as const;

const LABEL = "Selected work";
const COLUMNS = 6;

/* ─────────────────────────── shared state ─────────────────────────── */

const StageCtx = createContext({ revealed: false, reduced: false });
const useStage = () => useContext(StageCtx);

/* ─────────────────────────── the stage ───────────────────────────
 *  1. "Selected work" rises letter by letter over six dark panels
 *  2. the full stop pops in as an orange dot
 *  3. the panels lift away one after another, from the middle outwards
 *  4. the page opens like a window growing to full size
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
      await animate(
        ".pi-char",
        { y: "0%" },
        { duration: 0.85, ease, delay: stagger(0.035) }
      );
      if (cancelled) return;

      await animate(".pi-dot", { scale: [0, 1.5, 1] }, { duration: 0.55, ease });
      if (cancelled) return;

      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      animate(".pi-label", { opacity: 0, y: -16 }, { duration: 0.35 });
      setRevealed(true);

      await animate(
        ".pi-col",
        { y: "-101%" },
        { duration: 1, ease: wipe, delay: stagger(0.07, { from: "center" }) }
      );
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

  return (
    <StageCtx.Provider value={{ revealed, reduced }}>
      {children}

      {playing && !reduced && (
        <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
          {/* six panels, alternating the loader's burgundy and near-black */}
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <div
                key={i}
                className="pi-col h-full"
                style={{ backgroundColor: i % 2 === 0 ? "#2a0610" : "#0e0a09" }}
              />
            ))}
          </div>

          <div className="pi-label absolute inset-0 grid place-items-center">
            <p className="flex whitespace-pre font-display text-[clamp(2.6rem,8vw,7rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#fff9eb]">
              {LABEL.split("").map((c, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                  <span
                    className="pi-char inline-block"
                    style={{ transform: "translateY(110%)" }}
                  >
                    {c}
                  </span>
                </span>
              ))}
              <span
                className="pi-dot ml-[0.08em] inline-block h-[0.15em] w-[0.15em] self-end rounded-full bg-[#ff6f3c]"
                style={{ transform: "scale(0)", marginBottom: "0.2em" }}
              />
            </p>
          </div>
        </div>
      )}
    </StageCtx.Provider>
  );
}

/* ─────────────────────────── reveal wrapper ───────────────────────────
 *  The page starts as a small rounded window and grows to full size.
 * ───────────────────────────────────────────────────────────────────── */

const HIDDEN = {
  clipPath: "inset(8% 5% 8% 5% round 28px)",
  y: 70,
  scale: 1.05,
};
const SHOWN = {
  clipPath: "inset(-6% -6% -6% -6% round 0px)",
  y: 0,
  scale: 1,
};

function Reveal({ children }: { children: ReactNode }) {
  const { revealed, reduced } = useStage();
  const ref = useRef<HTMLDivElement>(null);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      initial={HIDDEN}
      animate={revealed ? SHOWN : HIDDEN}
      transition={{ duration: 1.3, ease, delay: 0.25 }}
      onAnimationComplete={() => {
        // once open, drop the clip so pinned / sticky sections inside Work behave normally
        if (revealed && ref.current) ref.current.style.clipPath = "none";
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── dot cursor ───────────────────────────
 *  A small orange dot follows the mouse. Over any link inside <main>
 *  it swells into a bubble. Add data-cursor="Play" (etc.) to any
 *  element to change the bubble's word. Mouse devices only.
 * ─────────────────────────────────────────────────────────────── */

function DotCursor() {
  const { revealed } = useStage();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });

  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Open");

  useEffect(() => {
    if (!revealed) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);

      const hit = (e.target as HTMLElement | null)?.closest?.(
        "main a, main [data-cursor]"
      ) as HTMLElement | null;

      if (hit) {
        setText(hit.dataset.cursor || "Open");
        setActive(true);
      } else {
        setActive(false);
      }
    };
    const leave = () => setShown(false);

    document.documentElement.classList.add("dot-cursor-on");
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      document.documentElement.classList.remove("dot-cursor-on");
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [revealed, x, y]);

  if (!revealed) return null;

  return (
    <>
      <style>{`html.dot-cursor-on main a, html.dot-cursor-on main [data-cursor]{cursor:none}`}</style>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80]"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="grid h-[88px] w-[88px] place-items-center rounded-full bg-[#ff6f3c] font-jakarta text-[13px] font-semibold text-[#fff9eb]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0 }}
          animate={{ scale: !shown ? 0 : active ? 1 : 0.16 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
        >
          <motion.span animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.2 }}>
            {text}
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function Projects() {
  return (
    <Stage>
      <Reveal>
        <Work />
      </Reveal>
      <DotCursor />
    </Stage>
  );
}