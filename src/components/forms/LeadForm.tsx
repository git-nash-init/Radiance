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
  const [submitError, setSubmitError] = useState<string>("");

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
    } catch (err: unknown) {
      console.error("[LeadForm error]", err);
      setStatus("error");
      const msg = err instanceof Error ? err.message : "";
      setSubmitError(
        msg.includes("403") || msg.includes("Permission") || msg.includes("Anyone")
          ? "Our spreadsheet is currently synchronizing permissions. Please chat with us on WhatsApp or call directly."
          : "We could not send your enquiry right now. Please try again or chat with our team on WhatsApp."
      );
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
      </div>

      {status === "error" && (
        <div
          role="alert"
          className={`rounded-sm border p-4 text-sm leading-relaxed ${
            dark ? "border-amber-500/40 bg-amber-950/20 text-ivory" : "border-amber-200 bg-amber-50 text-[#7a4805]"
          }`}
        >
          <p className="font-semibold">{submitError || "Something went wrong sending your enquiry."}</p>
          <p className="mt-1 text-xs opacity-90">
            Don't worry, your details are not lost. You can connect with our team directly:
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded bg-[#b8893b] px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-[#c99a4c]"
            >
              Retry
            </button>
            <a
              href={`https://wa.me/918689927656?text=${encodeURIComponent(
                `Hello Adinarayan team, I am enquiring about RADIANCE:\nName: ${values.name}\nPhone: ${values.phone}${
                  values.email ? `\nEmail: ${values.email}` : ""
                }${values.interest ? `\nInterest: ${values.interest}` : ""}${
                  values.message ? `\nNote: ${values.message}` : ""
                }`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${project.phone.tel}`}
              className="inline-flex items-center gap-1 text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
            >
              Call {project.phone.display}
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
