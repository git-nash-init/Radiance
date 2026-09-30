// Lead capture → Google Sheet via an Apps Script web app (apps-script/Code.gs).
// Sent as text/plain so the browser skips the CORS preflight Apps Script
// can't answer; Apps Script parses the JSON body itself.

/** Where the lead came from: "company" = Adinarayan home page, "enquiry" = RADIANCE page. */
export type LeadSource = "enquiry" | "company" | "brochure" | "profile" | "experience";

export type Lead = {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
  source: LeadSource;
  consent: boolean;
  website?: string; // honeypot — must stay empty
};

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;

export const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {};
  if (lead.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!PHONE_RE.test(lead.phone.trim())) errors.phone = "Please enter a valid 10-digit Indian mobile number.";
  if (lead.email && !EMAIL_RE.test(lead.email.trim())) errors.email = "Please enter a valid email address.";
  if (!lead.consent) errors.consent = "Please agree to be contacted about RADIANCE.";
  return errors;
}

export async function submitLead(lead: Lead): Promise<void> {
  if (lead.website) return; // bot — pretend success
  const payload = {
    ...lead,
    name: lead.name.trim(),
    phone: lead.phone.replace(/[\s-]/g, ""),
    email: lead.email?.trim() ?? "",
    page: window.location.href,
    userAgent: navigator.userAgent,
    submittedAt: new Date().toISOString(),
  };
  if (!ENDPOINT) {
    console.info("[leads] VITE_LEADS_ENDPOINT not set — lead not sent:", payload);
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
  const data = (await res.json().catch(() => ({ ok: true }))) as { ok?: boolean };
  if (data.ok === false) throw new Error("Lead endpoint rejected the submission");
}
