import { useEffect } from "react";

const SITE = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://www.adinarayanbuildconllp.com").replace(/\/$/, "");

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (el) el.setAttribute(attr, value);
}

/** Per-route title, description, canonical and Open Graph URL. */
export function useDocumentMeta({ title, description, path, noindex }: { title: string; description?: string; path: string; noindex?: boolean }) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
    }
    setMeta('link[rel="canonical"]', "href", SITE + path);
    setMeta('meta[property="og:url"]', "content", SITE + path);
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex";
    } else robots?.remove();
  }, [title, description, path, noindex]);
}
