import { useRef } from "react";
import { useReveal } from "../motion/useReveal";
import { Lines } from "../motion/Lines";
import { LeadForm } from "../forms/LeadForm";
import { Picture } from "../ui/Picture";
import { useBrand } from "../../hooks/useBrand";

/** Enquiry block. Contacts, address and copy follow the page: company on home, RADIANCE on /radiance. */
export function Enquire() {
  const ref = useRef<HTMLElement>(null);
  const brand = useBrand();
  const radiance = brand.key === "radiance";
  useReveal(ref);
  const wa = `https://wa.me/${brand.phone.whatsapp}?text=${encodeURIComponent(brand.whatsappText)}`;

  return (
    <section ref={ref} id="enquire" className="relative overflow-hidden bg-ivory">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[46svh] overflow-hidden bg-navy lg:col-span-5 lg:min-h-full">
          <Picture id="aerial-night" alt="" sizes="(min-width: 1024px) 42vw, 100vw" className="absolute inset-0 block" imgClassName="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/20" />
          <div className="relative flex h-full flex-col justify-end p-8 text-ivory md:p-14">
            <p className="eyebrow !text-gold-light">{radiance ? "Visit RADIANCE" : brand.address.label}</p>
            <address className="mt-4 max-w-sm leading-relaxed text-ivory/80 not-italic">{brand.address.oneLine}</address>
            <div className="mt-8 space-y-2">
              <a href={`tel:${brand.phone.tel}`} className="display block text-3xl hover:text-gold-light">
                {brand.phone.display}
              </a>
              <a href={`mailto:${brand.email}`} className="link-underline block text-sm break-all text-ivory/75 hover:text-ivory">
                {brand.email}
              </a>
            </div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light mt-8 self-start">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="px-6 py-20 md:px-14 md:py-28 lg:col-span-7 lg:px-20">
          <p className="eyebrow" data-reveal="fade">
            Enquire
          </p>
          <Lines
            className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-navy"
            lines={
              radiance
                ? ["Let us show you", <em key="e" className="text-gold-deep">RADIANCE.</em>]
                : ["Talk to", <em key="e" className="text-gold-deep">Adinarayan.</em>]
            }
          />
          <p className="mt-6 mb-12 max-w-lg text-muted" data-reveal="up">
            {radiance
              ? "Share a few details and our team will get in touch to arrange a site visit or answer your questions on pricing and availability."
              : "Share a few details and our team will get back to you about our projects, including RADIANCE."}
          </p>
          <div data-reveal="up" data-delay="0.1">
            <LeadForm source={radiance ? "enquiry" : "company"} interests={radiance ? undefined : ["RADIANCE", "Our projects", "General enquiry"]} />
          </div>
        </div>
      </div>
    </section>
  );
}
