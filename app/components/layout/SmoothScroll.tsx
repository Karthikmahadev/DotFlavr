"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { setLenis } from "@/app/lib/scroll";
import { ScrollTrigger } from "gsap/all";


export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      autoRaf: false, // GSAP's ticker drives it instead
      lerp: 0.1,
      smoothWheel: !reduce,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}