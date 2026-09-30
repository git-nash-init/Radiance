import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, m as motion } from "framer-motion";
import { project, tourFeatures } from "../data/project";
import { tourPreview } from "../data/media";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLenis } from "../hooks/useLenis";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { LeadForm } from "../components/forms/LeadForm";

const TOUR_SRC = "/virtual-tour/index.htm";

/**
 * Full-screen home for the recovered 3DVista tour. The tour (~300 MB of
 * panorama tiles, streamed on demand) mounts only after the visitor opts in.
 */
export default function Experience() {
  const [entered, setEntered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const portrait = useMediaQuery("(max-width: 767px) and (orientation: portrait)");
  const shell = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const navigate = useNavigate();

  useDocumentMeta({
    title: "Virtual Tour — Step inside RADIANCE, Dombivli East",
    description: "Explore RADIANCE in an interactive 360° tour: floor-wise window views from the 1st to the 23rd floor, day, evening and night, and the neighbourhood.",
    path: "/experience",
  });

  // The page is a fixed, full-viewport stage; park smooth scrolling while here.
  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis]);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Back to wherever the visitor came from (home or RADIANCE); a direct visit falls back to the RADIANCE page.
  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window.history.state?.idx === "number" && window.history.state.idx > 0) navigate(-1);
    else navigate("/radiance");
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else shell.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div ref={shell} className="fixed inset-0 z-[60] overflow-hidden bg-navy text-ivory">
      {entered && (
        <iframe
          title="RADIANCE interactive 360° virtual tour"
          src={TOUR_SRC}
          onLoad={() => setTimeout(() => setLoaded(true), 900)}
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
          className={`absolute inset-x-0 top-11 bottom-0 h-[calc(100%-2.75rem)] w-full border-0 transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Intro overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute inset-0 scale-110 bg-cover bg-center blur-[2px]" style={{ backgroundImage: `url(${tourPreview})` }} aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <motion.p className="eyebrow !text-gold-light" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
                Experience {project.name}
              </motion.p>
              <motion.h1
                className="display mt-6 text-[clamp(2.8rem,7vw,6.5rem)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Step inside <em className="text-gold-light">the architecture.</em>
              </motion.h1>
              <motion.ul
                className="mt-10 flex max-w-3xl flex-wrap justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                {tourFeatures.map((f) => (
                  <li key={f.label} className="border border-ivory/20 px-4 py-2 text-xs tracking-[0.14em] text-ivory/80">
                    {f.label}
                  </li>
                ))}
              </motion.ul>
              <motion.button
                type="button"
                onClick={() => setEntered(true)}
                className="btn btn-gold mt-12 !px-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                Enter experience
              </motion.button>
              <motion.p className="mt-6 max-w-sm text-xs text-ivory/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                Best experienced on a large screen or with your phone in landscape. Drag to look around.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader */}
      <AnimatePresence>
        {entered && !loaded && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
            <img src="/media/logos/radiance-light.webp" alt="" className="h-24 w-auto animate-pulse" />
            <div className="h-px w-48 overflow-hidden bg-ivory/15">
              <div className="h-full w-1/3 animate-[loader_1.4s_ease-in-out_infinite] bg-gold-light" />
            </div>
            <p className="text-xs tracking-[0.24em] text-ivory/60 uppercase">Preparing the experience</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chrome: a slim bar above the tour rather than buttons floating over
          it. The 3DVista skin uses every corner for its own controls in one
          view or another (floor picker top-right and its list running down
          the right edge in Window View, category list on Aerial View,
          transport bar at the bottom), so anything overlaid will cover
          something; the iframe starts below this bar instead. */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between gap-2 border-b border-ivory/10 bg-navy px-2 md:px-5">
        <Link
          to="/radiance"
          onClick={goBack}
          aria-label="Back"
          className="flex h-9 min-w-9 items-center justify-center gap-3 px-2 text-[0.7rem] font-semibold tracking-[0.22em] uppercase transition-colors hover:text-gold-light"
        >
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M18 5H2M6 1L2 5l4 4" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </Link>
        <img src="/media/logos/radiance-light.webp" alt="" className="pointer-events-none absolute left-1/2 h-8 w-auto -translate-x-1/2" />
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden h-9 w-9 items-center justify-center transition-colors hover:text-gold-light sm:flex"
            aria-label={isFull ? "Exit full screen" : "Full screen"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              {isFull ? <path d="M6 1v5H1M10 1v5h5M6 15v-5H1M10 15v-5h5" /> : <path d="M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5" />}
            </svg>
          </button>
          <button type="button" onClick={() => setEnquireOpen(true)} className="btn btn-gold !min-h-9 h-9 !px-4 !py-0 lg:!px-6">
            Enquire
          </button>
        </div>
      </div>

      {/* The tour was authored for landscape; nudge portrait phone users. */}
      <AnimatePresence>
        {loaded && portrait && !hintDismissed && (
          <motion.div
            className="absolute inset-x-3 bottom-24 z-10 flex items-center gap-3 bg-navy/90 p-4 text-sm text-ivory backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e2c27a" strokeWidth="1.3" aria-hidden="true">
              <rect x="7" y="2" width="10" height="18" rx="2" />
              <path d="M20 14a8 8 0 01-6 7M17 21l-3 0 1-3" />
            </svg>
            <span className="flex-1">Rotate your phone to landscape for the full view.</span>
            <button type="button" onClick={() => setHintDismissed(true)} className="px-2 py-1 text-xs tracking-[0.2em] text-gold-light uppercase">
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enquireOpen && (
          <motion.aside
            className="absolute inset-y-0 right-0 z-20 w-full max-w-md overflow-y-auto bg-ivory p-8 text-ink shadow-2xl md:p-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Enquire about RADIANCE"
          >
            <EnquirePanel onClose={() => setEnquireOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function EnquirePanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button type="button" onClick={onClose} className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center text-navy hover:text-gold" aria-label="Close enquiry">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
      <p className="eyebrow">Enquire</p>
      <h2 className="display mt-4 mb-8 text-4xl text-navy">Liked the view?</h2>
      <LeadForm source="experience" compact submitLabel="Request a call back" />
    </>
  );
}
