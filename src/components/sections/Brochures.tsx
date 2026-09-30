import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { documents, type DocumentKey } from "../../data/project";
import { useBrand } from "../../hooks/useBrand";
import { useOverlays } from "../ui/Overlays";

const CARD_COPY: Record<DocumentKey, { eyebrow: string; blurb: string }> = {
  brochure: { eyebrow: "The project", blurb: "Location, amenities and the RADIANCE lifestyle — the complete project brochure." },
  profile: { eyebrow: "The developer", blurb: "Two decades of Adinarayan Buildcon: founders, credentials and completed projects." },
};

/** Shows the download card(s) for the current page: company profile on home, brochure on RADIANCE. */
export function Brochures({ docs }: { docs: DocumentKey[] }) {
  const ref = useRef<HTMLElement>(null);
  const { openDocument } = useOverlays();
  const brand = useBrand();
  useReveal(ref);

  return (
    <section ref={ref} className="bg-sand py-24 md:py-32" aria-labelledby="downloads-title">
      <div className="container-x">
        <div className="mb-12">
          <p className="eyebrow" data-reveal="fade">
            Downloads
          </p>
          <h2 id="downloads-title" className="display mt-4 text-[clamp(2.2rem,4vw,3.6rem)] text-navy" data-reveal="up">
            {brand.key === "radiance" ? (
              <>
                Take RADIANCE <em className="text-gold-deep">home.</em>
              </>
            ) : (
              <>
                Know Adinarayan <em className="text-gold-deep">better.</em>
              </>
            )}
          </h2>
        </div>
        <div className={`grid gap-6 ${docs.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
          {docs.map((key, i) => {
            const doc = documents[key];
            const { eyebrow, blurb } = CARD_COPY[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => openDocument(key)}
                className="group grid grid-cols-[38%_1fr] overflow-hidden bg-ivory text-left transition-shadow duration-700 hover:shadow-[0_30px_60px_-30px_rgba(14,22,40,0.35)]"
                data-reveal="up"
                data-delay={i * 0.1}
              >
                <div className="relative overflow-hidden bg-navy">
                  <img src={doc.cover} alt="" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cine)] group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-col p-7 md:p-10">
                  <p className="eyebrow">{eyebrow}</p>
                  <p className="display mt-3 text-3xl text-navy md:text-4xl">{doc.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{blurb}</p>
                  <span className="mt-auto flex items-center gap-3 pt-8 text-[0.7rem] font-semibold tracking-[0.22em] text-navy uppercase">
                    <span className="flex h-10 w-10 items-center justify-center border border-navy/25 transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ivory">
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <path d="M7 1v10M3 7l4 4 4-4M1 15h12" />
                      </svg>
                    </span>
                    Download PDF · {doc.size}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
