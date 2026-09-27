import { useLayoutEffect, useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { developer } from "../../data/project";
import { completedProjects } from "../../data/projects";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

export function Developer() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  useReveal(ref);

  // Desktop: vertical scroll drives the project reel sideways.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !pin.current || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} id="developer" className="bg-ivory">
      <div className="container-x grid gap-16 py-28 md:py-40 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow" data-reveal="fade">
            The developer
          </p>
          <Lines className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-navy" lines={["Crafting dreams", <em key="e" className="text-gold-deep">since {developer.since}.</em>]} />
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted" data-reveal="up">
            {developer.about}
          </p>
          <p className="mt-5 max-w-lg leading-relaxed text-muted" data-reveal="up">
            {developer.journey}
          </p>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-navy/10 pt-8" data-reveal="up">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">Completed built-up area</dt>
              <dd className="display order-1 text-4xl text-navy">{developer.builtUpArea}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">Completed projects</dt>
              <dd className="display order-1 text-4xl text-navy">{completedProjects.length}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">Sq ft landbank, Dombivli East</dt>
              <dd className="display order-1 text-4xl text-navy">36,700</dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-5 self-end lg:col-span-5 lg:col-start-8">
          {developer.founders.map((f, i) => (
            <figure key={f.name} data-reveal="up" data-delay={i * 0.1} className={i === 1 ? "mt-16" : ""}>
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-sand to-stone">
                <img src={f.photo} alt={f.name} className="absolute inset-x-0 bottom-0 h-[94%] w-full object-contain object-bottom" loading="lazy" />
              </div>
              <figcaption className="mt-4">
                <span className="display block text-2xl text-navy">{f.name}</span>
                <span className="text-xs tracking-[0.22em] text-muted uppercase">{f.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div ref={pin} className="relative overflow-hidden bg-navy py-20 text-ivory lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 lg:pt-16">
        <div className="container-x mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow !text-gold-light">Track record</p>
            <h3 className="display mt-4 text-4xl md:text-5xl">Completed projects</h3>
          </div>
          <p className="hidden text-xs tracking-[0.22em] text-ivory/45 uppercase md:block">Ulhasnagar · Ambernath · Badlapur · Khopoli · Sawantwadi</p>
        </div>
        <div className="overflow-x-auto [scrollbar-width:none] lg:overflow-visible" data-lenis-prevent-horizontal>
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-5 px-[clamp(1.25rem,4vw,4rem)] lg:snap-none">
            {completedProjects.map((p) => (
              <article key={p.name} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw]">
                <div className="relative aspect-[4/5] overflow-hidden bg-navy-2">
                  {p.image ? (
                    <img src={p.image} alt={`${p.name}, ${p.location}`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <span className="display text-3xl text-ivory/30">{p.name}</span>
                    </div>
                  )}
                  {p.year && <span className="absolute top-4 left-4 bg-ivory px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-navy">{p.year}</span>}
                </div>
                <h4 className="display mt-5 text-2xl">{p.name}</h4>
                <p className="mt-1 text-sm text-ivory/55">
                  {[p.location, p.type].filter(Boolean).join(" · ")}
                </p>
                {(p.area || p.units) && <p className="mt-1 text-sm text-gold-light/85">{[p.area, p.units].filter(Boolean).join(" · ")}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow md:col-span-3" data-reveal="fade">
            Group companies
          </p>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3" data-reveal="up">
            {developer.groupCompanies.map((c) => (
              <li key={c} className="border-b border-navy/10 pb-4 text-navy">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
