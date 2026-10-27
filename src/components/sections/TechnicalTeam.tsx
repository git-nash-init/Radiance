import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { technicalTeam, siteExecutionPhotos } from "../../data/project";

type Props = {
  /** Optional variant: 'company' (default on home) or 'project' (on /radiance). */
  variant?: "company" | "project";
};

export function TechnicalTeam({ variant = "company" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const isProject = variant === "project";

  return (
    <section ref={ref} id="technical-team" className="relative bg-sand py-24 md:py-36" aria-labelledby="technical-team-title">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="eyebrow" data-reveal="fade">
            Technical Team &amp; Consultants
          </p>
          <h2 id="technical-team-title" className="sr-only">
            Technical Team — Architect, PMC, MEP, Structural Engineer and Parking Consultants
          </h2>
          <Lines
            className="display mt-6 text-[clamp(2.5rem,5vw,4.4rem)] text-navy"
            lines={[
              isProject ? "Engineered for excellence," : "Precision engineering,",
              <em key="e" className="text-gold-deep">
                anchored by trusted experts.
              </em>,
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-muted" data-reveal="up">
            Anchored by an extraordinary multidisciplinary team of architects, engineers, project management consultants, and specialized planners
            with extensive experience across building and infrastructure developments.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technicalTeam.map((item, index) => (
            <article
              key={item.id}
              className="group relative flex flex-col justify-between border border-navy/10 bg-ivory p-8 transition-all duration-700 hover:-translate-y-1 hover:border-gold hover:shadow-[0_24px_48px_-20px_rgba(14,22,40,0.18)]"
              data-reveal="up"
              data-delay={0.06 * (index + 1)}
            >
              {/* Card Header: Index & Badge */}
              <div>
                <div className="flex items-center justify-between border-b border-navy/10 pb-5">
                  <span className="font-mono text-xs font-semibold tracking-wider text-gold-deep">0{index + 1}</span>
                  <span className="inline-block bg-sand px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-navy uppercase">
                    {item.badge}
                  </span>
                </div>

                {/* Role Icon & Title */}
                <div className="mt-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-navy/15 bg-sand/60 text-gold-deep transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ivory">
                    {item.id === "architect" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 21h18" />
                        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                        <path d="M9 9h1" />
                        <path d="M9 13h1" />
                        <path d="M9 17h1" />
                        <path d="M14 9h1" />
                        <path d="M14 13h1" />
                        <path d="M14 17h1" />
                      </svg>
                    )}
                    {item.id === "pmc" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    )}
                    {item.id === "mep" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    )}
                    {item.id === "structural" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="4" y="3" width="16" height="18" rx="1" />
                        <path d="m4 3 16 18" />
                        <path d="m20 3-16 18" />
                        <path d="M4 12h16" />
                      </svg>
                    )}
                    {item.id === "parking" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3 3 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                        <path d="M2 7h20" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase">
                      {item.role}
                    </span>
                    <h3 className="display mt-1 text-2xl text-navy">{item.title}</h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>

              {/* Highlights tags */}
              <div className="mt-8 border-t border-navy/10 pt-5">
                <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted uppercase">Key Focus</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.highlights.map((tag) => (
                    <span key={tag} className="border border-navy/10 bg-sand/40 px-2 py-0.5 text-[0.68rem] text-navy">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* On-Site Engineering & Ground Reality */}
        <div className="mt-20 border-t border-navy/10 pt-16" data-reveal="up">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Ground Reality &amp; Execution</p>
              <h3 className="display mt-3 text-3xl text-navy md:text-4xl">
                Precision engineering, <em className="text-gold-deep">active on site.</em>
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Behind every calculation and IS-code specification is our dedicated site engineering crew — carrying out daily inspections, blueprint verifications, and stage-wise structural oversight.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {siteExecutionPhotos.map((photo, i) => (
              <figure
                key={photo.id}
                className="group relative overflow-hidden border border-navy/10 bg-ivory transition-all duration-700 hover:border-gold hover:shadow-[0_20px_40px_-15px_rgba(14,22,40,0.18)]"
                data-reveal="up"
                data-delay={i * 0.1}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width="1280"
                    height="960"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-cine)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 bg-navy/90 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-gold-light uppercase backdrop-blur-xs">
                    {photo.subtitle}
                  </span>
                  <div className="absolute right-6 bottom-6 left-6 text-ivory">
                    <p className="display text-2xl md:text-3xl">{photo.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/80">{photo.description}</p>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>

        {/* Bottom Trust Assurance Bar */}
        <div className="mt-14 border-t border-navy/10 pt-10" data-reveal="up">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold-light">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-navy">
                <strong className="font-semibold text-navy">Uncompromising Construction Standards:</strong> Every stage conforms to
                Bureau of Indian Standards (IS Codes), National Building Code, and MahaRERA compliance mandates.
              </p>
            </div>
            <a
              href="#enquire"
              className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.22em] text-gold-deep uppercase hover:text-navy"
            >
              Consult with our team
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M1 5h12M9 1l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
