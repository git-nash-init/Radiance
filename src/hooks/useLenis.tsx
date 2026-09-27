import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Pinned/scrubbed sections measure the page; re-measure once media has loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") return;
    window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

/** Smooth-scroll to an in-page anchor, falling back to native scrolling. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string) => {
    const el = document.querySelector(target) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
}
