import { useLayoutEffect, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

/**
 * Animates every [data-reveal] element inside `scope` as it enters the viewport.
 *   data-reveal="up"    — rise + fade (default)
 *   data-reveal="fade"  — fade only
 *   data-reveal="clip"  — image wipes open from the bottom with a slow settle
 *   data-reveal="lines" — children (.line > span) rise out of a mask, staggered
 *
 * One-shot reveals use an IntersectionObserver rather than a ScrollTrigger
 * each: with ~80 reveal targets, per-element ScrollTriggers forced seconds of
 * layout on mid-range phones. ScrollTrigger is kept for scrubbed/pinned effects.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, clearProps: "transform,clipPath" });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states, applied before first paint.
      els.forEach((el) => {
        const kind = el.dataset.reveal || "up";
        if (kind === "clip") gsap.set(el, { opacity: 1, clipPath: "inset(100% 0 0 0)" });
        else if (kind === "lines") {
          gsap.set(el, { opacity: 1 });
          gsap.set(el.querySelectorAll(".line > span"), { yPercent: 110 });
        } else if (kind === "up") gsap.set(el, { y: 36 });
      });
    }, root);

    const play = (el: HTMLElement) =>
      ctx.add(() => {
        const kind = el.dataset.reveal || "up";
        const delay = Number(el.dataset.delay || 0);
        if (kind === "clip") {
          gsap.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", delay });
          const media = el.querySelector("img, video, canvas");
          if (media) gsap.fromTo(media, { scale: 1.18 }, { scale: 1, duration: 2.2, ease: "expo.out", delay });
        } else if (kind === "lines") {
          gsap.to(el.querySelectorAll(".line > span"), { yPercent: 0, duration: 1.3, stagger: 0.09, delay });
        } else if (kind === "fade") {
          gsap.to(el, { opacity: 1, duration: 1.4, ease: "power2.out", delay });
        } else {
          gsap.to(el, { opacity: 1, y: 0, duration: 1.2, delay });
        }
      });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          play(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [scope]);
}
