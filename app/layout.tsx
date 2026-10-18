import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Syne,
  Plus_Jakarta_Sans,
  Newsreader,
  Space_Mono,
  Oranienbaum,
  Barlow_Condensed,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/layout/SmoothScroll";
import Preloader from "./components/layout/Preloader";
import Navbar from "./components/layout/Navbar";
import CtaFooter from "./components/home/CtaFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
const oranienbaum = Oranienbaum({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-oranienbaum",
  display: "swap",
});

// Hero / navbar / intro fonts. The --f-* names keep them separate from the
// Tailwind tokens (--font-*) that globals.css maps them to.
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--f-syne",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--f-jakarta",
  display: "swap",
});
// Roman + italic: the Intro headline is roman (light), the accent line is italic.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  variable: "--f-newsreader",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-spacemono",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--f-barlow",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Dot Flavr", template: "%s | Dot Flavr" },
  description: "Food product development and innovation.",
};

// Runs synchronously before first paint. It always resets scroll to the top,
// but only hides the page and locks scroll (the "is-loading" class) on routes
// that show the preloader. /contact skips it.
// Keep the regex in sync with SKIP_PRELOADER in Preloader.tsx.
const LOADING_SCRIPT = `
  (function () {
    try { history.scrollRes
    toration = "manual"; } catch (e) {}
    window.scrollTo(0, 0);
    if (/^\\/(contact|projects|dotflavr|thefoodtable)(\\/|$)/.test(location.pathname)) return;
    document.documentElement.classList.add("is-loading");
  })();
`;

const fontVars = [
  inter.variable,
  fraunces.variable,
  jetbrains.variable,
  syne.variable,
  jakarta.variable,
  newsreader.variable,
  spaceMono.variable,
  oranienbaum.variable,
  barlow.variable,
  instrument.variable,
].join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: LOADING_SCRIPT adds a class to <html>
    // before React hydrates, which would otherwise trigger a mismatch warning.
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADING_SCRIPT }} />
        <noscript>
          <style>{`#preloader{display:none!important}html.is-loading{overflow:auto!important}html.is-loading main{visibility:visible!important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll />
        <Preloader />
        <Navbar />
        <main>{children}</main>
        <CtaFooter />
      </body>
    </html>
  );
}