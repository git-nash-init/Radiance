// Transcode the client's master films into web-ready assets.
//
//   hero-*.mp4/webm   6.7s drone orbit from the voice-over film, ping-ponged
//                     into a seamless muted loop (watermark/label cropped out)
//   film-*.mp4        full voice-over film for the "Watch the Film" modal
//   scrub/*.webp      the tower "unveiling" shot from the AI cut, as frames for
//                     the pinned scroll-scrub section
//
// Usage: node scripts/transcode-videos.mjs [hero|film|scrub|all]
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(ROOT, "..", "website", "videos");
const VO = path.join(SRC, "radiance dombivali final with voice over.mp4");
const AI = path.join(SRC, "AI video cut 2.mp4");
const OUT = path.join(ROOT, "public", "videos");
const SCRUB = path.join(ROOT, "public", "media", "scrub");

function ff(args) {
  console.log("ffmpeg", args.join(" "));
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed (${r.status})`);
}

// Orbit shot 2:20.3–2:27.0; crop 80% centre to drop the corner logo + "Radiance" label.
const HERO_IN = ["-ss", "140.3", "-t", "6.7", "-i", VO];
const pingPong = (w) =>
  `[0:v]crop=iw*0.8:ih*0.8,scale=${w}:-2:flags=lanczos,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1,format=yuv420p[v]`;

function hero() {
  mkdirSync(OUT, { recursive: true });
  for (const [w, crf, name] of [[1920, 29, "hero-1920"], [960, 30, "hero-960"]]) {
    ff([...HERO_IN, "-filter_complex", pingPong(w), "-map", "[v]", "-an",
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high",
      "-movflags", "+faststart", path.join(OUT, `${name}.mp4`)]);
  }
  ff([...HERO_IN, "-filter_complex", pingPong(1920), "-map", "[v]", "-an",
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "42", "-row-mt", "1", "-deadline", "good",
    path.join(OUT, "hero-1920.webm")]);
  ff(["-ss", "140.3", "-i", VO, "-frames:v", "1", "-vf", "crop=iw*0.8:ih*0.8,scale=1920:-2",
    "-c:v", "libwebp", "-quality", "80", path.join(OUT, "hero-poster.webp")]);
}

function film() {
  mkdirSync(OUT, { recursive: true });
  // Capped CRF keeps the 4:38 film around 90 MB (1080p) / 55 MB (720p); the
  // drone footage is detail-heavy and balloons past 190 MB at plain CRF 23.
  for (const [h, crf, max, ab, name] of [[1080, 25, "2600k", "128k", "film-1080"], [720, 26, "1500k", "96k", "film-720"]]) {
    ff(["-i", VO, "-vf", `scale=-2:${h}:flags=lanczos`, "-c:v", "libx264", "-preset", "slow",
      "-crf", String(crf), "-maxrate", max, "-bufsize", String(parseInt(max) * 2) + "k",
      "-c:a", "aac", "-b:a", ab, "-movflags", "+faststart", path.join(OUT, `${name}.mp4`)]);
  }
  // End card (RADIANCE logo) and the orbit make good posters.
  ff(["-ss", "143", "-i", VO, "-frames:v", "1", "-vf", "scale=1600:-2", "-c:v", "libwebp",
    "-quality", "80", path.join(OUT, "film-poster.webp")]);
}

// Unveiling: 1.8s–7.8s of the AI cut, content column x=940..2900 at 3840x2160.
function scrub() {
  for (const [w, dir] of [[860, "desktop"], [540, "mobile"]]) {
    const out = path.join(SCRUB, dir);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });
    ff(["-ss", "1.8", "-t", "6", "-i", AI, "-vf", `fps=12,crop=1960:2160:940:0,scale=${w}:-2:flags=lanczos`,
      "-c:v", "libwebp", "-quality", dir === "desktop" ? "62" : "58", path.join(out, "%03d.webp")]);
    console.log(dir, readdirSync(out).length, "frames");
  }
}

const task = process.argv[2] ?? "all";
if (task === "hero" || task === "all") hero();
if (task === "scrub" || task === "all") scrub();
if (task === "film" || task === "all") film();
