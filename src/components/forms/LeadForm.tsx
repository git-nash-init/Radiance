import { useId, useState, type FormEvent } from "react";
import { submitLead, validateLead, type Lead, type LeadSource } from "../../lib/leads";
import { project } from "../../data/project";

type Props = {
  source: LeadSource;
  /** Compact = name + phone + consent only (brochure gate). */
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
  submitLabel = "Send enquiry",
  onSuccess,
  successTitle = "Thank you.",
  successBody = "Our team will call you shortly to take your RADIANCE enquiry forward.",
  tone = "light",
  interests = DEFAULT_INTERESTS,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<Lead>({ name: "", phone: "", email: "", interest: "", message: "", source, consent: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateLead(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitLead(values);
      setStatus("done");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
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
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-7">
      {/* Honeypot: hidden from people, tempting to bots */}
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
            I agree to be contacted by Adinarayan Buildcon LLP about my enquiry by call, SMS, WhatsApp or email, even if my number is on the DND
            registry. See the{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-gold">
              privacy policy
            </a>
            .
          </span>
        </label>
        <Err k="consent" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-gold min-w-52 disabled:opacity-60" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : submitLabel}
        </button>
        {status === "error" && (
          <p role="alert" className={errCls.replace("mt-2", "")}>
            Something went wrong. Please try again, or call{" "}
            <a className="underline" href={`tel:${project.phone.tel}`}>
              {project.phone.display}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
