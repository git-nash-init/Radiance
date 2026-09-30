import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, m as motion } from "framer-motion";
import type { NavItem } from "../../data/navigation";
import { project } from "../../data/project";
import { useBrand } from "../../hooks/useBrand";
import { useLenis, useScrollTo } from "../../hooks/useLenis";

/** Transparent over the hero, ivory glass once scrolled; full-screen menu on mobile. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const brand = useBrand();
  // Transparent over the hero only on a brand's own landing page.
  const onHome = pathname === brand.path;
  const solid = scrolled || !onHome;

  // Hide the header on scroll-down, bring it back on scroll-up (or near the
  // top), so it never sits over content the visitor is trying to read.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > window.innerHeight * 0.6);
      if (!open) {
        const diff = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (diff > 4) setHidden(true);
        else if (diff < -4) setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      setHidden(false);
    } else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    if (onHome) scrollTo(href);
    else navigate(brand.path + href);
  };

  /** Anchor items glide within the home page; route items are normal links. */
  const renderLink = (l: NavItem, className: string) =>
    l.to ? (
      <Link to={l.to} onClick={() => setOpen(false)} className={className}>
        {l.label}
      </Link>
    ) : (
      <a
        href={l.href}
        onClick={(e) => {
          e.preventDefault();
          go(l.href!);
        }}
        className={className}
      >
        {l.label}
      </a>
    );

  const linkCls = `link-underline text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors ${
    solid ? "text-navy hover:text-gold" : "text-ivory/90 hover:text-ivory"
  }`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ivory focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,padding,transform] duration-500 ease-[var(--ease-cine)] ${
          solid ? "bg-ivory/95 py-3 shadow-[0_1px_0_rgba(14,22,40,0.08)] backdrop-blur-md" : "py-6"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <nav className="container-x flex items-center justify-between gap-6" aria-label="Primary">
          <Link to={brand.path} onClick={() => onHome && lenis?.scrollTo(0)} className="flex items-center gap-3" aria-label={`${brand.name} home`}>
            {/* The company logo is a full-colour mark on white, so it sits on an
                ivory chip that stays legible over the dark hero film. */}
            <img
              src="/media/logos/adinarayan.webp"
              alt=""
              className={`w-auto rounded-[2px] bg-ivory p-1 transition-all duration-700 ${solid ? "h-10" : "h-12"}`}
            />
            {/* The RADIANCE mark appears only on the RADIANCE page. */}
            {brand.key === "radiance" && (
              <>
                <span className={`h-8 w-px transition-colors duration-700 ${solid ? "bg-navy/25" : "bg-ivory/35"}`} aria-hidden="true" />
                <img src={solid ? brand.logoDark : brand.logoLight} alt="" className={`w-auto transition-all duration-700 ${solid ? "h-10" : "h-12"}`} />
              </>
            )}
          </Link>

          <ul className="hidden items-center gap-7 xl:flex">
            {brand.nav.map((l) => (
              <li key={l.href ?? l.to}>{renderLink(l, linkCls)}</li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#enquire"
              onClick={(e) => {
                e.preventDefault();
                go("#enquire");
              }}
              className={`btn hidden !min-h-11 !px-6 sm:inline-flex ${solid ? "btn-gold" : "btn-ghost-light"}`}
            >
              Enquire
            </a>
            <button
              type="button"
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[6px] xl:hidden ${solid ? "text-navy" : "text-ivory"}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`h-px w-6 bg-current transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-6 bg-current transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-navy px-6 pt-28 pb-10 text-ivory xl:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {[...brand.nav, { label: "Enquire", href: "#enquire" }].map((l, i) => (
                <motion.li key={l.href ?? l.to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7 }}>
                  {renderLink(l, "display block py-2 text-4xl")}
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto space-y-2 text-sm text-ivory/60">
              <a href={`tel:${brand.phone.tel}`} className="block text-lg text-ivory">
                {brand.phone.display}
              </a>
              {brand.key === "radiance" ? <p>MahaRERA No. {project.rera}</p> : <p>{brand.email}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
