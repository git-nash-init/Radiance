import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m as motion } from "framer-motion";
import { useLenis } from "../../hooks/useLenis";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  variant?: "panel" | "cinema";
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, video[controls]';

/** Accessible dialog: focus trap, Esc to close, scroll lock, restores focus. */
export function Modal({ open, onClose, label, children, variant = "panel" }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      // Skip the close button so the first form field / video gets focus.
      (focusables?.[1] ?? focusables?.[0])?.focus();
    }, 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      previous?.focus?.();
    };
  }, [open, onClose, lenis]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-navy/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            className={
              variant === "cinema"
                ? "relative w-full max-w-6xl pt-14"
                : "relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-ivory shadow-2xl"
            }
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`absolute z-10 flex h-11 w-11 items-center justify-center transition-colors ${
                variant === "cinema" ? "top-0 right-0 text-ivory hover:text-gold-light" : "top-3 right-3 text-navy hover:text-gold"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
