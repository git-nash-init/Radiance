import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, m as motion } from "framer-motion";
import { navLinks } from "../../data/navigation";
import { project } from "../../data/project";
import { useLenis, useScrollTo } from "../../hooks/useLenis";

/** Transparent over the hero, ivory glass once scrolled; full-screen menu on mobile. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";
  const solid = scrolled || !onHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    if (onHome) scrollTo(href);
    else navigate("/" + href);
  };

  const linkCls = `link-underline text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors ${
    solid ? "text-navy hover:text-gold" : "text-ivory/90 hover:text-ivory"
  }`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ivory focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,padding] duration-700 ease-[var(--ease-cine)] ${
          solid ? "bg-ivory/85 py-3 shadow-[0_1px_0_rgba(14,22,40,0.08)] backdrop-blur-md" : "py-6"
        }`}
      >
        <nav className="container-x flex items-center justify-between gap-6" aria-label="Primary">
          <Link to="/" onClick={() => onHome && lenis?.scrollTo(0)} className="flex items-center gap-3" aria-label={`${project.name} home`}>
            <img
              src={solid ? "/media/logos/radiance-dark.webp" : "/media/logos/radiance-light.webp"}
              alt=""
              className={`w-auto transition-all duration-700 ${solid ? "h-11" : "h-14"}`}
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                  className={linkCls}
                >
                  {l.label}
                </a>
              </li>
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
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden ${solid ? "text-navy" : "text-ivory"}`}
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
            className="fixed inset-0 z-40 flex flex-col bg-navy px-6 pt-28 pb-10 text-ivory lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {[...navLinks, { label: "Enquire", href: "#enquire" }].map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7 }}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.href);
                    }}
                    className="display block py-2 text-4xl"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto space-y-2 text-sm text-ivory/60">
              <a href={`tel:${project.phone.tel}`} className="block text-lg text-ivory">
                {project.phone.display}
              </a>
              <p>MahaRERA No. {project.rera}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
