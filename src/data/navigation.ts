/** `href` = in-page anchor on the home page; `to` = a separate route. */
export type NavItem = { label: string; href?: string; to?: string };

export const navLinks: NavItem[] = [
  { label: "Adinarayan", href: "#developer" },
  { label: "The Project", href: "#project" },
  { label: "Experience", href: "#experience" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Projects", to: "/projects" },
];
