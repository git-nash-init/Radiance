# Site architecture

## Page flow (`/`)
1. **Hero:** a muted drone-orbit loop of the tower, the RADIANCE wordmark, "Explore the Experience" / "Enquire now", "Watch the film" and the RERA number.
2. **Intro (#project):** positioning, brochure-derived copy, developer stats and the address card.
3. **Unveiling:** a pinned canvas scrubbed by scroll through 72 frames of the gold-drape reveal from the client's film. This is the site's "3D camera move", made from real footage rather than invented geometry.
4. **Signature architecture:** brochure p5 pillars with the night and dusk renders.
5. **Immersive experience (#experience):** a draggable 360° preview, the tour features, and "Enter the experience" → `/experience`.
6. **Day · Evening · Night:** a pinned crossfade across the three real renders of the same street view.
7. **Amenities (#amenities):** an index and image stage. Copy comes from the brochure; labels come from the client's films.
8. **Gallery (#gallery):** 10 renders in a keyboard-navigable lightbox.
9. **Connectivity (#location):** the brochure's 5 destinations and minutes, drive-time rings, a click-to-load Google Map and directions.
10. **Developer (#developer):** since 2002, the founders, 264K built-up area, a reel of the 13 completed projects, the 36,700 sq ft landbank and the group companies.
11. **Downloads:** the brochure and company profile, both gated.
12. **Enquire (#enquire):** a lead form, call, email and WhatsApp.
13. **Footer:** both logos, both addresses, the RERA disclaimer and legal links.

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
