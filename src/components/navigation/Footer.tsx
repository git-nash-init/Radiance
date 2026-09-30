import { Link } from "react-router-dom";
import { developer, project } from "../../data/project";
import { useBrand } from "../../hooks/useBrand";
import { useOverlays } from "../ui/Overlays";

export function Footer() {
  const { openDocument } = useOverlays();
  const brand = useBrand();
  const isRadiance = brand.key === "radiance";

  return (
    <footer className="relative bg-navy pt-24 pb-28 text-ivory/70 md:pb-12">
      <div className="container-x">
        <div className="grid gap-14 border-b border-ivory/10 pb-16 md:grid-cols-12">
          <div className="md:col-span-4">
            {isRadiance ? (
              <img src={brand.logoLight} alt="RADIANCE — Live a premium lifestyle" className="h-24 w-auto" loading="lazy" />
            ) : (
              <img src={brand.logoLight} alt={brand.name} width="640" height="800" className="h-28 w-auto rounded-[2px] bg-ivory p-2" loading="lazy" />
            )}
            <p className="mt-6 max-w-xs text-sm leading-relaxed">{brand.footerBlurb}</p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5 !text-gold-light">{brand.address.label}</p>
            <address className="text-sm leading-relaxed not-italic">
              {brand.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-5 !text-gold-light">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a className="link-underline hover:text-ivory" href={`tel:${brand.phone.tel}`}>
                  {brand.phone.display}
                </a>
              </li>
              <li>
                <a className="link-underline break-all hover:text-ivory" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              </li>
              <li>
                <Link to="/projects" className="link-underline hover:text-ivory">
                  Projects
                </Link>
              </li>
              <li>
                <button type="button" className="link-underline hover:text-ivory" onClick={() => openDocument(brand.document)}>
                  {isRadiance ? "Download brochure" : "Download company profile"}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 md:text-right">
            {isRadiance ? (
              <>
                <p className="eyebrow mb-5 !text-gold-light">Developed by</p>
                <Link to="/" className="inline-block bg-ivory p-3" aria-label={`${developer.name} home`}>
                  <img src="/media/logos/adinarayan.webp" alt={developer.name} width="640" height="800" className="h-20 w-auto" loading="lazy" />
                </Link>
                <p className="mt-4 text-sm">{developer.motto}</p>
              </>
            ) : (
              <>
                <p className="eyebrow mb-5 !text-gold-light">Now launching</p>
                <Link to="/radiance" className="inline-block" aria-label="Explore RADIANCE">
                  <img src="/media/logos/radiance-light.webp" alt="RADIANCE" className="h-20 w-auto" loading="lazy" />
                </Link>
                <p className="mt-4 text-sm">
                  <Link to="/radiance" className="link-underline hover:text-ivory">
                    Explore RADIANCE →
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 pt-8 text-xs leading-relaxed text-ivory/50 md:grid-cols-12">
          <p className="md:col-span-8">
            <strong className="font-semibold text-ivory/80">RADIANCE is registered under MahaRERA No. {project.rera}</strong> · available at{" "}
            <a href={project.reraUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ivory">
              maharera.maharashtra.gov.in
            </a>
            . Images and films are artistic impressions for representation only and do not form part of any offer or contract. Specifications,
            amenities and plans are subject to change as per approvals.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:justify-end">
            <Link to="/privacy" className="hover:text-ivory">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-ivory">
              Terms &amp; Disclaimer
            </Link>
            <span>© {new Date().getFullYear()} {developer.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
