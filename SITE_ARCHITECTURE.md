# Site architecture

## Two pages, one brand each
The site has two faces, chosen by route in `src/data/brands.ts` (`useBrand()`): the **company** (`/`, `/projects`, legal pages) and **RADIANCE** (`/radiance`). Logo, nav, phone/WhatsApp/email, address, footer, brochure card and enquiry copy all follow the brand.

### `/` — Adinarayan Buildcon LLP
1. **Hero:** the building film, a big ADINARAYAN wordmark ("Buildcon LLP · Since 2002", the motto), "Explore RADIANCE" and "Enquire now". The header carries only the Adinarayan logo.
2. **About (#developer):** since 2002, the two directors, the vision, stats and group companies.
3. **Projects teaser (#projects):** "One launching, 13 delivered" — RADIANCE (links to `/radiance`) and three completed projects, with a link to `/projects`.
4. **Rising with quiet confidence:** brochure p5 pillars with the night and dusk renders.
5. **Day · Evening · Night:** see below.
6. **Immersive experience (#experience):** draggable 360° preview → `/experience`.
7. **Downloads:** the company profile (gated).
8. **Enquire (#enquire):** "Talk to Adinarayan": the company phone, email and corporate office.
9. **Footer:** Adinarayan logo, corporate office, company contacts, "Now launching RADIANCE".

### `/radiance` — RADIANCE, Dombivli East
1. **Hero:** the same film, the Adinarayan chip + "presents", the RADIANCE wordmark, the tagline, "Explore the Experience" and the RERA number.
2. **Intro (#project):** "A home shaped around the way you live", the address card.
3. **Unveiling:** a pinned canvas scrubbed through 62 frames of the gold-drape reveal from the client's film (ends before the film dissolves into its logo splash). A real camera move made from real footage, not invented geometry.
4. **Rising with quiet confidence**, **Immersive experience (#experience)** and **Day · Evening · Night**, shared with home at the client's request.
5. **Amenities (#amenities):** pool, gym, indoor games, reading space, party hall and the kids' play area.
6. **Gallery (#gallery):** 10 renders in a keyboard-navigable lightbox.
7. **Connectivity (#location):** the brochure's 5 destinations and minutes, drive-time rings, an embedded Google Map with the plot pinned, and directions.
8. **Downloads:** the RADIANCE brochure (gated).
9. **Enquire (#enquire):** "Let us show you RADIANCE": the RADIANCE phone, email and site address.
10. **Footer:** RADIANCE logo, site address, RADIANCE contacts, "Developed by Adinarayan".

**Day · Evening · Night.** Progress is read from the section's real position every frame (`useStickyProgress`), so it stays in sync on phones. It drives the crossfade, a slow zoom, a warm/blue colour grade, a sun→moon track and a running clock. On phones the heading, image and controls are a flex column that fits one screen, so the tower is never clipped.

**Sharing the links.** `npm run build` also writes a real `dist/radiance/index.html` and `dist/projects/index.html` with their own title, description and Open Graph tags (`scripts/prerender-meta.mjs`), so WhatsApp/Facebook/Google previews of a marketing link to `/radiance` show RADIANCE, not the company. `vercel.json` rewrites unknown paths to the app so direct links and refreshes work; `.htaccess` does the same on Hostinger.

## `/projects`
Header stats, the ongoing project (RADIANCE, with links to the story, the tour and the enquiry form), the future project and 36,700 sq ft landbank, and all 13 completed projects with photo, year, area and units.

## `/experience`
- An intro overlay, then an iframe of `/virtual-tour/index.htm` (same origin).
- A branded loader, back/fullscreen/enquire controls in the one corner the 3DVista skin leaves free, and a slide-in enquiry panel.
- A rotate-to-landscape hint on portrait phones.

## Performance decisions
- **Tour:** ~320 MB of tiles, streamed tile-by-tile by 3DVista. Nothing is requested before the user clicks Enter (verified: zero `/virtual-tour/` requests on the home page).
- **Hero:** a 6 MB WebM/MP4 on desktop and 2 MB on mobile, paused when off-screen. The poster is pre-painted from `index.html`, so first paint is under 1 s even on throttled mobile.
- **Scrub frames:** fetched only when the section is within 1.5 viewports, and progressively.
- **Images:** AVIF + WebP at 640/1280/1920/2560, `sizes`-driven, with lazy loading and 24 px blurred placeholders.
- **Film:** 86 MB (1080p) / 46 MB (720p), loaded only when the modal opens.
- **Map:** loaded only on click.
- **JS:** about 158 KB gzipped in total, split into react / motion / app chunks. `/experience` and the legal pages are code-split.
- **Reveals:** a shared IntersectionObserver. ScrollTrigger is used only for the ~10 scrubbed/pinned effects, which removed ~3.7 s of forced layout at 4× CPU throttle.

**Lighthouse (mobile):** Accessibility 100, Best Practices 100, SEO 100.

## Leads
Every form posts `text/plain` JSON to the Apps Script web app, which appends it to the "Leads" sheet and optionally emails the sales inbox. The source is tagged `enquiry`, `brochure`, `profile` or `experience`. A honeypot field, consent checkbox and server-side validation are included. Brochure downloads are gated and remembered per device (localStorage).

## Content rules
All copy and numbers come from `src/data/project.ts` / `projects.ts`, and every value there is traceable to the brochure, the profile, the client's messages or the tour. Missing facts are listed in `CONTENT_GAPS.md`, never invented.
