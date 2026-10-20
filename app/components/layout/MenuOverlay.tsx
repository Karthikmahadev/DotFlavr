"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/app/lib/constants";

const ease = [0.16, 1, 0.3, 1] as const;

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "WhatsApp", href: "https://wa.me" },
];

/** Coimbatore time, ticking quietly in the corner. */
function StudioClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2 text-[13px] text-[#fff9eb]/70">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6f3c] opacity-60 motion-reduce:animate-none" />
        <span className="relative h-2 w-2 rounded-full bg-[#ff6f3c]" />
      </span>
      Studio in Coimbatore, <span className="tabular-nums uppercase">{time || "--:--"}</span>
    </p>
  );
}

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          key="menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-40 overflow-hidden bg-[#0e0a09] pt-14 text-[#fff9eb]"
        >
          {/* the big dot: same gradient as the hero, rising from the corner */}
          <motion.div
            aria-hidden
            initial={{ scale: 0.6, y: "12%" }}
            animate={{ scale: 1, y: "0%", transition: { delay: 0.35, duration: 1.4, ease } }}
            exit={{ scale: 0.8, transition: { duration: 0.3 } }}
            className="pointer-events-none absolute -bottom-[22vw] -right-[14vw] h-[56vw] w-[56vw] min-h-[320px] min-w-[320px] rounded-full opacity-90"
            style={{
              background:
                "radial-gradient(circle at 32% 30%, #ff6f3c 0%, #800020 52%, #1f050b 100%)",
            }}
          />

          <nav
            aria-label="Main"
            className="relative flex h-full flex-col justify-center gap-1 px-6 pb-24 md:px-16"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link, i) => (
              <div key={link.href} className="overflow-hidden pb-2">
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.8, ease } }}
                  exit={{ y: "110%", transition: { duration: 0.3 } }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={`group flex items-center font-display text-6xl leading-[1.05] tracking-[-0.03em] transition-opacity duration-300 focus-visible:outline-none md:text-6xl ${
                      hovered !== null && hovered !== i ? "opacity-30" : "opacity-100"
                    }`}
                  >
                    {/* a dot grows in and nudges the word along */}
                    <span
                      aria-hidden
                      className="mr-0 inline-block h-3 w-0 shrink-0 rounded-full bg-[#ff6f3c] transition-all duration-500 ease-out group-hover:mr-4 group-hover:w-3 group-focus-visible:mr-4 group-focus-visible:w-3 md:h-5 md:group-hover:mr-6 md:group-hover:w-5 md:group-focus-visible:mr-6 md:group-focus-visible:w-5"
                    />
                    {link.label}
                  </Link>
                </motion.div>
              </div>
            ))}
          </nav>

          {/* bottom strip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.75, duration: 0.8, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-3 border-t border-[#fff9eb]/15 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-16"
          >
            <StudioClock />
            <ul className="flex gap-6 text-[13px]">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#fff9eb]/80 underline decoration-[#ff6f3c] decoration-2 underline-offset-[6px] transition-colors hover:text-[#fff9eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6f3c]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}