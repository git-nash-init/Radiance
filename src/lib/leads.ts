import { project } from "../data/project";

/** Where the lead came from: "company" = Adinarayan home page, "enquiry" = RADIANCE page, etc. */
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

const SOURCE_LABELS: Record<LeadSource, string> = {
  enquiry: "RADIANCE Project Enquiry",
  company: "Adinarayan Buildcon General Enquiry",
  brochure: "RADIANCE Brochure Download",
  profile: "Adinarayan Company Profile Download",
  experience: "360° Virtual Tour Call-Back Request",
};

/**
 * Formats lead data into a clean WhatsApp text message.
 */
export function buildWhatsAppMessage(lead: Lead): string {
  const cleanPhone = lead.phone.replace(/[\s-]/g, "");
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91 ${cleanPhone.replace(/^91/, "")}`;
  const sourceLabel = SOURCE_LABELS[lead.source] || "Website Enquiry";

  const lines = [
    `*New Website Lead — Adinarayan Buildcon*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `*Source:* ${sourceLabel}`,
    `*Name:* ${lead.name.trim()}`,
    `*Mobile:* ${formattedPhone}`,
  ];

  if (lead.email?.trim()) {
    lines.push(`*Email:* ${lead.email.trim()}`);
  }

  if (lead.interest?.trim()) {
    lines.push(`*Interested In:* ${lead.interest.trim()}`);
  }

  if (lead.message?.trim()) {
    lines.push(`*Message:* ${lead.message.trim()}`);
  }

  if (typeof window !== "undefined") {
    lines.push(`*Page:* ${window.location.href}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`Please connect with me regarding this enquiry.`);

  return lines.join("\n");
}

/**
 * Returns the click-to-chat WhatsApp link for this lead.
 */
export function getWhatsAppLeadUrl(lead: Lead): string {
  const text = buildWhatsAppMessage(lead);
  return `https://wa.me/${project.phone.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Submits lead directly to WhatsApp:
 * 1. Checks honeypot (bots).
 * 2. Caches lead history in browser localStorage for backup.
 * 3. Opens WhatsApp in a new tab/window with all filled details.
 * 4. Returns the generated WhatsApp URL.
 */
export function submitLead(lead: Lead): string {
  if (lead.website) return ""; // bot honeypot

  const waUrl = getWhatsAppLeadUrl(lead);

  // Backup in local storage
  try {
    const existing = JSON.parse(localStorage.getItem("radiance_leads_history") || "[]");
    existing.push({
      ...lead,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("radiance_leads_history", JSON.stringify(existing.slice(-20)));
  } catch {
    // Ignore storage issues
  }

  // Open WhatsApp in new tab/window
  if (typeof window !== "undefined") {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  return waUrl;
}
