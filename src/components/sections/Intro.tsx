import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { Picture } from "../ui/Picture";
import { project, developer } from "../../data/project";
import { completedProjects } from "../../data/projects";

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const stats = [
    { value: String(developer.since), label: "Building since" },
    { value: String(completedProjects.length), label: "Completed projects" },
    { value: developer.builtUpArea, label: "Built-up area delivered" },
  ];

  return (
    <section ref={ref} id="project" className="relative bg-ivory py-28 md:py-40">
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6 lg:col-span-5">
          <p className="eyebrow" data-reveal="fade">
            {project.positioning}
          </p>
          <Lines
            className="display mt-6 text-[clamp(2.6rem,5.4vw,4.9rem)] text-navy"
            lines={["A home shaped", "around the way", <em key="e" className="text-gold-deep">you live.</em>]}
          />
          <div className="gold-rule my-10 w-24" data-reveal="fade" />
          <p className="max-w-md text-lg leading-relaxed text-muted" data-reveal="up">
            RADIANCE is a community where every detail is thoughtfully planned for better living — well-planned, spacious rooms that balance comfort,
            functionality and elegance, finished with premium fittings and modern details.
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-muted" data-reveal="up" data-delay="0.1">
            Set in the heart of {project.location}, minutes from the station, schools and everyday conveniences.
          </p>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-navy/10 pt-8" data-reveal="up">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted uppercase">{s.label}</dt>
                <dd className="display order-1 text-4xl text-navy md:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/5] overflow-hidden" data-reveal="clip">
            <Picture id="street-evening" alt="RADIANCE tower at dusk, seen from the street" sizes="(min-width: 768px) 45vw, 100vw" imgClassName="h-full w-full object-cover" className="block h-full" />
          </div>
          <div className="relative z-10 -mt-20 ml-auto w-[82%] bg-navy p-8 text-ivory md:-mt-28 md:w-[70%] md:p-10" data-reveal="up" data-delay="0.2">
            <p className="eyebrow !text-gold-light">The address</p>
            <address className="mt-4 text-[0.95rem] leading-relaxed text-ivory/80 not-italic">
              {project.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <div className="mt-6 flex items-center gap-3 border-t border-ivory/10 pt-5 text-xs tracking-[0.18em] uppercase">
              <span className="text-ivory/50">MahaRERA</span>
              <span className="text-gold-light">{project.rera}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
