import { useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../components/motion/useReveal";
import { Lines } from "../components/motion/Lines";
import { Picture } from "../components/ui/Picture";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { developer, project } from "../data/project";
import { completedProjects, landbank, ongoingProject } from "../data/projects";

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useDocumentMeta({
    title: `Projects — ${developer.name} | RADIANCE and ${completedProjects.length} completed projects`,
    description: `Ongoing and completed projects by ${developer.name}: RADIANCE in Dombivli East, and ${completedProjects.length} delivered residential and commercial projects across Ulhasnagar, Ambernath, Badlapur, Khopoli and Sawantwadi since ${developer.since}.`,
    path: "/projects",
  });

  const stats = [
    { value: String(developer.since), label: "Building since" },
    { value: String(completedProjects.length), label: "Completed projects" },
    { value: developer.builtUpArea, label: "Built-up area delivered" },
    { value: "1", label: "Ongoing project" },
  ];

  return (
    <div ref={ref}>
      {/* Header */}
      <header className="bg-navy pt-36 pb-20 text-ivory md:pt-44 md:pb-28">
        <div className="container-x">
          <p className="eyebrow !text-gold-light" data-reveal="fade">
            {developer.name}
          </p>
          <Lines as="h1" className="display mt-6 text-[clamp(3rem,7vw,6rem)]" lines={["Our", <em key="e" className="text-gold-light">projects.</em>]} />
          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-ivory/15 pt-8 md:grid-cols-4" data-reveal="up">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-ivory/55 uppercase">{s.label}</dt>
                <dd className="display order-1 text-4xl md:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Ongoing */}
      <section id="ongoing" className="bg-ivory py-24 md:py-32" aria-labelledby="ongoing-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal="clip">
            <div className="aspect-[4/3] overflow-hidden">
              <Picture id={ongoingProject.image} alt="RADIANCE, aerial view over Dombivli East" sizes="(min-width: 1024px) 58vw, 100vw" className="block h-full" imgClassName="h-full w-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <span className="inline-block bg-gold px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-navy uppercase" data-reveal="fade">
              Ongoing
            </span>
            <h2 id="ongoing-title" className="display mt-5 text-5xl text-navy md:text-6xl" data-reveal="up">
              {ongoingProject.name}
            </h2>
            <p className="mt-3 text-sm tracking-[0.18em] text-muted uppercase" data-reveal="up">
              {ongoingProject.positioning} · {ongoingProject.location}
            </p>
            <p className="mt-6 max-w-md leading-relaxed text-muted" data-reveal="up">
              {project.tagline}. A community where every detail is thoughtfully planned for better living — with a gym, indoor games, a reading space, a party hall and a kids' play area inside the premises.
            </p>
            <p className="mt-6 text-xs tracking-[0.2em] text-muted uppercase" data-reveal="up">
              MahaRERA No. <span className="text-navy">{project.rera}</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-4" data-reveal="up">
              <Link to="/radiance" className="btn btn-gold">
                Explore RADIANCE
              </Link>
              <Link to="/experience" className="btn btn-ghost-dark">
                Virtual tour
              </Link>
              <Link to={{ pathname: "/radiance", hash: "#enquire" }} className="btn btn-ghost-dark">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Landbank */}
      <section id="upcoming" className="bg-sand py-24 md:py-32" aria-labelledby="upcoming-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5 lg:col-start-2">
            <span className="inline-block border border-navy/30 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-navy uppercase" data-reveal="fade">
              Future project &amp; landbank
            </span>
            <h2 id="upcoming-title" className="display mt-5 text-4xl text-navy md:text-5xl" data-reveal="up">
              {landbank.area}, <em className="text-gold-deep">{landbank.location}.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted" data-reveal="up">
              {landbank.copy}
            </p>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-4 lg:col-start-8" data-reveal="clip">
            <img src={landbank.image} alt="Aerial impression of the Dombivli East landbank" width="864" height="1232" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Completed */}
      <section id="completed" className="bg-ivory py-24 md:py-32" aria-labelledby="completed-title">
        <div className="container-x">
          <p className="eyebrow" data-reveal="fade">
            Track record
          </p>
          <h2 id="completed-title" className="display mt-5 text-[clamp(2.4rem,5vw,4.4rem)] text-navy" data-reveal="up">
            Completed <em className="text-gold-deep">projects</em>
          </h2>
          <p className="mt-4 max-w-xl text-muted" data-reveal="up">
            Ulhasnagar · Ambernath · Badlapur · Khopoli · Sawantwadi — residential and commercial, delivered between 2005 and 2021.
          </p>

          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map((p, i) => (
              <li key={p.name} data-reveal="up" data-delay={(i % 3) * 0.06}>
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  {p.image ? (
                    <img src={p.image} alt={`${p.name}, ${p.location}`} width="800" height="1000" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <span className="display text-3xl text-navy/30">{p.name}</span>
                    </div>
                  )}
                  {p.year && <span className="absolute top-4 left-4 bg-ivory px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-navy">{p.year}</span>}
                </div>
                <h3 className="display mt-5 text-2xl text-navy">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{[p.location, p.type].filter(Boolean).join(" · ")}</p>
                {(p.area || p.units) && <p className="mt-1 text-sm text-gold-ink">{[p.area, p.units].filter(Boolean).join(" · ")}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section className="bg-navy py-20 text-center text-ivory md:py-28">
        <div className="container-x">
          <p className="display text-4xl md:text-5xl" data-reveal="up">
            See what we're building <em className="text-gold-light">next.</em>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal="up">
            <Link to={{ pathname: "/radiance", hash: "#enquire" }} className="btn btn-gold">
              Enquire about RADIANCE
            </Link>
            <Link to="/" className="btn btn-ghost-light">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
