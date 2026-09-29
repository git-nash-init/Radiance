import { useEffect, useRef, type RefObject } from "react";

/**
 * Scroll progress (0 → 1) through a tall section that holds a CSS-sticky
 * panel (its first child). Progress is read from the section's real position
 * every frame, so it stays correct when the layout shifts after load (late
 * fonts/images) or when a phone's address bar resizes the viewport, which is
 * where fixed start/end offsets computed once at load go stale.
 */
export function useStickyProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void, enabled = true) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const section = ref.current;
    if (!section || !enabled) return;
    let raf = 0;
    let last = -1;

    const read = () => {
      raf = 0;
      const panel = section.firstElementChild as HTMLElement | null;
      const rect = section.getBoundingClientRect();
      const span = rect.height - (panel?.offsetHeight ?? window.innerHeight);
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      if (p !== last) {
        last = p;
        callback.current(p);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, enabled]);
}
