"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

import ContactForm from "../components/home/Contact";
import Faq from "../components/home/Faq";
import { useLenis } from "@/app/lib/scroll";
import { usePreloaderDone } from "@/app/lib/loader-store";

const ease = [0.16, 1, 0.3, 1] as const;
const wipe = [0.76, 0, 0.24, 1] as const;

/* ─────────────────────────── shared state ─────────────────────────── */

const StageCtx = createContext({ revealed: false, reduced: false });
const useStage = () => useContext(StageCtx);

/* ─────────────────────────── the stage ───────────────────────────
 *  1. "Let's talk." rises on a dark screen
 *  2. a single orange dot pops in beneath it
 *  3. the dot floods the whole screen
 *  4. the orange curtain lifts away while the page rises underneath
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      const flood = (Math.hypot(w, h) / 20) * 1.08; // the dot is 20px wide

      animate(".ci-label", { y: "0%" }, { duration: 0.9, ease });
      await animate(".ci-dot", { scale: 1 }, { delay: 0.35, duration: 0.7, ease });
      if (cancelled) return;

      await new Promise((r) => setTimeout(r, 250));
      if (cancelled) return;

      animate(".ci-label", { opacity: 0 }, { duration: 0.3 });
      await animate(".ci-dot", { scale: flood }, { duration: 0.95, ease: wipe });
      if (cancelled) return;

      setRevealed(true);
      await animate(
        scope.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { duration: 0.9, ease: wipe }
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
        <div
          ref={scope}
          aria-hidden
          className="fixed inset-0 z-[70] bg-[#0e0a09]"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute bottom-full left-1/2 mb-8 -translate-x-1/2 overflow-hidden">
              <p
                className="ci-label whitespace-nowrap font-display text-5xl tracking-[-0.03em] text-[#fff9eb] md:text-7xl"
                style={{ transform: "translateY(110%)" }}
              >
                Let&rsquo;s talk.
              </p>
            </div>
            <span
              className="ci-dot block h-5 w-5 rounded-full bg-[#ff6f3c]"
              style={{ transform: "scale(0)" }}
            />
          </div>
        </div>
      )}
    </StageCtx.Provider>
  );
}

/* ─────────────────────────── reveal wrapper ───────────────────────────
 *  Content is unmasked from the top down while it rises into place.
 *  `inView` waits for scroll instead of waiting for the intro.
 * ───────────────────────────────────────────────────────────────────── */

const HIDDEN = { clipPath: "inset(0% 0% 100% 0%)", y: 90 };
// negative insets leave room for shadows and overflow once revealed
const SHOWN = { clipPath: "inset(-6% -6% -6% -6%)", y: 0 };

function Reveal({
  children,
  inView = false,
  delay = 0,
}: {
  children: ReactNode;
  inView?: boolean;
  delay?: number;
}) {
  const { revealed, reduced } = useStage();
  if (reduced) return <>{children}</>;

  const transition = { duration: 1.2, ease, delay };

  return inView ? (
    <motion.div
      initial={HIDDEN}
      whileInView={SHOWN}
      viewport={{ once: true, amount: 0.12 }}
      transition={transition}
    >
      {children}
    </motion.div>
  ) : (
    <motion.div
      initial={HIDDEN}
      animate={revealed ? SHOWN : HIDDEN}
      transition={{ ...transition, delay: delay + 0.1 }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── divider ───────────────────────────
 *  A hairline draws itself while an orange dot rides its tip.
 * ─────────────────────────────────────────────────────────────── */

function DotRule() {
  const { reduced } = useStage();

  return (
    <div className="px-6 py-10 md:px-12 lg:px-16" aria-hidden>
      <div className="relative h-px">
        <motion.span
          className="absolute inset-0 origin-left bg-neutral-900/20"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 1.6, ease: wipe }}
        />
        <motion.span
          className="absolute top-1/2 -ml-[7px] -mt-[7px] h-[14px] w-[14px] rounded-full bg-[#ff6f3c]"
          initial={reduced ? false : { left: "0%" }}
          whileInView={{ left: "100%" }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 1.6, ease: wipe }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function Contact() {
  return (
    <Stage>
      <Reveal>
        <ContactForm />
      </Reveal>

      <DotRule />

      <Reveal inView>
        <Faq />
      </Reveal>
    </Stage>
  );
}