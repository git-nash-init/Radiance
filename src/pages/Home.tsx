import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/sections/Hero";
import { Intro } from "../components/sections/Intro";
import { Unveiling } from "../components/sections/Unveiling";
import { ExperienceTeaser } from "../components/sections/ExperienceTeaser";
import { DayNight } from "../components/sections/DayNight";
import { Living } from "../components/sections/Living";
import { Amenities } from "../components/sections/Amenities";
import { Gallery } from "../components/sections/Gallery";
import { Connectivity } from "../components/sections/Connectivity";
import { Developer } from "../components/sections/Developer";
import { Brochures } from "../components/sections/Brochures";
import { Enquire } from "../components/sections/Enquire";
import { useLenis } from "../hooks/useLenis";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

export default function Home() {
  const { hash } = useLocation();
  const lenis = useLenis();
  useDocumentMeta({
    title: "RADIANCE, Dombivli East — Premium Lifestyle Residence | Adinarayan Buildcon LLP",
    path: "/",
  });

  // Arriving with /#section: wait until smooth scrolling is ready (or motion
  // is reduced), let layout settle, then glide there.
  useEffect(() => {
    if (!hash) return;
    if (!lenis && !prefersReducedMotion()) return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      const el = document.querySelector(hash) as HTMLElement | null;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { duration: 1.6 });
      else el.scrollIntoView();
    }, 500);
    return () => clearTimeout(t);
  }, [hash, lenis]);

  return (
    <>
      <Hero />
      <Intro />
      <Unveiling />
      <Living />
      <ExperienceTeaser />
      <DayNight />
      <Amenities />
      <Gallery />
      <Connectivity />
      <Developer />
      <Brochures />
      <Enquire />
    </>
  );
}
