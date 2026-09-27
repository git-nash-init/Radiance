import { useRef, useState } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { Picture } from "../ui/Picture";
import { amenities, alsoFeatured } from "../../data/project";
import type { ImageId } from "../../data/media";

/**
 * Editorial index: a list of amenities on one side, a large image that
 * cross-fades to the hovered/focused amenity on the other. On phones the
 * list becomes stacked cards.
 */
export function Amenities() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useReveal(ref);

  return (
    <section ref={ref} id="amenities" className="relative bg-navy py-28 text-ivory md:py-40">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow !text-gold-light" data-reveal="fade">
              Amenities
            </p>
            <Lines className="display mt-6 text-[clamp(2.6rem,5.4vw,5rem)]" lines={["Everything you need,", <em key="e" className="text-gold-light">inside the community.</em>]} />
          </div>
          <p className="self-end leading-relaxed text-ivory/65 md:col-span-4 md:col-start-9" data-reveal="up">
            Fitness, play, reading and celebration — spaces within the premises so that everyday living feels effortless, for every age group.
          </p>
        </div>

        {/* Desktop: index + stage */}
        <div className="mt-20 hidden gap-12 md:grid md:grid-cols-12">
          <ul className="md:col-span-5" data-reveal="up">
            {amenities.map((a, i) => (
              <li key={a.id} className="border-t border-ivory/10 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className="group flex w-full items-baseline gap-6 py-6 text-left"
                >
                  <span className={`text-xs tracking-[0.2em] transition-colors duration-500 ${active === i ? "text-gold-light" : "text-ivory/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className={`display block text-3xl transition-all duration-700 lg:text-4xl ${active === i ? "translate-x-2 text-ivory" : "text-ivory/50 group-hover:text-ivory/80"}`}>
                      {a.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-cine)] ${active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-md pt-3 pl-2 text-[0.95rem] leading-relaxed text-ivory/65">{a.copy}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="relative md:col-span-7" data-reveal="clip">
            <div className="sticky top-24 aspect-[4/3] overflow-hidden">
              {amenities.map((a, i) => (
                <div
                  key={a.id}
                  className="absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-cine)]"
                  style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.06)" }}
                  aria-hidden={active !== i}
                >
                  <Picture id={a.image as ImageId} alt={a.title} sizes="55vw" className="block h-full" imgClassName="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <ul className="mt-14 space-y-12 md:hidden">
          {amenities.map((a) => (
            <li key={a.id} data-reveal="up">
              <div className="aspect-[4/3] overflow-hidden">
                <Picture id={a.image as ImageId} alt={a.title} sizes="100vw" className="block h-full" imgClassName="h-full w-full object-cover" />
              </div>
              <h3 className="display mt-5 text-3xl">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-ivory/65">{a.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20 border-t border-ivory/10 pt-10" data-reveal="up">
          <p className="eyebrow !text-gold-light">Also featured in the RADIANCE walkthrough</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {alsoFeatured.map((f) => (
              <li key={f} className="border border-ivory/15 px-4 py-2 text-sm text-ivory/75">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
