import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { developer, project } from "../data/project";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

function LegalLayout({ eyebrow, title, path, children }: { eyebrow: string; title: string; path: string; children: ReactNode }) {
  useDocumentMeta({ title: `${title} | RADIANCE by ${developer.name}`, path });
  return (
    <article className="bg-ivory pt-36 pb-28 md:pt-44">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-5 text-5xl text-navy md:text-6xl">{title}</h1>
        <div className="gold-rule my-10 w-20" />
        <div className="space-y-6 leading-relaxed text-muted [&_h2]:display [&_h2]:pt-6 [&_h2]:text-3xl [&_h2]:text-navy [&_a]:text-navy [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
        <Link to="/" className="btn btn-ghost-dark mt-16">
          ← Back to RADIANCE
        </Link>
      </div>
    </article>
  );
}

export function Privacy() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" path="/privacy">
      <p>
        This policy explains how {developer.name} ("we", "us") handles personal information collected through this website for the {project.name}{" "}
        project.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you submit in our enquiry or download forms: name, mobile number, and optionally email, area of interest and message.</li>
        <li>Basic technical information sent with the form (page address, browser type and time of submission) to help us prevent spam.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We use your details only to respond to your enquiry about {project.name} — for example to call you, arrange a site visit or share project
        information — by phone, SMS, WhatsApp or email. We do not sell your personal information.
      </p>
      <h2>Where it is stored</h2>
      <p>Enquiries are stored in a secured spreadsheet accessible only to our sales team, and are retained only as long as needed for this purpose.</p>
      <h2>Your choices</h2>
      <p>
        You can ask us to update or delete your information, or stop contacting you, at any time by writing to <a href={`mailto:${project.email}`}>{project.email}</a> or calling{" "}
        <a href={`tel:${project.phone.tel}`}>{project.phone.display}</a>.
      </p>
      <h2>Cookies</h2>
      <p>
        This website does not use advertising or tracking cookies. If you download a document, your browser may remember this so you are not asked to fill
        the form again. Embedded Google Maps, loaded only when you choose to view the map, is subject to Google's own privacy policy.
      </p>
      <h2>Contact</h2>
      <p>
        {developer.name}, {developer.office.lines.join(", ")}.
      </p>
    </LegalLayout>
  );
}

export function Terms() {
  return (
    <LegalLayout eyebrow="Legal" title="Terms & Disclaimer" path="/terms">
      <h2>RERA</h2>
      <p>
        {project.name} is registered under MahaRERA with registration number <strong className="text-navy">{project.rera}</strong>, available on the MahaRERA website
        at{" "}
        <a href={project.reraUrl} target="_blank" rel="noopener noreferrer">
          maharera.maharashtra.gov.in
        </a>
        .
      </p>
      <h2>Disclaimer</h2>
      <p>
        The images, renders, films, virtual tour and walkthrough on this website are artistic impressions for representation only. They may include
        furniture, fittings, landscaping and lifestyle elements that are not part of the standard offering. Actual specifications, amenities, layouts
        and elevations are subject to change as per approvals from the competent authorities.
      </p>
      <p>
        Travel times mentioned are approximate and depend on traffic and route. Nothing on this website constitutes an offer, contract or legal
        commitment. Buyers are advised to verify all details, including the approved plans and the terms of the agreement for sale, before making any
        decision.
      </p>
      <h2>Use of this website</h2>
      <p>
        All content on this website, including logos, images and films, belongs to {developer.name} and may not be reproduced without permission. By
        submitting a form on this website you consent to being contacted about {project.name} as described in our <Link to="/privacy">privacy policy</Link>.
      </p>
    </LegalLayout>
  );
}
