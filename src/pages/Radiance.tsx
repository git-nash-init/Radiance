import { Hero } from "../components/sections/Hero";
import { Intro } from "../components/sections/Intro";
import { Unveiling } from "../components/sections/Unveiling";
import { Living } from "../components/sections/Living";
import { ExperienceTeaser } from "../components/sections/ExperienceTeaser";
import { DayNight } from "../components/sections/DayNight";
import { Amenities } from "../components/sections/Amenities";
import { Gallery } from "../components/sections/Gallery";
import { Connectivity } from "../components/sections/Connectivity";
import { Brochures } from "../components/sections/Brochures";
import { Enquire } from "../components/sections/Enquire";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useHashScroll } from "../hooks/useHashScroll";

/** RADIANCE, Dombivli East — the project's own landing page (marketing link target). */
export default function Radiance() {
  useDocumentMeta({
    title: "RADIANCE, Dombivli East — Premium Lifestyle Residence | Adinarayan Buildcon LLP",
    description:
      "RADIANCE by Adinarayan Buildcon LLP — a premium lifestyle residence in Dombivli East. Explore the architecture, the 360° virtual tour, amenities and connectivity. MahaRERA No. PR1330002600193.",
    path: "/radiance",
  });
  useHashScroll();

  return (
    <>
      <Hero variant="radiance" />
      <Intro />
      <Unveiling />
      <Living />
      <ExperienceTeaser />
      <DayNight />
      <Amenities />
      <Gallery />
      <Connectivity />
      <Brochures docs={["brochure"]} />
      <Enquire />
    </>
  );
}
