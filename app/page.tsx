
import AboutSection from "./components/about/AboutSection";
import BrandsTrustSection from "./components/home/BrandTrust";
import CtaFooter from "./components/home/CtaFooter";
import Fragments from "./components/home/Fragments";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import Intro from "./components/home/Intro";
import Statement from "./components/home/Statement";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Intro /> */}
      <Statement />
      {/* <HowItWorks /> */}
      {/* <BrandsTrustSection /> */}
      {/* <Fragments /> */}
      <AboutSection />
    </>
  );
}


