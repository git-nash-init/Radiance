# Design system — RADIANCE

**Direction:** an architectural film crossed with a luxury editorial. Slow, precise motion. Ivory calm, broken by navy "cinema" moments. Gold is used sparingly, the way it appears in the logo.

## Colour (derived from the RADIANCE logo)
| Token | Hex | Use |
|---|---|---|
| `ivory` | #F7F4EE | Primary light surface |
| `sand` | #EDE6DA | Alternate light surface (Day/Night, Connectivity, Downloads) |
| `stone` | #D9CFBF | Founder portrait backdrop |
| `navy` | #0E1628 | Text on light, cinematic dark sections, footer |
| `navy-2` | #16213A | Cards on navy |
| `ink` | #1B2233 | Body text |
| `muted` | #6B6457 | Secondary text |
| `gold` | #B8893B | Buttons, rules, accents (not for small text on light) |
| `gold-light` | #E2C27A | Accents and italics on navy |
| `gold-deep` | #8F6A2C | Italic headline accents on light (≥ 3:1) |
| `gold-ink` | #7D5C24 | Eyebrows and small gold text on light (≥ 4.5:1) |

Primary buttons are **navy text on gold**, which keeps the brand gold and passes WCAG AA. Lighthouse accessibility scores 100.

## Type
- **Display:** Cormorant Garamond 300/400/500 + italic. It matches the high-contrast serif of the RADIANCE wordmark. Lining numerals are used.
- **Wordmark treatment:** uppercase with 0.18–0.34em tracking.
- **Body/UI:** Manrope (variable).
- **Eyebrow:** 0.72rem, 600 weight, 0.32em tracking, uppercase.
- Fonts are self-hosted via `@fontsource`, so there are no Google Fonts requests.

## Motion
- **Easing:** `expo.out` / `cubic-bezier(.16,1,.3,1)`. Reveals take 1.1–1.6 s; image wipes use `expo.inOut`.
- **Patterns** (`useReveal`):
  - `up` — rise and fade
  - `fade`
  - `clip` — the image wipes up while scaling from 1.18 to 1
  - `lines` — headline lines rise out of masks
- **Scroll-linked effects** (GSAP ScrollTrigger + Lenis):
  - hero parallax
  - unveiling frame scrub
  - Day/Evening/Night crossfade
  - project reel pinned sideways (desktop)
  - architecture counter-parallax
- **Reduced motion:** there is no smooth scroll and no reveals. The scrub becomes a still frame, the hero shows its poster, and Day/Night becomes simple tabs.
- **Not used:** bounce, float, spin, or constant motion.

## Layout
- Container max 1440 px, with fluid gutters `clamp(1.25rem, 4vw, 4rem)`.
- 12-column editorial grid, with asymmetric image/text pairs.
- Section rhythm: ivory → navy → ivory → navy … not every section is dark.
- Mobile gets its own treatments, not a collapsed desktop:
  - stacked amenity cards
  - a swipeable project reel
  - a sticky Call / WhatsApp / Enquire bar
  - a full-screen menu

## Components
Nav · Hero · Intro · Unveiling (canvas scrub) · Living · ExperienceTeaser (draggable 360° peek) · DayNight · Amenities (index + stage) · Gallery (+ lightbox) · Connectivity (drive-time rings + lazy map) · Developer (founders, reel, group) · Brochures (gated) · Enquire · Footer · MobileBar · Modal · LeadForm.
