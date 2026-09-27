import { useLayoutEffect, useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { connectivity, project } from "../../data/project";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

// Rings are drawn by drive time (brochure figures). Angles only spread the
// labels for legibility — they are not compass bearings.
const RING = { 1: 92, 5: 168, 10: 236 } as const;
const ANGLES = [-128, -52, 12, 128, 62];

export function Connectivity() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".conn-diagram", start: "top 75%", once: true } });
      tl.fromTo(".conn-ring", { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 1.6, stagger: 0.15, ease: "expo.out" })
        .fromTo(".conn-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 0.4)
        .fromTo(".conn-node", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.8, stagger: 0.12, ease: "back.out(2)" }, 0.9)
        .fromTo(".conn-label", { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.12 }, 1.1);
    }, el);
    return () => ctx.revert();
  }, []);

  // `q=` (rather than `ll=`) drops Google's own red pin exactly on the plot,
  // which is what visually "highlights" the address on the embedded map.
  const mapSrc = `https://maps.google.com/maps?q=${project.geo.lat},${project.geo.lng}&z=17&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${project.geo.lat},${project.geo.lng}`;

  return (
    <section ref={ref} id="location" className="relative overflow-hidden bg-sand py-28 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal="fade">
            Connectivity
          </p>
          <Lines className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-navy" lines={["Every destination,", <em key="e" className="text-gold-deep">just minutes away.</em>]} />
          <p className="mt-8 max-w-md leading-relaxed text-muted" data-reveal="up">
            Experience the advantage of a well-connected address, with major landmarks and essential destinations within easy reach.
          </p>

          <ol className="mt-12 border-t border-navy/15" data-reveal="up">
            {[...connectivity]
              .sort((a, b) => a.minutes - b.minutes)
              .map((c) => (
                <li key={c.name} className="flex items-baseline justify-between gap-6 border-b border-navy/15 py-5">
                  <span>
                    <span className="block text-[0.65rem] font-semibold tracking-[0.22em] text-muted uppercase">{c.kind}</span>
                    <span className="display mt-1 block text-2xl text-navy">{c.name}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="display text-4xl text-gold-deep">{c.minutes}</span>
                    <span className="ml-1 text-xs tracking-[0.2em] text-muted uppercase">min</span>
                  </span>
                </li>
              ))}
          </ol>
          <p className="mt-4 text-xs text-muted">Approximate travel times as stated in the project brochure.</p>
        </div>

        <div className="lg:col-span-7">
          <div className="conn-diagram relative mx-auto aspect-square w-full max-w-[560px]">
            <svg viewBox="-280 -280 560 560" className="h-full w-full overflow-visible" role="img" aria-label="Drive-time rings around RADIANCE">
              {Object.entries(RING).map(([min, r]) => (
                <g key={min} className="conn-ring">
                  <circle r={r} fill="none" stroke="#0e1628" strokeOpacity="0.14" strokeDasharray="2 6" />
                  <text y={-r - 8} textAnchor="middle" className="fill-muted text-[10px] tracking-[0.2em] uppercase">
                    {min} min
                  </text>
                </g>
              ))}
              {connectivity.map((c, i) => {
                const r = RING[c.minutes as keyof typeof RING];
                const a = (ANGLES[i] * Math.PI) / 180;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r;
                const right = x >= 0;
                return (
                  <g key={c.name}>
                    <line className="conn-line" x1="0" y1="0" x2={x} y2={y} stroke="#b8893b" strokeWidth="1.2" pathLength={1} strokeDasharray="1" />
                    <circle className="conn-node" cx={x} cy={y} r="6" fill="#f7f4ee" stroke="#b8893b" strokeWidth="1.5" />
                    <text className="conn-label fill-navy text-[13px]" x={x + (right ? 14 : -14)} y={y + 4} textAnchor={right ? "start" : "end"} style={{ fontFamily: "var(--font-sans)" }}>
                      {c.name}
                    </text>
                  </g>
                );
              })}
              <circle r="44" fill="#0e1628" />
              <circle r="52" fill="none" stroke="#b8893b" strokeOpacity="0.5" />
              <text y="4" textAnchor="middle" className="fill-gold-light text-[8.5px] tracking-[0.22em]" style={{ fontFamily: "var(--font-sans)" }}>
                RADIANCE
              </text>
            </svg>
          </div>

          <div className="relative mt-10 aspect-[16/10] overflow-hidden bg-navy" data-reveal="up">
            <iframe
              title={`RADIANCE — ${project.address.oneLine}`}
              src={mapSrc}
              className="h-full w-full border-0 grayscale-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Google's own pin (from mapSrc above) marks the exact plot; this
                label just reinforces which pin on the map is RADIANCE. */}
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 bg-navy/85 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-ivory uppercase backdrop-blur">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-gold-light" aria-hidden="true" />
              Radiance
            </div>
          </div>
          <a href={directions} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-block text-xs font-semibold tracking-[0.22em] text-navy uppercase">
            Get directions →
          </a>
        </div>
      </div>
    </section>
  );
}
