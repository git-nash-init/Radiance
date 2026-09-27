import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { Picture } from "../ui/Picture";
import { useLenis } from "../../hooks/useLenis";
import type { ImageId } from "../../data/media";

// The same street-view render supplied in three lighting states.
const STATES: { key: string; label: string; image: ImageId; line: string; time: string }[] = [
  { key: "day", label: "Day", image: "street-day", line: "Crisp, clean lines under an open sky.", time: "06:00 — 17:00" },
  { key: "evening", label: "Evening", image: "street-evening", line: "The façade warms as the city slows down.", time: "17:00 — 19:30" },
  { key: "night", label: "Night", image: "street-night", line: "A lantern on the skyline of Dombivli East.", time: "19:30 onwards" },
];

export function DayNight() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  useLayoutEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>(".dn-layer");
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(layers[1], { opacity: 1, duration: 1 }, 0.3).to(layers[2], { opacity: 1, duration: 1 }, 1.6).to({}, { duration: 0.4 });
      trigger.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setActive(self.progress < 0.36 ? 0 : self.progress < 0.72 ? 1 : 2),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const jump = (i: number) => {
    const st = trigger.current;
    if (!st) return setActive(i);
    const target = st.start + (st.end - st.start) * [0.05, 0.5, 0.95][i];
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const state = STATES[active];

  return (
    <section ref={section} className={`relative bg-sand ${reduced ? "" : "h-[300vh]"}`} aria-label="Day, evening and night views">
      <div className={`${reduced ? "" : "sticky top-0 h-[100svh] md:pt-16"} overflow-hidden`}>
        <div className="container-x grid h-full items-center gap-10 py-20 md:grid-cols-12 md:py-0">
          <div className="md:col-span-5">
            <p className="eyebrow">Day · Evening · Night</p>
            <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-navy">
              One address,
              <br />
              <em className="text-gold-deep">every hour.</em>
            </h2>
            <div className="mt-10 flex gap-2" role="tablist" aria-label="Lighting">
              {STATES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => jump(i)}
                  className={`relative px-5 py-3 text-[0.7rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-500 ${
                    active === i ? "bg-navy text-ivory" : "text-navy hover:bg-navy/5"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mt-10 min-h-24" aria-live="polite">
              <p className="text-xs tracking-[0.22em] text-muted uppercase">{state.time}</p>
              <p className="display mt-3 text-2xl text-navy md:text-3xl">{state.line}</p>
            </div>
          </div>

          {/* Box aspect matches the renders' own aspect (~1055:1440), so
              object-cover fills it with zero cropping on mobile; desktop
              keeps a fixed viewport-height column as before. */}
          <div className="relative aspect-[1055/1440] md:aspect-auto md:col-span-6 md:col-start-7 md:h-[76svh]">
            {STATES.map((s, i) => (
              <div
                key={s.key}
                className="dn-layer absolute inset-0 overflow-hidden"
                style={{ opacity: reduced ? (i === active ? 1 : 0) : i === 0 ? 1 : 0, transition: reduced ? "opacity .4s" : undefined }}
              >
                <Picture id={s.image} alt={`RADIANCE street view — ${s.label.toLowerCase()}`} sizes="(min-width: 768px) 45vw, 100vw" className="block h-full" imgClassName="h-full w-full object-cover" />
              </div>
            ))}
            <p className="absolute right-4 bottom-4 bg-navy/60 px-3 py-1 text-[0.6rem] tracking-[0.2em] text-ivory/80 uppercase backdrop-blur">Artist's impression</p>
          </div>
        </div>
      </div>
    </section>
  );
}
