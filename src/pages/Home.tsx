import { Hero } from "../components/sections/Hero";
import { Developer } from "../components/sections/Developer";
import { ProjectsTeaser } from "../components/sections/ProjectsTeaser";
import { Living } from "../components/sections/Living";
import { DayNight } from "../components/sections/DayNight";
import { ExperienceTeaser } from "../components/sections/ExperienceTeaser";
import { Brochures } from "../components/sections/Brochures";
import { Enquire } from "../components/sections/Enquire";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useHashScroll } from "../hooks/useHashScroll";

/** The company (Adinarayan Buildcon LLP) home page. The RADIANCE project lives at /radiance. */
export default function Home() {
  useDocumentMeta({
    title: "Adinarayan Buildcon LLP — Crafting dreams since 2002 | Kalyan Dombivli",
    description:
      "Adinarayan Buildcon LLP: developers in Kalyan Dombivli since 2002, with 13 completed projects and RADIANCE, a premium lifestyle residence now launching in Dombivli East.",
    path: "/",
  });
  useHashScroll();

  return (
    <>
      <Hero variant="adinarayan" />
      <Developer />
      <ProjectsTeaser />
      <Living />
      <DayNight />
      <ExperienceTeaser />
      <Brochures docs={["profile"]} />
      <Enquire />
    </>
  );
}
