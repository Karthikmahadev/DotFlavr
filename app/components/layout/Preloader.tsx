"use client";

import { loaderStore, usePreloaderDone } from "@/app/lib/loader-store";
import { useLenis } from "@/app/lib/scroll";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STAGES = ["Weighing", "Mixing", "Tasting", "Adjusting", "Trying again", "Serving"];
const RAMP_SECONDS = 2.8;
const MAX_WAIT_MS = 8000;

// Routes where the preloader must never show. Keep in sync with LOADING_SCRIPT in layout.tsx.
const SKIP_PRELOADER = /^\/contact(\/|$)/;

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

function waitForAssets(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const load =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((res) =>
          window.addEventListener("load", () => res(), { once: true })
        );
  const timeout = new Promise<void>((res) => setTimeout(res, MAX_WAIT_MS));

  // TODO (3D pass): also wait for the 3D scene to be ready
  return Promise.race([Promise.all([fonts, load]).then(() => undefined), timeout]);
}

/**
 * ".dot / flavr", stacked like the logo. Rendered twice with identical layout:
 * a faint ghost (carries the real dot) and the liquid fill (dot is invisible).
 */
function Wordmark({ ghost = false }: { ghost?: boolean }) {
  return (
    <span className="block">
      <span className="block whitespace-nowrap">
        <span
          className={`${
            ghost ? "js-dot bg-[#ff6f3c]" : "invisible"
          } mr-[0.04em] inline-block h-[0.17em] w-[0.17em] rounded-full align-baseline`}
        />
        <span className="js-letters">dot</span>
      </span>
      <span className="js-letters block">flavr</span>
    </span>
  );
}

function PreloaderInner() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const done = usePreloaderDone();

  // Lenis is created after hydration; keep it stopped until the loader finishes.
  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo(0, 0);

      const overlay = el.querySelector<HTMLElement>(".js-overlay")!;
      const ring = el.querySelector<HTMLElement>(".js-ring")!;
      const fillEl = el.querySelector<HTMLElement>(".js-fill")!;
      const dotEl = el.querySelector<HTMLElement>(".js-dot")!;
      const countEl = el.querySelector<HTMLElement>(".js-count")!;
      const stageEl = el.querySelector<HTMLElement>(".js-stage")!;
      const trialEl = el.querySelector<HTMLElement>(".js-trial")!;

      const counter = { value: 0 };
      const AMP = reduce ? 0 : 2.4; // wave height, % of the wordmark box
      let lastStage = -1;
      let cancelled = false;
      let ticking = true;

      // ── Draw one frame: counter text, stage caption, liquid surface ──
      const render = (time = 0) => {
        const p = counter.value / 100;
        countEl.textContent = pad(Math.round(counter.value), 3);

        const stage = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
        if (stage !== lastStage) {
          lastStage = stage;
          stageEl.textContent = STAGES[stage];
          trialEl.textContent = `Trial ${pad(stage + 1)}`;
          gsap.fromTo(
            stageEl,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.6, ease: "expo.out", overwrite: true }
          );
        }

        // Liquid level runs from below the box to above it, so 100% covers every glyph.
        const bottom = 100 + AMP + 6;
        const top = -(AMP + 14);
        const level = bottom - p * (bottom - top);

        const pts: string[] = [];
        for (let x = -5; x <= 105; x += 2.5) {
          const y =
            level +
            AMP * Math.sin(x * 0.075 + time * 2.2) +
            AMP * 0.4 * Math.sin(x * 0.13 - time * 1.6);
          pts.push(`${x}% ${y.toFixed(2)}%`);
        }
        fillEl.style.clipPath = `polygon(${pts.join(",")},105% 150%,-5% 150%)`;
      };

      const tick = (time: number) => {
        if (ticking) render(time);
      };
      gsap.ticker.add(tick);
      render(0);

      // ── Entrance (elements start `invisible` in the markup) ──
      gsap.set(".js-fade", { y: 24 });
      gsap.to(".js-fade", {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      // The drop bobs while we wait.
      if (!reduce) {
        gsap.to(dotEl, {
          yPercent: -45,
          duration: 0.7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // ── Iris: the dot opens as a growing window onto the page ──
      const startIris = contextSafe!(() => {
        ticking = false;
        const r = dotEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 24;

        // Reveal the page exactly as the window opens.
        document.documentElement.classList.remove("is-loading");
        loaderStore.finish(); // unlocks scroll + triggers hero/navbar intros

        const hole = { r: 0 };
        const apply = () => {
          const mask = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${hole.r}px, #000 ${
            hole.r + 1
          }px)`;
          overlay.style.webkitMaskImage = mask;
          overlay.style.maskImage = mask;

          const d = (hole.r + 2) * 2;
          ring.style.width = `${d}px`;
          ring.style.height = `${d}px`;
          ring.style.left = `${cx}px`;
          ring.style.top = `${cy}px`;
        };
        apply();
        gsap.set(ring, { autoAlpha: reduce ? 0 : 1, xPercent: -50, yPercent: -50 });

        gsap.to(hole, {
          r: maxR,
          duration: reduce ? 0.4 : 1.5,
          ease: "expo.inOut",
          onUpdate: apply,
        });
        gsap.to(ring, { autoAlpha: 0, duration: 0.3, delay: reduce ? 0 : 1.2 });
      });

      const exit = contextSafe!(() => {
        gsap.killTweensOf(dotEl); // stop the bobbing
        gsap.set(dotEl, { yPercent: 0 });

        gsap
          .timeline()
          // fill the last stretch
          .to(counter, { value: 100, duration: 0.6, ease: "power2.out" })
          // everything but the dot lets go
          .to(
            ".js-letters",
            { autoAlpha: 0, yPercent: -6, duration: 0.45, ease: "power3.in" },
            "+=0.25"
          )
          .to(
            ".js-ui",
            { autoAlpha: 0, duration: 0.35, ease: "power2.in" },
            "<"
          )
          // the dot pops, then opens
          .to(dotEl, { scale: 1.5, duration: 0.35, ease: "back.out(3)" }, "-=0.1")
          .add(startIris)
          .to({}, { duration: reduce ? 0.45 : 1.55 })
          .set(el, { display: "none" });
      });

      const ramp = new Promise<void>((resolve) => {
        gsap.to(counter, {
          value: 88,
          duration: reduce ? 0.2 : RAMP_SECONDS,
          ease: "power2.inOut",
          onComplete: resolve,
        });
      });

      Promise.all([ramp, waitForAssets()]).then(() => {
        if (!cancelled) exit();
      });

      return () => {
        cancelled = true;
        gsap.ticker.remove(tick);
      };
    },
    { scope: root }
  );

  return (
    <div
      id="preloader"
      ref={root}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] text-[#fff9eb]"
    >
      {/* The masked layer: the iris cuts a hole through this */}
      <div className="js-overlay absolute inset-0 overflow-hidden bg-[#2a0610]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_56%,rgba(255,111,60,0.10),transparent_58%)]"
        />

        {/* Top row */}
        <div className="js-ui absolute inset-x-0 top-0 flex justify-between p-6 font-spacemono text-[11px] uppercase tracking-[0.22em] md:p-10">
          <span className="js-fade invisible text-[#fff9eb]/60">Food R&amp;D · Coimbatore</span>
          <span className="js-fade invisible text-[#fff9eb]/60">Setting the table</span>
        </div>

        {/* Wordmark: ghost + rising liquid */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="js-fade invisible relative select-none text-left font-display font-medium leading-[0.84] tracking-[-0.05em] [font-size:min(30vw,30svh)]">
            <div className="text-[#fff9eb]/[0.12]">
              <Wordmark ghost />
            </div>
            <div aria-hidden className="js-fill absolute inset-0 text-[#fff9eb]">
              <Wordmark />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="js-ui absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-10">
          <div className="js-fade invisible">
            <p className="js-trial font-spacemono text-[11px] uppercase tracking-[0.22em] text-[#ff6f3c]">
              Trial 01
            </p>
            <div className="mt-1 overflow-hidden">
              <p className="js-stage font-newsreader text-[clamp(1.6rem,3vw,2.4rem)] italic leading-[1.15]">
                Weighing
              </p>
            </div>
          </div>

          <p className="js-fade invisible flex items-baseline gap-1 font-display tabular-nums leading-none">
            <span className="js-count text-[clamp(2rem,4vw,3.5rem)]">000</span>
            <span className="text-[clamp(0.9rem,1.4vw,1.2rem)] text-[#fff9eb]/60">%</span>
          </p>
        </div>
      </div>

      {/* Sits just outside the hole's edge, so it isn't masked away */}
      <div className="js-ring pointer-events-none invisible absolute left-0 top-0 rounded-full border-2 border-[#ff6f3c]" />
    </div>
  );
}

/**
 * Entry point. On routes in SKIP_PRELOADER (the /contact page) the loader
 * never mounts, but the rest of the app (Navbar, page intros) still waits on
 * loaderStore, so we mark loading as finished straight away.
 *
 * The decision is made once, on the first load of the site. Client-side
 * navigation afterwards never brings the loader back.
 */
export default function Preloader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [skip] = useState(() => SKIP_PRELOADER.test(pathname));

  useEffect(() => {
    if (!skip) return;
    document.documentElement.classList.remove("is-loading");
    loaderStore.finish();
  }, [skip]);

  // PreloaderInner normally starts Lenis; when skipped, do it here.
  useEffect(() => {
    if (skip && lenis) lenis.start();
  }, [skip, lenis]);

  if (skip) return null;
  return <PreloaderInner />;
}