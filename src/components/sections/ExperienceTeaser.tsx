import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { tourFeatures } from "../../data/project";
import { tourPreview } from "../../data/media";
import { prefersReducedMotion } from "../../lib/gsap";

/**
 * A lightweight 360° "peek": the tour's own equirectangular preview drifts
 * slowly and can be dragged. The real 3DVista tour loads only on /experience.
 */
export function ExperienceTeaser() {
  const ref = useRef<HTMLElement>(null);
  const pano = useRef<HTMLDivElement>(null);
  useReveal(ref);

  useEffect(() => {
    const el = pano.current;
    if (!el) return;
    let x = 0;
    let velocity = prefersReducedMotion() ? 0 : -0.25;
    let dragging = false;
    let lastX = 0;
    let raf = 0;
    let visible = false;

    const loop = () => {
      if (!dragging) x += velocity;
      el.style.backgroundPosition = `${x}px center`;
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      x += dx;
      velocity = Math.max(-2, Math.min(2, dx * 0.15)) || velocity;
    };
    const up = () => {
      dragging = false;
      // Ease back to a gentle drift in the direction the user dragged.
      velocity = Math.sign(velocity || -1) * (prefersReducedMotion() ? 0 : 0.25);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <section ref={ref} id="experience" className="relative overflow-hidden bg-navy text-ivory">
      <div
        ref={pano}
        className="absolute inset-0 cursor-grab touch-pan-y bg-repeat-x active:cursor-grabbing"
        style={{ backgroundImage: `url(${tourPreview})`, backgroundSize: "auto 118%" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy to-transparent" />

      <div className="pointer-events-none container-x relative flex min-h-[100svh] flex-col justify-center py-28">
        <div className="max-w-xl">
          <p className="eyebrow !text-gold-light" data-reveal="fade">
            Immersive experience
          </p>
          <Lines className="display mt-6 text-[clamp(2.8rem,6vw,5.6rem)]" lines={["Step inside", <em key="e" className="text-gold-light">the view.</em>]} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/75" data-reveal="up">
            See Dombivli East from the height of your future home. The interactive 360° tour lets you move floor by floor, switch between day,
            evening and night, and explore the neighbourhood around RADIANCE.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ivory/15 pt-8" data-reveal="up" data-delay="0.1">
            {tourFeatures.map((f) => (
              <li key={f.label}>
                <p className="text-sm font-semibold text-ivory">{f.label}</p>
                <p className="mt-1 text-sm text-ivory/55">{f.detail}</p>
              </li>
            ))}
          </ul>
          <div className="pointer-events-auto mt-12 flex flex-wrap items-center gap-6" data-reveal="up" data-delay="0.2">
            <Link to="/experience" className="btn btn-gold">
              Enter the experience
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M0 5h16M12 1l4 4-4 4" />
              </svg>
            </Link>
            <span className="flex items-center gap-2 text-xs tracking-[0.2em] text-ivory/50 uppercase">
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M1 6h20M5 2L1 6l4 4M17 2l4 4-4 4" />
              </svg>
              Drag the view
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
