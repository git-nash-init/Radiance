// After `vite build`: write a real index.html for each landing route with its
// own <title>, description, canonical and Open Graph tags. Link previews
// (WhatsApp, Facebook/Instagram ads, Google) read the static HTML and do not run
// the app, so without this /radiance would be shared with the home page's tags.
// The body is the same SPA shell; React renders the page on load.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(import.meta.dirname, "..", "dist");
const SITE = (process.env.VITE_SITE_URL ?? "https://www.adinarayanbuildconllp.com").replace(/\/$/, "");

const ROUTES = {
  radiance: {
    title: "RADIANCE, Dombivli East — Premium Lifestyle Residence | Adinarayan Buildcon LLP",
    description:
      "RADIANCE by Adinarayan Buildcon LLP — a premium lifestyle residence in Dombivli East. Explore the architecture, the 360° virtual tour, amenities and connectivity. MahaRERA No. PR1330002600193.",
    ogTitle: "RADIANCE, Dombivli East — Crafting Spaces, Elevating Lives",
    ogDescription: "A premium lifestyle residence in Dombivli East by Adinarayan Buildcon LLP. MahaRERA No. PR1330002600193.",
  },
  projects: {
    title: "Projects — Adinarayan Buildcon LLP | RADIANCE and 13 completed projects",
    description:
      "Ongoing and completed projects by Adinarayan Buildcon LLP: RADIANCE in Dombivli East, and 13 delivered residential and commercial projects across Ulhasnagar, Ambernath, Badlapur, Khopoli and Sawantwadi since 2002.",
    ogTitle: "Projects — Adinarayan Buildcon LLP",
    ogDescription: "RADIANCE in Dombivli East and 13 completed projects since 2002.",
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const indexPath = path.join(DIST, "index.html");
if (!existsSync(indexPath)) throw new Error("dist/index.html not found — run vite build first");
const template = readFileSync(indexPath, "utf8");

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender-meta: tag not found for ${pattern}`);
  return html.replace(pattern, replacement);
}

for (const [route, m] of Object.entries(ROUTES)) {
  const url = `${SITE}/${route}`;
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(m.description)}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(m.ogTitle)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(m.ogDescription)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`);
  mkdirSync(path.join(DIST, route), { recursive: true });
  writeFileSync(path.join(DIST, route, "index.html"), html);
  console.log(`prerender-meta: dist/${route}/index.html`);
}
