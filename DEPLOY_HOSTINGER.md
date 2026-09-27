# Deploying to Hostinger

The site builds to plain static files. Any Hostinger plan with File Manager/FTP works; no Node server is needed.

## 1. Build
```bash
cd radiance-web
npm install
npm run build
```
`dist/` then contains:
- the app (~1 MB)
- `.htaccess`, `robots.txt`, `sitemap.xml`
- `media/` (~25 MB)
- `documents/` (~20 MB)
- `videos/` (~150 MB)
- `virtual-tour/` (~320 MB, ~23,000 files)

## 2. Upload
The virtual tour has ~23,000 small files, so uploading a zip is far faster than FTP:
1. Zip the *contents* of `dist/` (not the folder itself). Include the hidden `.htaccess`.
2. In hPanel, go to **Files ▸ File Manager ▸ public_html**, upload the zip, then **Extract**.
3. Check that `public_html/index.html`, `public_html/.htaccess` and `public_html/virtual-tour/index.htm` exist.

For later updates that don't touch media or the tour, re-upload only `index.html` and `assets/`.

## 3. Domain & SSL
- Point the domain at Hostinger. The call transcript mentions a transfer from Google Domains/Squarespace that was stuck, and using Hostinger's free domain as a fallback.
- Enable the free SSL in hPanel. `.htaccess` already forces HTTPS.
- If the final domain isn't `www.adinarayanbuildconllp.com`, update `VITE_SITE_URL` in `.env`, the canonical/OG URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`, then rebuild.

## 4. What `.htaccess` does
- Routes `/experience`, `/privacy` and `/terms` to the React app, while real files (tour, media, PDFs) are served directly.
- Sets long-lived caching for hashed assets and media, no-cache for HTML, and forces PDFs to download.
- Adds correct MIME types for AVIF, WebP, WebM and WASM (the tour uses WASM decoders).

## 5. Bandwidth / optional CDN
The film (46–86 MB) is only fetched when a visitor presses play, and tour tiles stream on demand. If bandwidth becomes a concern:
1. Upload `videos/` to any CDN or object storage (Cloudflare R2, Bunny, S3…).
2. Set `VITE_MEDIA_BASE=https://your-cdn/radiance` in `.env` and rebuild. The video URLs then come from the CDN.

## 6. Post-launch checklist
- [ ] Set up the Google Sheet lead endpoint ([LEADS_SETUP.md](LEADS_SETUP.md)); send a test enquiry.
- [ ] Open `/experience` on desktop and on a phone in landscape.
- [ ] Download the brochure through the gate.
- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Create or claim the Google Business Profile (the transcript notes it doesn't exist yet) and link the site.
