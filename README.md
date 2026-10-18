# Dot Flavr | Food Consultancy & Innovation Studio

> Precision food product development, formulation optimization, shelf-life stability, and industrial scale-up—alongside **The Food Table** community and learning lab.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square&logo=greensock)](https://greensock.com/scrolltrigger/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlink/)

---

## 🍊 Brand Identity & Color System

Dot Flavr’s visual identity moves away from generic AI aesthetics, emphasizing an editorial, technical, and human-centric food science consultancy:
* **Warm Cream Canvas:** `#fff9eb`
* **Deep Burgundy:** `#800020`
* **Vibrant Tangerine:** `#ff6f3c`

---

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Animations:** GSAP (ScrollTrigger & MatchMedia)
* **Icons & Assets:** Lucide React & Optimized Image Assets

---

## 📂 Project Architecture

```tree
├── app/
│   ├── layout.tsx         # Root layout with font configurations
│   ├── page.tsx           # Main homepage incorporating all consultancy sections
│   └── globals.css        # Tailwind directives & custom scrollbar overrides
├── components/
│   ├── Hero.tsx           # Immersive LCP-optimized hero section
│   ├── MethodologyTransition.tsx # Editorial transition bridge
│   ├── Process.tsx        # Interactive pinned rail & batch tracking workflow
│   ├── Experience.tsx     # Scientific capability & real trials pillars
│   ├── StatsPinSection.tsx# Pinned metric counter reel
│   ├── BrandsWall.tsx     # Staggered collaborator wall
│   ├── FoodTablePage.tsx  # Community labs, cohorts & immersion programmes
│   ├── Faq.tsx            # Sticky desktop FAQ accordion
│   ├── ContactForm.tsx    # Scrollable multi-audience inquiry form
│   └── CtaFooter.tsx      # Cinematic footer & ecosystem links
└── public/
    └── images/            # Product photography and partner assets
