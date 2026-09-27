import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { LeadForm } from "../forms/LeadForm";
import { documents, type DocumentKey } from "../../data/project";
import { videos } from "../../data/media";

type Overlays = {
  openDocument: (key: DocumentKey) => void;
  openFilm: () => void;
};

const Ctx = createContext<Overlays>({ openDocument: () => {}, openFilm: () => {} });
export const useOverlays = () => useContext(Ctx);

const UNLOCK_KEY = "radiance:docs-unlocked";

function isUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function download(key: DocumentKey) {
  const doc = documents[key];
  const a = document.createElement("a");
  a.href = doc.file;
  a.download = doc.file.split("/").pop() ?? "document.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [docKey, setDocKey] = useState<DocumentKey | null>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Brochure downloads are gated behind a short lead form; once someone has
  // submitted it on this device, later downloads start straight away.
  const openDocument = useCallback((key: DocumentKey) => {
    if (isUnlocked()) download(key);
    else setDocKey(key);
  }, []);
  const openFilm = useCallback(() => setFilmOpen(true), []);
  const closeDoc = useCallback(() => setDocKey(null), []);
  const closeFilm = useCallback(() => setFilmOpen(false), []);

  const doc = docKey ? documents[docKey] : null;

  return (
    <Ctx.Provider value={{ openDocument, openFilm }}>
      {children}

      <Modal open={!!doc} onClose={closeDoc} label={doc ? `Download the ${doc.title}` : "Download"}>
        {doc && docKey && (
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative hidden min-h-full bg-navy md:block">
              <img src={doc.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
              <div className="absolute right-8 bottom-8 left-8 text-ivory">
                <p className="eyebrow !text-gold-light">PDF · {doc.size}</p>
                <p className="display mt-3 text-3xl">{doc.title}</p>
              </div>
            </div>
            <div className="p-7 md:p-12">
              <p className="eyebrow">Download</p>
              <h2 className="display mt-4 text-4xl text-navy md:text-5xl">{doc.title}</h2>
              <p className="mt-4 mb-8 text-muted">Share your details and the download will begin immediately. Our team may call to help with your enquiry.</p>
              <LeadForm
                compact
                source={docKey === "brochure" ? "brochure" : "profile"}
                submitLabel="Download PDF"
                successTitle="Your download has started."
                successBody="If it didn't begin, use the link below. Thank you for your interest in RADIANCE."
                onSuccess={() => {
                  try {
                    localStorage.setItem(UNLOCK_KEY, "1");
                  } catch {
                    /* storage unavailable — gate again next time */
                  }
                  setUnlocked(true);
                  download(docKey);
                }}
              />
              <a href={doc.file} download className="mt-2 inline-block text-sm text-muted underline underline-offset-4 hover:text-gold" hidden={!unlocked}>
                Download again
              </a>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={filmOpen} onClose={closeFilm} label="RADIANCE film" variant="cinema">
        <video className="aspect-video w-full bg-black" controls autoPlay playsInline poster={videos.film.poster} preload="metadata">
          <source src={videos.film.sd} type="video/mp4" media="(max-width: 900px)" />
          <source src={videos.film.hd} type="video/mp4" />
        </video>
      </Modal>
    </Ctx.Provider>
  );
}
