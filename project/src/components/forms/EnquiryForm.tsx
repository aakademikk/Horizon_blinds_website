"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  areaOptions,
  emptyEnquiry,
  enquirySchema,
  productOptions,
  roomOptions,
  timeslots,
  type EnquiryInput,
} from "@/lib/schema";
import { site } from "@/lib/site";

const DRAFT_KEY = "fsb:enquiry-draft";

export default function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [restored, setRestored] = useState(false);
  const reduce = useReducedMotion();
  const liveRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: emptyEnquiry,
    mode: "onBlur",
  });

  /* ---- draft persistence: nobody should retype a form they half-finished --- */

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<EnquiryInput>;
      // Consent is a deliberate act — never restore it from storage.
      reset({ ...emptyEnquiry, ...draft, consent: false as unknown as true });
      if (draft.name || draft.email || draft.phone) setRestored(true);
    } catch {
      // A corrupt draft is not worth surfacing — start clean.
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, [reset]);

  useEffect(() => {
    const sub = watch((values) => {
      try {
        const { consent, company, ...rest } = values;
        void consent;
        void company;
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
      } catch {
        // Storage full or blocked (private browsing). The form still works.
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  async function onSubmit(values: EnquiryInput) {
    setStatus("sending");
    setServerError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        // Map field-level issues from the server back onto the form.
        if (Array.isArray(json.issues)) {
          for (const issue of json.issues) {
            setError(issue.path as keyof EnquiryInput, { message: issue.message });
          }
        }
        setStatus("error");
        setServerError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setReference(json.reference ?? "");
      setStatus("sent");
      window.localStorage.removeItem(DRAFT_KEY);
      reset(emptyEnquiry);
    } catch {
      setStatus("error");
      setServerError(
        `We could not reach the server. Please try again, or call us on ${site.phone}.`,
      );
    }
  }

  function clearDraft() {
    window.localStorage.removeItem(DRAFT_KEY);
    reset(emptyEnquiry);
    setRestored(false);
  }

  /* ------------------------------------------------------------- success */

  if (status === "sent") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        aria-live="polite"
        className="border border-brand/40 bg-brand/[0.05] p-10 text-center md:p-14"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-brand bg-section">
          <Check className="size-7 text-brand-deep" strokeWidth={1.2} />
        </span>
        <h3 className="display-lg mt-8 text-ink">Thank you.</h3>
        <p className="lede mx-auto mt-5 max-w-lg">
          Your enquiry is with us. We will call within one working day to arrange a time that suits
          — evenings and Saturdays included.
        </p>
        {reference && (
          <p className="mt-6 text-[0.8125rem] text-muted">
            Your reference is{" "}
            <span className="text-ink" data-tnum>
              {reference}
            </span>
          </p>
        )}
        <p className="mt-8 text-[0.875rem] text-muted">
          In a hurry?{" "}
          <a href={site.phoneHref} className="link-underline text-ink">
            {site.phone}
          </a>
        </p>
      </motion.div>
    );
  }

  /* ---------------------------------------------------------------- form */

  const busy = status === "sending" || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      {/* Honeypot — visually and semantically hidden, but a bot will fill it. */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <AnimatePresence>
        {restored && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 flex items-center justify-between gap-4 border border-line bg-paper px-5 py-3.5 text-[0.8125rem] text-muted"
          >
            <span>We kept what you had already typed.</span>
            <button
              type="button"
              onClick={clearDraft}
              className="flex shrink-0 items-center gap-1.5 text-ink transition-colors duration-400 hover:text-brand-deep"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.5} />
              Start again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Charlotte Bennett"
            aria-invalid={!!errors.name}
            className="field"
            {...register("name")}
          />
        </Field>

        <Field label="Email address" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.co.uk"
            aria-invalid={!!errors.email}
            className="field"
            {...register("email")}
          />
        </Field>

        <Field label="Telephone" error={errors.phone?.message} required>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="07700 900123"
            aria-invalid={!!errors.phone}
            className="field"
            {...register("phone")}
          />
        </Field>

        <Field label="Postcode" error={errors.postcode?.message} required>
          <input
            id="postcode"
            type="text"
            autoComplete="postal-code"
            placeholder="CM15 9AA"
            aria-invalid={!!errors.postcode}
            className="field uppercase"
            {...register("postcode")}
          />
        </Field>

        <Field label="Nearest area" error={errors.area?.message} required>
          <select id="area" aria-invalid={!!errors.area} className="field" {...register("area")}>
            <option value="">Please choose…</option>
            {areaOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Room" error={errors.room?.message} required>
          <select id="room" aria-invalid={!!errors.room} className="field" {...register("room")}>
            <option value="">Please choose…</option>
            {roomOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Product of interest" error={errors.product?.message} required>
          <select
            id="product"
            aria-invalid={!!errors.product}
            className="field"
            {...register("product")}
          >
            <option value="">Please choose…</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Approximate windows" error={errors.windows?.message} required>
          <input
            id="windows"
            type="number"
            min={1}
            max={80}
            inputMode="numeric"
            aria-invalid={!!errors.windows}
            className="field"
            {...register("windows")}
          />
        </Field>

        {!compact && (
          <Field label="Best time for a survey" error={errors.timeslot?.message} className="sm:col-span-2">
            <select id="timeslot" className="field" {...register("timeslot")}>
              {timeslots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field
          label="Anything else we should know?"
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            rows={compact ? 3 : 4}
            placeholder="Bay window in the front room, and we are not sure whether to do the whole house at once…"
            aria-invalid={!!errors.message}
            className="field resize-none"
            {...register("message")}
          />
        </Field>
      </div>

      {/* ------------------------------------------------------- consent */}
      <div className="mt-9">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3.5">
          <input
            id="consent"
            type="checkbox"
            aria-invalid={!!errors.consent}
            className="mt-1 size-4 shrink-0 accent-[#2F9BD8]"
            {...register("consent")}
          />
          <span className="text-[0.8125rem] leading-relaxed text-muted">
            I am happy for {site.name} to contact me about this enquiry. We never sell or share your
            details, and we will not add you to a mailing list without asking.
          </span>
        </label>
        {errors.consent?.message && (
          <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-[0.75rem] text-[#B4442F]">
            <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.6} />
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* -------------------------------------------------------- actions */}
      <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
        <button type="submit" disabled={busy} className="btn-base btn-ink disabled:opacity-60">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.6} />
              Sending…
            </>
          ) : (
            "Book My Free Home Visit"
          )}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-faint">
          No obligation. No pressure. Usually a call back within one working day.
        </p>
      </div>

      <div ref={liveRef} aria-live="assertive" className="sr-only">
        {status === "error" ? serverError : ""}
      </div>

      <AnimatePresence>
        {status === "error" && serverError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-6 flex items-start gap-2.5 border border-[#E4C3B8] bg-[#FBF1EE] px-5 py-4 text-[0.875rem] text-[#8C3520]"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
            {serverError}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ------------------------------------------------------------------ field */

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactElement<{ id?: string }>;
}) {
  const id = children.props.id;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-[0.6875rem] uppercase tracking-[0.18em] text-faint"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-brand">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[0.75rem] text-[#B4442F]"
        >
          <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.6} />
          {error}
        </p>
      )}
    </div>
  );
}
