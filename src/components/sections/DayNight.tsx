import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Picture } from "../ui/Picture";
import { useLenis } from "../../hooks/useLenis";
import { useReducedMotion } from "../../hooks/useMediaQuery";
import { useStickyProgress } from "../../hooks/useStickyProgress";
import type { ImageId } from "../../data/media";

// The same street-view render supplied in three lighting states.
const STATES: { key: string; label: string; image: ImageId; line: string; time: string }[] = [
  { key: "day", label: "Day", image: "street-day", line: "Crisp, clean lines under an open sky.", time: "06:00 — 17:00" },
  { key: "evening", label: "Evening", image: "street-evening", line: "The façade warms as the city slows down.", time: "17:00 — 19:30" },
  { key: "night", label: "Night", image: "street-night", line: "A lantern on the skyline of Dombivli East.", time: "19:30 onwards" },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const thirdOf = (p: number) => (p < 0.34 ? 0 : p < 0.68 ? 1 : 2);

/** Presentational clock: 06:00 → 17:00 (day), → 19:30 (evening), → 21:00 (night). */
function clock(p: number) {
  const h = p < 0.34 ? 6 + (p / 0.34) * 11 : p < 0.68 ? 17 + ((p - 0.34) / 0.34) * 2.5 : 19.5 + ((p - 0.68) / 0.32) * 1.5;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// CSS variables the scroll handler drives (no React re-render per frame).
const STAGE_VARS = { "--p": 0, "--o1": 0, "--o2": 0, "--ev": 0 } as CSSProperties;

function Tabs({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <div className="flex gap-1 md:gap-2" role="tablist" aria-label="Lighting">
      {STATES.map((s, i) => (
        <button
          key={s.key}
          type="button"
          role="tab"
          aria-selected={active === i}
          onClick={() => onPick(i)}
          className={`relative px-4 py-3 text-[0.7rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-500 md:px-5 ${
            active === i ? "bg-navy text-ivory" : "text-navy hover:bg-navy/5"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export function DayNight() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clockEl = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const applyVars = useCallback((p: number, o1: number, o2: number) => {
    const st = stage.current;
    if (!st) return;
    st.style.setProperty("--p", p.toFixed(4));
    st.style.setProperty("--o1", o1.toFixed(3));
    st.style.setProperty("--o2", o2.toFixed(3));
    st.style.setProperty("--ev", Math.min(o1, 1 - o2).toFixed(3));
    if (clockEl.current) clockEl.current.textContent = clock(p);
  }, []);

  const onProgress = useCallback(
    (p: number) => {
      applyVars(p, smooth(0.22, 0.42, p), smooth(0.56, 0.76, p));
      const t = thirdOf(p);
      if (t !== activeRef.current) {
        activeRef.current = t;
        setActive(t);
      }
    },
    [applyVars],
  );
  useStickyProgress(section, onProgress, !reduced);

  // Reduced motion: no scrub — the tabs switch state and CSS eases the change.
  useEffect(() => {
    if (!reduced) return;
    applyVars([0.1, 0.5, 0.9][active], active >= 1 ? 1 : 0, active >= 2 ? 1 : 0);
  }, [reduced, active, applyVars]);

  const pick = (i: number) => {
    const el = section.current;
    if (reduced || !el) return setActive(i);
    const panel = el.firstElementChild as HTMLElement;
    const span = el.getBoundingClientRect().height - panel.offsetHeight;
    const y = window.scrollY + el.getBoundingClientRect().top + span * [0.08, 0.5, 0.92][i];
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const state = STATES[active];

  return (
    <section ref={section} className={`relative bg-sand ${reduced ? "" : "h-[300vh]"}`} aria-label="Day, evening and night views">
      <div className={`${reduced ? "" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        {/* Mobile: heading / stage (flexes to the space left) / controls, all inside one screen. */}
        <div
          className={`container-x flex flex-col gap-3 pt-[4.5rem] pb-[4.5rem] md:grid md:grid-cols-12 md:items-center md:gap-10 md:py-0 md:pt-16 ${
            reduced ? "py-20" : "h-full"
          }`}
        >
          <div className="md:col-span-5">
            <p className="eyebrow hidden md:block">Day · Evening · Night</p>
            <h2 className="display text-[clamp(1.9rem,8.4vw,2.5rem)] text-navy md:mt-6 md:text-[clamp(2.6rem,5vw,4.6rem)]">
              One address,
              <br />
              <em className="text-gold-deep">every hour.</em>
            </h2>
            <div className="hidden md:block">
              <div className="mt-10">
                <Tabs active={active} onPick={pick} />
              </div>
              <div className="mt-10 min-h-24" aria-live="polite">
                <p className="text-xs tracking-[0.22em] text-muted uppercase">{state.time}</p>
                <p className="display mt-3 text-3xl text-navy">{state.line}</p>
              </div>
            </div>
          </div>

          <div
            ref={stage}
            style={STAGE_VARS}
            className={`relative min-h-0 overflow-hidden md:col-span-6 md:col-start-7 md:h-[76svh] md:flex-none ${
              reduced ? "aspect-[3/4] md:aspect-auto" : "flex-1"
            }`}
          >
            {STATES.map((s, i) => (
              <div
                key={s.key}
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: i === 0 ? 1 : `var(--o${i})`, transition: reduced ? "opacity .8s ease" : undefined }}
                aria-hidden={i !== active}
              >
                <div className="h-full w-full will-change-transform" style={{ transform: "scale(calc(1 + var(--p) * 0.06))", transformOrigin: "50% 70%" }}>
                  <Picture
                    id={s.image}
                    alt={`RADIANCE street view — ${s.label.toLowerCase()}`}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="block h-full"
                    imgClassName="h-full w-full object-cover object-[50%_54%]"
                  />
                </div>
              </div>
            ))}

            {/* Colour grade: warm at evening, deep blue at night. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: "var(--ev)", background: "linear-gradient(to top, rgba(255,150,70,.40), rgba(255,120,60,.12) 45%, transparent 78%)", transition: reduced ? "opacity .8s ease" : undefined }}
            />
            <div className="pointer-events-none absolute inset-0" style={{ opacity: "var(--o2)", background: "rgba(8,16,48,.22)", transition: reduced ? "opacity .8s ease" : undefined }} />

            {/* Clock + sun/moon track: the visible proof that time is moving. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy/55 to-transparent" />
            <span ref={clockEl} className="display pointer-events-none absolute top-3 left-4 text-3xl text-ivory tabular-nums md:text-4xl" aria-hidden="true">
              06:00
            </span>
            <p className="pointer-events-none absolute top-4 right-4 bg-navy/60 px-2.5 py-1 text-[0.58rem] tracking-[0.2em] text-ivory/85 uppercase backdrop-blur">Artist's impression</p>
            <div className="pointer-events-none absolute inset-x-4 bottom-4" aria-hidden="true">
              <div className="relative h-px bg-ivory/35">
                <div className="absolute inset-y-0 left-0 bg-gold-light" style={{ width: "calc(var(--p) * 100%)" }} />
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" style={{ left: "calc(var(--p) * 100%)" }}>
                  <span className="absolute inset-0 rounded-full bg-gold-light shadow-[0_0_16px_rgba(226,194,122,.95)]" style={{ opacity: "calc(1 - var(--o2))" }} />
                  <span className="absolute inset-0 rounded-full bg-ivory shadow-[inset_-5px_-1px_0_rgba(14,22,40,.55)]" style={{ opacity: "var(--o2)" }} />
                </span>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Tabs active={active} onPick={pick} />
            <div className="mt-2" aria-live="polite">
              <p className="text-[0.65rem] tracking-[0.22em] text-muted uppercase">{state.time}</p>
              <p className="display text-lg leading-snug text-navy">{state.line}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
