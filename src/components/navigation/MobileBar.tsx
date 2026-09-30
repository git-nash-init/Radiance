import { useEffect, useState } from "react";
import { useBrand } from "../../hooks/useBrand";
import { useScrollTo } from "../../hooks/useLenis";

/** Sticky Call / WhatsApp / Enquire bar on phones, shown after the hero. */
export function MobileBar() {
  const [visible, setVisible] = useState(false);
  const scrollTo = useScrollTo();
  const brand = useBrand();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em]";
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex border-t border-ivory/10 bg-navy/95 pb-[env(safe-area-inset-bottom)] text-ivory backdrop-blur transition-transform duration-700 ease-[var(--ease-cine)] md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a href={`tel:${brand.phone.tel}`} className={item}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
        </svg>
        Call
      </a>
      <a href={`https://wa.me/${brand.phone.whatsapp}?text=${encodeURIComponent(brand.whatsappText)}`} target="_blank" rel="noopener noreferrer" className={`${item} border-x border-ivory/10`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z" />
        </svg>
        WhatsApp
      </a>
      <button type="button" onClick={() => scrollTo("#enquire")} className={`${item} bg-gold`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
        </svg>
        Enquire
      </button>
    </div>
  );
}
