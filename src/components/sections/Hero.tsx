import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { project, developer } from "../../data/project";
import { videos } from "../../data/media";
import { useOverlays } from "../ui/Overlays";
import { useScrollTo } from "../../hooks/useLenis";
import { useIsMobile, useReducedMotion } from "../../hooks/useMediaQuery";

type Props = {
  /** "adinarayan" = company home page; "radiance" = the project landing page. */
  variant?: "adinarayan" | "radiance";
};

export function Hero({ variant = "radiance" }: Props) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openFilm } = useOverlays();
  const scrollTo = useScrollTo();
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  // Intro choreography + slow push-in and parallax as the hero scrolls away.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      // Media stays visible from the first frame (it is the LCP element); only the camera eases in.
      tl.fromTo(".hero-media", { scale: 1.14 }, { scale: 1.04, duration: 2.8, ease: "expo.out" })
        .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.5)
        .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 0.8)
        .fromTo(".hero-word span", { yPercent: 115 }, { yPercent: 0, duration: 1.6, stagger: 0.06, ease: "expo.out" }, 0.9)
        .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 }, 1.5)
        .fromTo(".hero-cta > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.7)
        .fromTo(".hero-foot > *", { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.1 }, 2);

      gsap.to(".hero-media", {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Pause the loop when the hero is off-screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !root.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(root.current);
    return () => io.disconnect();
  }, [mobile]);

  const company = variant === "adinarayan";
  const word = company ? "ADINARAYAN" : project.name;
  const letters = word.split("");

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy text-ivory" aria-label={`${company ? developer.name : project.name} introduction`}>
      <div className="hero-media absolute inset-0 will-change-transform">
        {reduced ? (
          <img src={videos.hero.poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            key={mobile ? "m" : "d"}
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={videos.hero.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            {mobile ? (
              <source src={videos.hero.mobile} type="video/mp4" />
            ) : (
              <>
                <source src={videos.hero.webm} type="video/webm" />
                <source src={videos.hero.mp4} type="video/mp4" />
              </>
            )}
          </video>
        )}
      </div>
      {/* Legibility: deep navy vignette, stronger at the bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,22,40,0.15),rgba(14,22,40,0.65))]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {company ? (
          <p className="hero-eyebrow eyebrow !text-gold-light [text-shadow:0_1px_14px_rgba(14,22,40,0.95),0_0_3px_rgba(14,22,40,0.6)]">
            Buildcon LLP · Since {developer.since}
          </p>
        ) : (
          /* RADIANCE page: the developer first (logo on an ivory chip so it reads over the film), then the project. */
          <div className="hero-eyebrow flex flex-col items-center gap-4">
            <img src="/media/logos/adinarayan.webp" alt={developer.name} width="640" height="800" className="h-16 w-auto rounded-[2px] bg-ivory p-1.5 md:h-20" />
            <p className="eyebrow !text-gold-light [text-shadow:0_1px_14px_rgba(14,22,40,0.95),0_0_3px_rgba(14,22,40,0.6)]">{developer.name} presents</p>
          </div>
        )}
        <div className="hero-rule gold-rule mt-6 w-40 origin-center" />
        <h1
          aria-label={company ? developer.name : project.name}
          className={`hero-word wordmark mt-8 flex overflow-hidden leading-none text-ivory ${
            company
              ? "text-[clamp(2rem,10.8vw,4.6rem)] !tracking-[0.1em] md:text-[clamp(3rem,7.4vw,8.4rem)] md:!tracking-[0.2em]"
              : "text-[clamp(3rem,11vw,10rem)] !tracking-[0.18em] md:!tracking-[0.24em]"
          }`}
        >
          {letters.map((l, i) => (
            <span key={i} className="inline-block" aria-hidden="true">
              {l}
            </span>
          ))}
        </h1>
        <p className="hero-sub display mt-6 text-[clamp(1.35rem,2.6vw,2.1rem)] text-ivory/90 italic">{company ? developer.motto : project.tagline}</p>
        <div className="hero-cta mt-11 flex flex-col items-center gap-4 sm:flex-row">
          {company ? (
            <Link to="/radiance" className="btn btn-gold">
              Explore RADIANCE
            </Link>
          ) : (
            <Link to="/experience" className="btn btn-gold">
              Explore the Experience
            </Link>
          )}
          <button type="button" className="btn btn-ghost-light" onClick={() => scrollTo("#enquire")}>
            Enquire now
          </button>
        </div>
      </div>

      <div className="hero-foot absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-end justify-between gap-3 pb-8 md:gap-6 text-[0.68rem] font-medium tracking-[0.2em] text-ivory/70 uppercase">
          <p className="hidden sm:block">
            {company ? (
              <>
                Crafting dreams since {developer.since}
                <br />
                Kalyan Dombivli
              </>
            ) : (
              <>
                {project.positioning}
                <br />
                {project.location}
              </>
            )}
          </p>
          <button type="button" onClick={openFilm} className="group flex items-center gap-4 text-ivory">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/40 transition-all duration-700 group-hover:border-gold-light group-hover:bg-gold/20">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
                <path d="M0 0l14 8-14 8z" />
              </svg>
            </span>
            <span className="whitespace-nowrap tracking-[0.2em] md:tracking-[0.28em]">Watch the film</span>
          </button>
          {company ? (
            <Link to="/radiance" className="text-right whitespace-nowrap hover:text-ivory">
              Now launching
              <br />
              <span className="text-ivory">RADIANCE →</span>
            </Link>
          ) : (
            <p className="text-right">
              MahaRERA No.
              <br />
              <span className="text-ivory">{project.rera}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
