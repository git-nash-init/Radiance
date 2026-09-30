import { developer, project, type DocumentKey } from "./project";
import type { NavItem } from "./navigation";

/**
 * The site has two "faces": the company (home, /projects, legal pages) and the
 * RADIANCE project landing page (/radiance). Everything that differs between
 * them — logo, contacts, address, brochure, nav — lives here.
 */
export type BrandKey = "adinarayan" | "radiance";

export type Brand = {
  key: BrandKey;
  path: string;
  name: string;
  /** Logo for light backgrounds (solid header, ivory sections). */
  logoDark: string;
  /** Logo for dark backgrounds (over the hero film, navy footer). */
  logoLight: string;
  /** The Adinarayan logo is a full-colour mark on white, so it always sits on an ivory chip. */
  logoChip: boolean;
  phone: { display: string; tel: string; whatsapp: string };
  whatsappText: string;
  email: string;
  address: { label: string; lines: readonly string[]; oneLine: string };
  document: DocumentKey;
  footerBlurb: string;
  nav: NavItem[];
};

export const brands: Record<BrandKey, Brand> = {
  adinarayan: {
    key: "adinarayan",
    path: "/",
    name: developer.name,
    logoDark: "/media/logos/adinarayan.webp",
    logoLight: "/media/logos/adinarayan.webp",
    logoChip: true,
    phone: developer.phone,
    whatsappText: "Hi, I'd like to know more about Adinarayan Buildcon's projects.",
    email: developer.email,
    // From the company profile; the client has said he'll confirm the address.
    address: { label: "Corporate office", lines: developer.office.lines, oneLine: developer.office.lines.join(", ") },
    document: "profile",
    footerBlurb: `${developer.motto}. Building across Kalyan Dombivli since ${developer.since}.`,
    nav: [
      { label: "About", href: "#developer" },
      { label: "RADIANCE", to: "/radiance" },
      { label: "Projects", to: "/projects" },
      { label: "Experience", href: "#experience" },
    ],
  },
  radiance: {
    key: "radiance",
    path: "/radiance",
    name: project.name,
    logoDark: "/media/logos/radiance-dark.webp",
    logoLight: "/media/logos/radiance-light.webp",
    logoChip: false,
    phone: project.phone,
    whatsappText: "Hi, I'm interested in RADIANCE, Dombivli East. Please share more details.",
    email: project.email,
    address: { label: "Site address", lines: project.address.lines, oneLine: project.address.oneLine },
    document: "brochure",
    footerBlurb: `${project.positioning} in ${project.location}, by ${developer.name}.`,
    nav: [
      { label: "The Project", href: "#project" },
      { label: "Experience", href: "#experience" },
      { label: "Amenities", href: "#amenities" },
      { label: "Gallery", href: "#gallery" },
      { label: "Location", href: "#location" },
      { label: "Adinarayan", to: "/" },
    ],
  },
};

export const brandForPath = (pathname: string): Brand => (pathname.startsWith("/radiance") ? brands.radiance : brands.adinarayan);
