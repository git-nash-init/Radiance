import { useState, useEffect } from "react";
import { useBrand } from "../../hooks/useBrand";

/**
 * High-converting floating WhatsApp button for direct lead contact (+91 86899 27656).
 * Fixed at the bottom corner with pulse animation, hover tooltip, and mobile awareness.
 */
export function FloatingWhatsApp() {
  const brand = useBrand();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const waUrl = `https://wa.me/${brand.phone.whatsapp}?text=${encodeURIComponent(brand.whatsappText)}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-20 right-4 z-40 md:bottom-7 md:right-7 print:hidden"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat directly on WhatsApp at ${brand.phone.display}`}
        className="group relative flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#20ba5a] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle Pulse Ring */}
        <span
          className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/35 opacity-75 duration-1000"
          aria-hidden="true"
        />

        {/* WhatsApp Official Icon */}
        <svg
          className="h-7 w-7 fill-white transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z" />
        </svg>

        {/* Text Pill shown on desktop and expandable */}
        <span className="hidden pr-2 text-xs font-bold tracking-wider uppercase sm:inline-block">
          Chat on WhatsApp
        </span>

        {/* Online Status Dot */}
        <span
          className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-400"
          title="Online — Direct Response"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </a>
    </aside>
  );
}
