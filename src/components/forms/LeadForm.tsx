import { useId, useState, type FormEvent } from "react";
import { submitLead, validateLead, type Lead, type LeadSource } from "../../lib/leads";

type Props = {
  source: LeadSource;
  /** Compact = name + phone + consent only (brochure / profile download gate). */
  compact?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
  successTitle?: string;
  successBody?: string;
  tone?: "light" | "dark";
  /** Options for the "Interested in" select. */
  interests?: string[];
};

const DEFAULT_INTERESTS = ["Site visit", "Pricing & availability", "Brochure", "General enquiry"];

type Errors = Partial<Record<keyof Lead, string>>;

export function LeadForm({
  source,
  compact,
  submitLabel = "Send enquiry via WhatsApp",
  onSuccess,
  successTitle = "Thank you.",
  successBody = "We have opened WhatsApp to connect you directly with our sales team (+91 86899 27656).",
  tone = "light",
  interests = DEFAULT_INTERESTS,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<Lead>({ name: "", phone: "", email: "", interest: "", message: "", source, consent: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateLead(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    // Submit lead directly to WhatsApp with all filled form details
    const url = submitLead(values);
    setWhatsappUrl(url);
    setStatus("done");
    onSuccess?.();
  }

  const dark = tone === "dark";
  const labelCls = `block text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${dark ? "text-ivory/60" : "text-muted"}`;
  const fieldCls = `field ${dark ? "!text-ivory !border-ivory/25 focus:!border-gold-light" : ""}`;
  const errCls = `mt-2 text-sm ${dark ? "text-[#ffb4a9]" : "text-[#b3261e]"}`;

  const describe = (k: keyof Lead) => (errors[k] ? `${uid}-${k}-err` : undefined);
  const Err = ({ k }: { k: keyof Lead }) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className={errCls}>
        {errors[k]}
      </p>
    ) : null;

  if (status === "done") {
    return (
      <div role="status" aria-live="polite" className="py-6">
        <div className="gold-rule mb-8 w-16" />
        <p className={`display text-4xl ${dark ? "text-ivory" : "text-navy"}`}>{successTitle}</p>
        <p className={`mt-4 max-w-md ${dark ? "text-ivory/70" : "text-muted"}`}>{successBody}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold inline-flex items-center gap-2.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z" />
              </svg>
              Open WhatsApp Chat Again
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setValues({ name: "", phone: "", email: "", interest: "", message: "", source, consent: false, website: "" });
            }}
            className={`text-xs underline underline-offset-4 ${dark ? "text-ivory/60 hover:text-ivory" : "text-muted hover:text-navy"}`}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-7">
      {/* Honeypot: hidden from people, catches bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className={`grid gap-7 ${compact ? "" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor={`${uid}-name`} className={labelCls}>
            Full name *
          </label>
          <input
            id={`${uid}-name`}
            className={fieldCls}
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
          />
          <Err k="name" />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelCls}>
            Mobile number *
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldCls}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98XXX XXXXX"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={describe("phone")}
          />
          <Err k="phone" />
        </div>
      </div>

      {!compact && (
        <>
          <div className="grid gap-7 md:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-email`} className={labelCls}>
                Email
              </label>
              <input
                id={`${uid}-email`}
                className={fieldCls}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={describe("email")}
              />
              <Err k="email" />
            </div>
            <div>
              <label htmlFor={`${uid}-interest`} className={labelCls}>
                Interested in
              </label>
              <select id={`${uid}-interest`} className={fieldCls} value={values.interest} onChange={(e) => set("interest", e.target.value)}>
                <option value="">Select</option>
                {interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-message`} className={labelCls}>
              Message (optional)
            </label>
            <textarea id={`${uid}-message`} rows={3} className={`${fieldCls} resize-none`} value={values.message} onChange={(e) => set("message", e.target.value)} />
          </div>
        </>
      )}

      <div>
        <label className={`flex cursor-pointer items-start gap-3 text-sm leading-relaxed ${dark ? "text-ivory/70" : "text-muted"}`}>
          <input
            id={`${uid}-consent`}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[#b8893b]"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describe("consent")}
          />
          <span>
            I agree to be contacted by Adinarayan Buildcon LLP about my enquiry via WhatsApp, call, or email. See our{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-gold">
              privacy policy
            </a>
            .
          </span>
        </label>
        <Err k="consent" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-gold min-w-56 inline-flex items-center justify-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z" />
          </svg>
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
