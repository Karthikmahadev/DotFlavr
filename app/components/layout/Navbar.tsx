"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type Lenis from "lenis";

import MenuOverlay from "./MenuOverlay";
import { useLenis } from "@/app/lib/scroll";
import { usePreloaderDone } from "@/app/lib/loader-store";

/**
 * The menu icon is five dots (the "dot" in Dot Flavr).
 * Closed: four dots huddled in a square.
 * Open: they spread out and a fifth appears in the middle, drawing an X.
 */
const DOTS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

function DotIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-500"
      style={{ backgroundColor: open ? "#ff6f3c" : "#332C24" }}
    >
      {DOTS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-[#fff9eb]"
          animate={{
            x: d.x * (open ? 5.5 : 3),
            y: d.y * (open ? 5.5 : 3),
          }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.025 }}
        />
      ))}
      <motion.span
        className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-[#fff9eb]"
        animate={{ scale: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: open ? 0.15 : 0 }}
      />
    </span>
  );
}

export default function Navbar() {
  const lenis = useLenis();
  const ready = usePreloaderDone();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Reading progress, drawn as the bottom edge of the bar.
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 140, damping: 26, mass: 0.4 });

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    if (!lenis) return;
    const onScroll = (l: Lenis) => {
      progress.set(l.progress || 0);
      if (l.scroll < 120) setHidden(false);
      else setHidden(l.direction === 1);
    };
    onScroll(lenis);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, progress]);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    if (!lenis || !open) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, open]);

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const visible = ready && (!hidden || open);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#E8DFC8] bg-[#fff9eb]/95 px-6 backdrop-blur-md lg:px-12"
      >
        <Link
          href="/"
          aria-label="Dot Flavr home"
          className="group flex items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6f3c]"
        >
          {/* Needs the logo version that works on a cream background */}
          <img
            src="/dotflavrnavbar.png"
            alt="Dot Flavr"
            className="h-9 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={handleOpen}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="group flex items-center gap-3 rounded-full border border-[#332C24]/15 py-1 pl-4 pr-1 font-jakarta text-[13px] font-semibold text-[#332C24] transition-colors duration-300 hover:border-[#332C24]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f3c]"
        >
          {/* label rolls up like a departure board */}
          <span className="relative block h-5 overflow-hidden leading-5">
            <motion.span
              className="flex flex-col"
              animate={{ y: open ? "-50%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block h-5">Menu</span>
              <span className="block h-5">Close</span>
            </motion.span>
          </span>
          <DotIcon open={open} />
        </button>

        {/* progress line replaces the plain border while you read */}
        <motion.span
          aria-hidden
          style={{ scaleX: smooth }}
          className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left bg-[#ff6f3c]"
        />
      </motion.header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}