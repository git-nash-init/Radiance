import { useCallback, useEffect, useRef, useState } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { Picture } from "../ui/Picture";
import { Modal } from "../ui/Modal";
import { fallbackSrc, image, type ImageId } from "../../data/media";

type GalleryItem = {
  id?: ImageId;
  src?: string;
  caption: string;
  tag?: string;
  span: string;
  width?: number;
  height?: number;
};

const ITEMS: GalleryItem[] = [
  { id: "aerial-day", caption: "Aerial view — day", tag: "3D Render", span: "md:col-span-8 md:row-span-2" },
  { id: "front-night", caption: "Front elevation — night", tag: "3D Render", span: "md:col-span-4 md:row-span-2" },
  {
    src: "/media/site/site-blueprint-review.webp",
    caption: "On-Site Execution — Engineering Blueprint Review",
    tag: "Live Site",
    span: "md:col-span-6 md:row-span-2",
    width: 1280,
    height: 960,
  },
  {
    src: "/media/site/site-team-ground.webp",
    caption: "Ground Reality — Civil Engineering & Construction Crew",
    tag: "Live Site",
    span: "md:col-span-6 md:row-span-2",
    width: 1280,
    height: 960,
  },
  { id: "pool-deck", caption: "Rooftop swimming pool", tag: "3D Render", span: "md:col-span-5" },
  { id: "rear-dusk", caption: "Rear elevation — dusk", tag: "3D Render", span: "md:col-span-3 md:row-span-2" },
  { id: "gym", caption: "Fitness zone", tag: "3D Render", span: "md:col-span-4" },
  { id: "aerial-night", caption: "Aerial view — night", tag: "3D Render", span: "md:col-span-5" },
  { id: "indoor-games", caption: "Indoor games", tag: "3D Render", span: "md:col-span-4" },
  { id: "pool", caption: "Covered poolside deck", tag: "3D Render", span: "md:col-span-4" },
  { id: "library", caption: "Reading space", tag: "3D Render", span: "md:col-span-4" },
  { id: "party-hall", caption: "Party hall", tag: "3D Render", span: "md:col-span-4" },
];

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  useReveal(ref);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + ITEMS.length) % ITEMS.length)), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index !== null ? ITEMS[index] : null;

  return (
    <section ref={ref} id="gallery" className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow" data-reveal="fade">
              Gallery
            </p>
            <Lines className="display mt-6 text-[clamp(2.6rem,5.4vw,5rem)] text-navy" lines={["A closer", <em key="e" className="text-gold-deep">look.</em>]} />
          </div>
          <p className="max-w-md text-sm text-muted" data-reveal="up">
            Select any image to view it full screen. Features both 3D architectural impressions and genuine on-site engineering &amp; construction execution photography.
          </p>
        </div>

        <ul className="mt-16 grid auto-rows-[46vw] grid-cols-2 gap-3 md:auto-rows-[19vw] md:grid-cols-12 md:gap-4 xl:auto-rows-[16rem]">
          {ITEMS.map((item, i) => (
            <li key={item.id ?? item.src} className={`${item.span} ${i === 0 ? "col-span-2" : ""}`} data-reveal="up" data-delay={(i % 3) * 0.06}>
              <button type="button" onClick={() => setIndex(i)} className="group relative block h-full w-full overflow-hidden bg-sand" aria-label={`Open ${item.caption}`}>
                {item.id ? (
                  <Picture
                    id={item.id}
                    alt={item.caption}
                    sizes="(min-width: 768px) 40vw, 50vw"
                    className="block h-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cine)] group-hover:scale-[1.05]"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.caption}
                    width={item.width || 1280}
                    height={item.height || 960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cine)] group-hover:scale-[1.05]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
                {item.tag && (
                  <span className="absolute top-3 right-3 bg-navy/85 px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.2em] text-gold-light uppercase backdrop-blur-xs">
                    {item.tag}
                  </span>
                )}
                <span className="absolute bottom-4 left-4 right-4 translate-y-2 text-left text-xs tracking-[0.2em] text-ivory uppercase opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={!!current} onClose={close} label={current ? current.caption : "Image"} variant="cinema">
        {current && (
          <figure>
            <img
              key={current.id ?? current.src}
              src={current.src || (current.id ? fallbackSrc(current.id, 2560) : "")}
              alt={current.caption}
              width={current.width || (current.id ? image(current.id).width : 1280)}
              height={current.height || (current.id ? image(current.id).height : 960)}
              className="mx-auto max-h-[78svh] w-auto object-contain"
            />
            <figcaption className="mt-5 flex items-center justify-between gap-4 text-ivory">
              <span className="text-xs tracking-[0.22em] uppercase">
                {current.caption} <span className="text-ivory/40">· {index! + 1} / {ITEMS.length}</span>
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="flex h-11 w-11 items-center justify-center border border-ivory/25 hover:border-gold-light" aria-label="Previous image">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} className="flex h-11 w-11 items-center justify-center border border-ivory/25 hover:border-gold-light" aria-label="Next image">
                  →
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </Modal>
    </section>
  );
}
