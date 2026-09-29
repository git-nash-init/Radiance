import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { developer } from "../../data/project";
import { completedProjects } from "../../data/projects";

/** The company profile — sits directly under the hero, ahead of the RADIANCE story. */
export function Developer() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="developer" className="bg-ivory">
      <div className="container-x grid gap-16 py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow" data-reveal="fade">
            About {developer.shortName}
          </p>
          <Lines className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-navy" lines={["Crafting dreams", <em key="e" className="text-gold-deep">since {developer.since}.</em>]} />
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted" data-reveal="up">
            {developer.about}
          </p>
          <p className="mt-5 max-w-lg leading-relaxed text-muted" data-reveal="up">
            {developer.journey}
          </p>

          {/* From the profile: "With a vision to transform spaces and lives…" */}
          <div className="mt-10 max-w-lg border-l border-gold pl-6" data-reveal="up">
            <p className="eyebrow">Our vision</p>
            <p className="display mt-3 text-3xl text-navy italic md:text-4xl">To transform spaces and lives.</p>
          </div>

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
                <img src={f.photo} alt={f.name} width="800" height="1067" className="absolute inset-x-0 bottom-0 h-[94%] w-full object-contain object-bottom" loading="lazy" />
              </div>
              <figcaption className="mt-4">
                <span className="display block text-2xl text-navy">{f.name}</span>
                <span className="text-xs tracking-[0.22em] text-muted uppercase">{f.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="border-t border-navy/10">
        <div className="container-x py-16 md:py-20">
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
      </div>
    </section>
  );
}
