# RADIANCE — Adinarayan Buildcon LLP

A cinematic landing site for **RADIANCE, Dombivli East** (MahaRERA PR1330002600193). It includes a hero film, a scroll-scrubbed tower unveiling, the client's full 3DVista 360° tour, amenities, connectivity, the developer's track record, gated brochure downloads, and lead capture to a Google Sheet.

**Stack:** React 18 + TypeScript + Vite 8, Tailwind CSS v4, React Router, GSAP/ScrollTrigger, Lenis, Framer Motion (LazyMotion).

## Run it

```bash
npm install
npm run dev        # http://localhost:5188
npm run build      # → dist/
npm run preview    # http://localhost:4173 (serves dist/)
```

Copy `.env.example` to `.env` and set `VITE_LEADS_ENDPOINT` once the Apps Script is deployed (see [LEADS_SETUP.md](LEADS_SETUP.md)). Without it, form submissions are logged to the console and the UI behaves normally.

## Routes
| Route | What |
|---|---|
| `/` | **Adinarayan Buildcon LLP** home page: profile, group companies, projects, Day/Night, tour teaser, company-profile download, company enquiry |
| `/radiance` | **RADIANCE** landing page (the marketing link): intro, unveiling, tour, Day/Night, amenities, gallery, location, brochure download, RADIANCE enquiry |
| `/projects` | Ongoing (RADIANCE), landbank and all completed projects |
| `/experience` | Full-screen 3DVista tour. The iframe mounts only after "Enter experience". |
| `/privacy`, `/terms` | Legal pages (privacy, RERA disclaimer) |

## Media pipeline
Generated assets are already in `public/`. To regenerate from the client originals (in the parent folder):

```bash
npm run media:tour     # python — recovers the 3DVista web export from the EXE (pip install zstandard)
npm run media:video    # hero loop, full film, unveiling frames (ffmpeg-static)
npm run media:images   # AVIF/WebP responsive sets + logos (sharp) → src/data/images.json
npm run media:pdf      # python — project photos, founders, brochure previews, web-weight PDFs (PyMuPDF)
```

## Where things live
```
src/data/project.ts     all project/developer facts (single source of truth)
src/data/projects.ts    13 completed projects from the company profile
src/data/media.ts       image/video manifest helpers (VITE_MEDIA_BASE for a CDN)
src/components/sections one file per landing section
src/pages/Experience    3DVista wrapper
public/virtual-tour/    untouched 3DVista export (rebranded title only)
apps-script/Code.gs     Google Sheet lead endpoint
```

## Docs
- [ASSET_AUDIT.md](ASSET_AUDIT.md) — every supplied asset, what it is, where it's used
- [CONTENT_GAPS.md](CONTENT_GAPS.md) — facts to confirm with the client
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — colour, type, motion, layout
- [SITE_ARCHITECTURE.md](SITE_ARCHITECTURE.md) — structure and performance decisions
- [LEADS_SETUP.md](LEADS_SETUP.md) — Google Sheet lead capture
- [DEPLOY_HOSTINGER.md](DEPLOY_HOSTINGER.md) — going live
