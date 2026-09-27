"""Pull website imagery out of the client PDFs and publish the PDFs themselves.

- Company profile: one photo per completed project (pages 5-17), founders
  (page 3), ongoing RADIANCE (page 18) and landbank (page 19).
- Brochure: page previews for the gated-download card.
- Both PDFs are copied (and losslessly re-compressed) to public/documents/.

Usage: python scripts/extract-pdf-images.py
"""
import io
import os
import shutil
import fitz
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "..", "Brochures_Profiles")
PROFILE = os.path.join(SRC, "_Adinarayan Buildcon Profile-1 pdf.pdf")
BROCHURE = os.path.join(SRC, "Adinarayan Buildcon Brochure.pdf")
IMG_OUT = os.path.join(ROOT, "public", "media", "company")
DOC_OUT = os.path.join(ROOT, "public", "documents")

# Background/decoration xrefs that repeat on every profile page.
DECOR = {145, 146, 271}

# page -> (slug, photo xref). Mapped by hand: some photos are reused as page
# decoration elsewhere. Page 12 (Guru Saptashri) reuses page 10's photo in the
# source PDF, so it gets no image of its own (flagged in CONTENT_GAPS.md).
PROJECT_PAGES = {
    5: ("matoshree", 270), 6: ("lakshmikant", 314), 7: ("guru-chintan", 364),
    8: ("guru-pushpa", 403), 9: ("guru-prasad", 451), 10: ("guru-ganesh", 493),
    11: ("guru-vishnu", 547), 13: ("guru-krupa", 635), 14: ("guru-dev", 674),
    15: ("riddhi-siddhi", 723), 16: ("satam-maharaj-mandir", 756),
    17: ("shree-shriya", 772), 18: ("radiance-ongoing", 800), 19: ("landbank", 821),
}


def save(doc, xref, name, max_w=1200):
    pix = doc.extract_image(xref)
    im = Image.open(io.BytesIO(pix["image"])).convert("RGB")
    im.thumbnail((max_w, max_w * 2))
    path = os.path.join(IMG_OUT, f"{name}.webp")
    im.save(path, "WEBP", quality=78)
    print(name, im.size)


def main():
    os.makedirs(IMG_OUT, exist_ok=True)
    os.makedirs(DOC_OUT, exist_ok=True)
    prof = fitz.open(PROFILE)

    for name, xref in PROJECT_PAGES.values():
        save(prof, xref, name)

    # Founders page: render the page region instead of guessing which xref is who.
    page = prof[2]
    pix = page.get_pixmap(dpi=110)
    Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(
        os.path.join(IMG_OUT, "founders-page.webp"), "WEBP", quality=80)
    # Founder portraits are stored as RGB + a separate soft mask; recombine
    # into transparent cut-outs. Left on the page = Umakant, right = Pranav.
    for xref, name in [(175, "umakant-samant"), (173, "pranav-samant")]:
        base = fitz.Pixmap(prof, xref)
        mask_xref = prof.extract_image(xref).get("smask")
        rgb = Image.frombytes("RGB", (base.width, base.height), fitz.Pixmap(fitz.csRGB, base).samples)
        if mask_xref:
            m = fitz.Pixmap(prof, mask_xref)
            rgb.putalpha(Image.frombytes("L", (m.width, m.height), m.samples).resize(rgb.size))
        rgb.thumbnail((800, 1100))
        rgb.save(os.path.join(IMG_OUT, f"{name}.webp"), "WEBP", quality=82)
        print(name, rgb.size)

    # Brochure page previews
    bro = fitz.open(BROCHURE)
    for i, p in enumerate(bro):
        pix = p.get_pixmap(dpi=60)
        Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(
            os.path.join(IMG_OUT, f"brochure-p{i + 1}.webp"), "WEBP", quality=78)
    # Brochure page 1 is a spread (back | front) — crop the front cover.
    hi = bro[0].get_pixmap(dpi=90)
    spread = Image.frombytes("RGB", (hi.width, hi.height), hi.samples)
    spread.crop((spread.width // 2, 0, spread.width, spread.height)).save(
        os.path.join(IMG_OUT, "brochure-cover.webp"), "WEBP", quality=80)
    pix = prof[0].get_pixmap(dpi=45)
    Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(
        os.path.join(IMG_OUT, "profile-cover.webp"), "WEBP", quality=78)

    # Publish web-weight PDFs: downsample embedded images (brochure 26 -> ~6 MB,
    # profile 37 -> ~15 MB). Text and vector content are untouched. The profile
    # needs a second, lower-DPI pass (a single pass straight to low DPI misses
    # several images, and very low targets crash MuPDF 1.26).
    for src, name, passes in [(BROCHURE, "Radiance-Brochure.pdf", [150]),
                              (PROFILE, "Adinarayan-Buildcon-Profile.pdf", [150, 110])]:
        dest = os.path.join(DOC_OUT, name)
        current = src
        for dpi in passes:
            doc = fitz.open(current)
            doc.rewrite_images(dpi_threshold=dpi + 10, dpi_target=dpi, quality=75)
            tmp = dest + ".tmp"
            doc.save(tmp, garbage=4, deflate=True)
            doc.close()
            os.replace(tmp, dest)
            current = dest
        print(name, round(os.path.getsize(src) / 1e6, 1), "->", round(os.path.getsize(dest) / 1e6, 1), "MB")

if __name__ == "__main__":
    main()
