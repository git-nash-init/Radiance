import { useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { Picture } from "../ui/Picture";
import { completedProjects, featuredCompleted, ongoingProject } from "../../data/projects";
import { project } from "../../data/project";

/** Home-page summary; the full track record lives on /projects. */
export function ProjectsTeaser() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const featured = featuredCompleted.map((n) => completedProjects.find((p) => p.name === n)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <section ref={ref} id="projects" className="bg-navy py-24 text-ivory md:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow !text-gold-light" data-reveal="fade">
              Our projects
            </p>
            <Lines className="display mt-6 text-[clamp(2.4rem,5vw,4.4rem)]" lines={["One launching,", <em key="e" className="text-gold-light">{completedProjects.length} delivered.</em>]} />
          </div>
          <Link to="/projects" className="btn btn-ghost-light self-start md:self-auto" data-reveal="fade">
            View all projects
          </Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <article className="group relative overflow-hidden lg:col-span-7" data-reveal="up">
            <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[28rem]">
              <Picture
                id={ongoingProject.image}
                alt="RADIANCE, the ongoing Adinarayan project in Dombivli East"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="block h-full"
                imgClassName="h-full w-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-cine)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <span className="inline-block bg-gold px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-navy uppercase">Ongoing</span>
              <h3 className="display mt-4 text-4xl md:text-5xl">{ongoingProject.name}</h3>
              <p className="mt-2 text-sm text-ivory/70">
                {ongoingProject.positioning} · {ongoingProject.location} · MahaRERA {project.rera}
              </p>
            </div>
          </article>

          <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {featured.map((p, i) => (
              <li key={p.name} className="flex gap-4 sm:flex-col lg:flex-row" data-reveal="up" data-delay={0.08 * (i + 1)}>
                {p.image && <img src={p.image} alt={`${p.name}, ${p.location}`} width="600" height="600" loading="lazy" className="h-28 w-28 shrink-0 object-cover sm:h-44 sm:w-full lg:h-32 lg:w-32" />}
                <div className="self-center">
                  <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold-light uppercase">Completed {p.year}</p>
                  <h3 className="display mt-1 text-2xl">{p.name}</h3>
                  <p className="mt-1 text-sm text-ivory/60">{[p.location, p.area, p.units].filter(Boolean).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
