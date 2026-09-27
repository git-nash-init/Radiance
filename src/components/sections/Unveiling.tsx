import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { scrub } from "../../data/media";
import { useIsMobile, useReducedMotion } from "../../hooks/useMediaQuery";

const CAPTIONS = [
  { eyebrow: "Chapter I", title: "Every landmark begins", em: "as a promise." },
  { eyebrow: "Chapter II", title: "Drawn back in gold,", em: "revealed in full." },
  { eyebrow: "Chapter III", title: "RADIANCE rises over", em: "Dombivli East." },
];

/**
 * Pinned scroll-scrub through frames of the tower unveiling, taken from the
 * client's own film — a real camera move rather than invented 3D geometry.
 */
export function Unveiling() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  const draw = (index: number) => {
    const c = canvas.current;
    // Walk back to the nearest loaded frame so fast scrolling never shows blank.
    let i = index;
    while (i > 0 && !frames.current[i]?.complete) i--;
    const img = frames.current[i];
    if (!c || !img?.complete || !img.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, c.width, c.height);
  };

  // Load frames progressively once the section is near the viewport.
  useEffect(() => {
    if (reduced || !section.current) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const list: HTMLImageElement[] = [];
        for (let i = 0; i < scrub.count; i++) {
          const img = new Image();
          img.decoding = "async";
          img.src = scrub.frame(i, mobile);
          if (i === 0) img.onload = () => !cancelled && (setReady(true), draw(current.current));
          else img.onload = () => !cancelled && i === current.current && draw(i);
          list.push(img);
        }
        frames.current = list;
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(section.current);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [mobile, reduced]);

  useLayoutEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const state = { f: 0 };
      gsap.to(state, {
        f: scrub.count - 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: () => {
            const i = Math.round(state.f);
            if (i !== current.current) {
              current.current = i;
              draw(i);
            }
          },
        },
      });
      const caps = gsap.utils.toArray<HTMLElement>(".unveil-cap");
      caps.forEach((cap, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: `${i * 30 + 2}% top`, end: `${i * 30 + 32}% top`, scrub: true },
        });
        tl.fromTo(cap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 });
        if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -30, ease: "power2.in", duration: 0.3 }, 0.7);
      });
      gsap.fromTo(".unveil-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  if (reduced) {
    return (
      <section className="bg-navy py-24 text-ivory">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <img src={scrub.frame(scrub.count - 1, mobile)} alt="The RADIANCE tower, unveiled" className="mx-auto max-h-[80vh] w-auto" loading="lazy" />
          <div>
            <p className="eyebrow !text-gold-light">The unveiling</p>
            <p className="display mt-4 text-5xl">
              RADIANCE rises over <em className="text-gold-light">Dombivli East.</em>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[340vh] bg-navy text-ivory" aria-label="The unveiling of RADIANCE">
      <div className="grain sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(184,137,59,0.18),transparent_60%)]" />
        <div className="container-x relative grid h-full items-center gap-6 md:grid-cols-12">
          <div className="relative z-10 order-2 h-40 md:order-1 md:col-span-5 md:h-auto">
            {CAPTIONS.map((c) => (
              <div key={c.eyebrow} className="unveil-cap absolute inset-x-0 top-0 opacity-0 md:top-1/2 md:-translate-y-1/2">
                <p className="eyebrow !text-gold-light">{c.eyebrow}</p>
                <p className="display mt-4 text-[clamp(2.2rem,4.4vw,4.2rem)]">
                  {c.title}
                  <br />
                  <em className="text-gold-light">{c.em}</em>
                </p>
              </div>
            ))}
          </div>
          <div className="relative order-1 flex h-[62svh] items-center justify-center md:order-2 md:col-span-6 md:col-start-7 md:h-[80svh]">
            <canvas
              ref={canvas}
              width={mobile ? 540 : 860}
              height={Math.round((mobile ? 540 : 860) / scrub.aspect)}
              className={`h-full w-auto max-w-full object-contain transition-opacity duration-1000 [mask-image:radial-gradient(ellipse_58%_62%_at_50%_50%,#000_62%,transparent_100%)] ${ready ? "opacity-100" : "opacity-0"}`}
              role="img"
              aria-label="The RADIANCE tower being unveiled from beneath a gold drape"
            />
          </div>
        </div>
        <div className="absolute top-1/2 right-5 hidden h-40 w-px -translate-y-1/2 bg-ivory/15 md:block">
          <div className="unveil-progress h-full w-full origin-top bg-gold-light" />
        </div>
      </div>
    </section>
  );
}
