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
  animate as tween,
  motion,
  useAnimate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

import DotFlavrPhilosophy from "../components/about/DotFlavrPhilosophy";
import HowItWorks from "../components/home/HowItWorks";
import MethodologyTransition from "../components/home/MethodologyTransition";
import Experience from "../components/home/Experience";
import Process from "../components/home/Process";
import StatsPinSection from "../components/home/StatsPinSection";
import { useLenis } from "@/app/lib/scroll";
import { usePreloaderDone } from "@/app/lib/loader-store";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── shared state ─────────────────────────── */

const StageCtx = createContext({ revealed: false, reduced: false });
const useStage = () => useContext(StageCtx);

/* ─────────────────────────── helpers ─────────────────────────── */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ─────────────────────────── the stage ───────────────────────────
 *  Halftone dissolve. This page is built from pinned sections, so the
 *  intro is a canvas overlay: nothing wraps or transforms the content.
 *
 *  1. a screen made entirely of overlapping dark dots, "How we work."
 *  2. the dots shrink from the centre outwards, flashing orange as
 *     each one lets go, until the page shows through the gaps
 * ──────────────────────────────────────────────────────────────── */

function Stage({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const ready = usePreloaderDone();
  const reduced = !!useReducedMotion();

  const [scope, animate] = useAnimate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (reduced) {
      setRevealed(true);
      setPlaying(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setRevealed(true);
      setPlaying(false);
      return;
    }

    let cancelled = false;
    lenisRef.current?.stop();
    window.scrollTo(0, 0);

    // ── canvas setup ──
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const CELL = W < 640 ? 28 : 40;
    const R = CELL * 0.72; // big enough that neighbouring dots overlap and cover everything
    const SPREAD = 0.55; // how much of the timeline the outward wave takes
    const cols = Math.ceil(W / CELL) + 1;
    const rows = Math.ceil(H / CELL) + 1;
    const cx = W / 2;
    const cy = H / 2;
    const maxD = Math.hypot(cx, cy);

    // dark burgundy -> orange at the moment each dot lets go
    const dark = [42, 6, 16];
    const hot = [255, 111, 60];

    const draw = (p: number) => {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL + CELL / 2 - (cols * CELL - W) / 2;
          const y = r * CELL + CELL / 2 - (rows * CELL - H) / 2;
          const d = Math.hypot(x - cx, y - cy) / maxD;
          const local = clamp01((p - d * SPREAD) / (1 - SPREAD));
          const k = easeInOutCubic(local);
          const radius = R * (1 - k);
          if (radius < 0.4) continue;

          const heat = Math.sin(Math.PI * local); // 0 -> 1 -> 0
          ctx.fillStyle = `rgb(${Math.round(lerp(dark[0], hot[0], heat))},${Math.round(
            lerp(dark[1], hot[1], heat)
          )},${Math.round(lerp(dark[2], hot[2], heat))})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // the canvas now covers the screen with identical dark dots: drop the solid fill
    draw(0);
    if (solidRef.current) solidRef.current.style.display = "none";

    (async () => {
      await animate(".df-label", { y: "0%" }, { duration: 0.9, ease });
      if (cancelled) return;

      await new Promise((r) => setTimeout(r, 550));
      if (cancelled) return;

      animate(".df-label", { opacity: 0, y: -14 }, { duration: 0.35 });
      setRevealed(true);

      await tween(0, 1, {
        duration: 1.8,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: draw,
      });
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
          {/* shown until the canvas takes over, so there's never a flash of page */}
          <div ref={solidRef} className="absolute inset-0 bg-[#2a0610]" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="overflow-hidden pb-[0.12em]">
              <p
                className="df-label font-display text-[clamp(2.4rem,7vw,6rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#fff9eb]"
                style={{ transform: "translateY(110%)" }}
              >
                How we work.
              </p>
            </div>
          </div>
        </div>
      )}
    </StageCtx.Provider>
  );
}

/* ─────────────────────────── dotted scroll trail ───────────────────────────
 *  A row of dots along the bottom edge. They fill orange as you read down
 *  the page, and the leading dot swells. Doesn't touch the page layout,
 *  so pinned sections are unaffected.
 * ───────────────────────────────────────────────────────────────────────── */

const TRAIL = 24;

function DotTrail() {
  const { revealed } = useStage();
  const { scrollYProgress } = useScroll();
  const [n, setN] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const k = Math.min(TRAIL - 1, Math.floor(clamp01(v) * TRAIL));
    setN((prev) => (prev === k ? prev : k));
  });

  if (!revealed) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.6 }}
      className="pointer-events-none fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 sm:block"
    >
      <div className="flex items-center gap-[7px] rounded-full bg-[#0e0a09]/80 px-4 py-3 backdrop-blur-md">
        {Array.from({ length: TRAIL }).map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-300 ${
              i === n
                ? "h-2.5 w-2.5 bg-[#ff6f3c]"
                : i < n
                ? "h-1.5 w-1.5 bg-[#ff6f3c]/70"
                : "h-1.5 w-1.5 bg-[#fff9eb]/25"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function DotFlavr() {
  return (
    <Stage>
      <MethodologyTransition />
      <Process />
      <StatsPinSection />
      <Experience />
      {/* <HowItWorks /> */}
      {/* <DotFlavrPhilosophy /> */}

      <DotTrail />
    </Stage>
  );
}