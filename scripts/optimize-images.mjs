// Generate responsive AVIF + WebP variants for every supplied render/photo.
// Each source gets a semantic id; outputs land in public/media/img/<id>-<w>.<ext>
// and a JSON manifest (src/data/images.json) records dimensions + widths.
//
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

sharp.cache(false);
const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(ROOT, "..");
const OUT = path.join(ROOT, "public", "media", "img");
const WA = (s) => `WhatsApp_Images/WhatsApp Image 2026-09-23 at ${s}.jpeg`;

const SOURCES = [
  // Architecture: same street view in three lighting states
  { id: "street-day", src: WA("2.05.06 PM (1)"), role: "architecture" },
  { id: "street-evening", src: WA("2.05.06 PM (2)"), role: "architecture" },
  { id: "street-night", src: WA("2.05.06 PM"), role: "architecture" },
  { id: "aerial-day", src: "Original_Renders/SAMANT CAM ARIAL DAY OP 2.jpg.jpeg", role: "architecture" },
  { id: "aerial-night", src: "Original_Renders/SAMANT ARIAL NIGHT  OP02.jpg (2).jpeg", role: "night" },
  { id: "front-night", src: "Original_Renders/SAMANT CAM 02 NIGHT DARK SKY.jpg.jpeg", role: "night" },
  { id: "rear-dusk", src: "Original_Renders/CAM 04 BACK NIGHT 1.jpg.jpeg", role: "architecture" },
  // Amenities
  { id: "pool", src: "Original_Renders/SAMANT SWIMING POOL 02.jpg.jpeg", role: "pool" },
  { id: "pool-deck", src: "Original_Renders/SAMANT SWIMING POOL.jpg.jpeg", role: "pool" },
  { id: "gym", src: WA("2.07.54 PM (4)"), role: "amenity" },
  { id: "indoor-games", src: WA("2.07.55 PM"), role: "amenity" },
  { id: "library", src: WA("2.07.54 PM (1)"), role: "amenity" },
  { id: "party-hall", src: WA("2.07.54 PM (3)"), role: "amenity" },
  { id: "party-hall-2", src: WA("2.07.54 PM (2)"), role: "amenity" },
];

const WIDTHS = [640, 1280, 1920, 2560];

async function run() {
  mkdirSync(OUT, { recursive: true });
  const manifest = {};
  for (const { id, src, role } of SOURCES) {
    const file = path.join(SRC, src);
    const meta = await sharp(file, { limitInputPixels: false }).metadata();
    const widths = WIDTHS.filter((w) => w < meta.width).concat(meta.width < 2560 ? [meta.width] : []);
    const uniq = [...new Set(widths)].sort((a, b) => a - b);
    for (const w of uniq) {
      const base = sharp(file, { limitInputPixels: false }).rotate().resize({ width: w, withoutEnlargement: true });
      const avif = path.join(OUT, `${id}-${w}.avif`);
      const webp = path.join(OUT, `${id}-${w}.webp`);
      if (!existsSync(avif)) await base.clone().avif({ quality: 52, effort: 5 }).toFile(avif);
      if (!existsSync(webp)) await base.clone().webp({ quality: 74 }).toFile(webp);
    }
    // Tiny blurred placeholder, inlined as a data URI
    const lqip = await sharp(file, { limitInputPixels: false }).resize(24).webp({ quality: 40 }).toBuffer();
    manifest[id] = {
      role,
      width: meta.width,
      height: meta.height,
      widths: uniq,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
    };
    console.log(id, `${meta.width}x${meta.height}`, uniq.join(","));
  }
  await logos();
  writeFileSync(path.join(ROOT, "src", "data", "images.json"), JSON.stringify(manifest, null, 2));
}

// Logos: trim the ivory/white canvas, and make a transparent gold-mark variant
// of the RADIANCE logo for dark sections.
async function logos() {
  const dir = path.join(ROOT, "public", "media", "logos");
  mkdirSync(dir, { recursive: true });
  const radiance = path.join(SRC, "WhatsApp_Images", "Radience_logo.jpeg");
  const adinarayan = path.join(SRC, "Logos", "Adinarayan_logo.jpeg");
  await sharp(radiance).trim({ threshold: 18 }).resize({ width: 640 }).webp({ quality: 90 }).toFile(path.join(dir, "radiance.webp"));
  await sharp(adinarayan).trim({ threshold: 18 }).resize({ width: 640 }).webp({ quality: 90 }).toFile(path.join(dir, "adinarayan.webp"));
  // Knock out the near-white background: alpha = distance from background colour.
  const { data, info } = await sharp(radiance).trim({ threshold: 18 }).resize({ width: 800 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const a = Math.max(0, Math.min(255, (245 - lum) * 3));
    data[i + 3] = a;
    // Navy wordmark becomes ivory so it reads on navy backgrounds
    const isGold = data[i] - data[i + 2] > 40;
    if (!isGold && a > 0) data[i] = data[i + 1] = data[i + 2] = 247;
  }
  await sharp(data, { raw: info }).png().toFile(path.join(dir, "radiance-light.png"));
  // Same knockout, original colours — for ivory headers where the JPEG's
  // off-white canvas would otherwise show as a box.
  {
    const { data: d2, info: i2 } = await sharp(radiance).trim({ threshold: 18 }).resize({ width: 800 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < d2.length; i += 4) {
      const lum = (d2[i] + d2[i + 1] + d2[i + 2]) / 3;
      d2[i + 3] = Math.max(0, Math.min(255, (245 - lum) * 3));
    }
    await sharp(d2, { raw: i2 }).webp({ quality: 90 }).toFile(path.join(dir, "radiance-dark.webp"));
  }
  await sharp(path.join(dir, "radiance-light.png")).webp({ quality: 90 }).toFile(path.join(dir, "radiance-light.webp"));
  // Favicon from the gold mark (top portion of the logo)
  const meta = await sharp(radiance).trim({ threshold: 18 }).metadata();
  await sharp(radiance).trim({ threshold: 18 })
    .extract({ left: Math.round(meta.width * 0.3), top: 0, width: Math.round(meta.width * 0.4), height: Math.round(meta.height * 0.5) })
    .resize(256, 256, { fit: "contain", background: "#F7F4EE" }).png().toFile(path.join(ROOT, "public", "favicon.png"));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
