import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "./useLenis";
import { ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/**
 * Arriving on a page with #section (e.g. /radiance#amenities): wait until smooth
 * scrolling is ready (or motion is reduced), let layout settle, then glide there.
 */
export function useHashScroll() {
  const { hash } = useLocation();
  const lenis = useLenis();

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
}
