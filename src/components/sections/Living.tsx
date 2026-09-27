import { useLayoutEffect, useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { Picture } from "../ui/Picture";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

// Copy adapted from brochure p5 ("Spacious living…", "Premium finishes…").
const PILLARS = [
  { n: "01", title: "Spacious living, designed for modern comfort", body: "Well-planned spacious rooms offer the perfect balance of comfort, functionality, and elegant living." },
  { n: "02", title: "Premium finishes for a refined lifestyle", body: "Elegant premium fittings and modern details bring style, comfort, and sophistication to every space." },
  { n: "03", title: "Better living, designed thoughtfully", body: "A community where every detail is thoughtfully planned for better living." },
];

export function Living() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // Gentle counter-parallax between the two renders.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".liv-a img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
      gsap.fromTo(".liv-b", { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="living-title">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow" data-reveal="fade">
              Signature architecture
            </p>
            <Lines
              as="h2"
              className="display mt-6 text-[clamp(2.6rem,5.4vw,5rem)] text-navy"
              lines={["Rising with quiet", <em key="c" className="text-gold-deep">confidence.</em>]}
            />
            <span id="living-title" className="sr-only">
              Signature architecture and living
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12">
          <div className="liv-a relative aspect-[4/5] overflow-hidden md:col-span-6 md:aspect-auto md:h-[88vh]" data-reveal="clip">
            <Picture id="front-night" alt="RADIANCE front elevation at night" sizes="(min-width: 768px) 50vw, 100vw" className="block h-full" imgClassName="h-[112%] w-full object-cover" />
          </div>
          <div className="flex flex-col justify-between gap-12 md:col-span-5 md:col-start-8">
            <ol className="space-y-10 md:pt-10">
              {PILLARS.map((p, i) => (
                <li key={p.n} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-navy/10 pt-6" data-reveal="up" data-delay={i * 0.08}>
                  <span className="display text-xl text-gold-ink">{p.n}</span>
                  <div>
                    <h3 className="display text-2xl text-navy md:text-[1.75rem]">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="liv-b relative aspect-[4/3] overflow-hidden" data-reveal="clip">
              <Picture id="rear-dusk" alt="RADIANCE rear elevation at dusk with landscaped grounds" sizes="(min-width: 768px) 40vw, 100vw" className="block h-full" imgClassName="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
