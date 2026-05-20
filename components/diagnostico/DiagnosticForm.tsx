"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DiagnosticLoading from "@/components/diagnostico/DiagnosticLoading";
import DiagnosticResults from "@/components/diagnostico/DiagnosticResults";
import type { DiagnosticResult } from "@/lib/diagnostico/types";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  copy: Dictionary["diagnosticPage"];
  contactHref: string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function DiagnosticForm({ locale, copy, contactHref }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const buttonLabel = useMemo(
    () => (status === "loading" ? copy.form.submitting : copy.form.submit),
    [copy.form.submit, copy.form.submitting, status]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      url: String(formData.get("url") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      businessType: String(formData.get("businessType") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      privacyConsent: formData.get("privacyConsent") === "on",
      locale,
    };

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "analysis_unavailable");
      }

      setResult(data as DiagnosticResult);
      setStatus("success");
    } catch (err) {
      const code = err instanceof Error ? err.message : "analysis_unavailable";
      const errors = copy.form.errors as Record<string, string>;
      setError(errors[code] ?? copy.form.errors.analysis_unavailable);
      setStatus("error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={onSubmit}
        className="relative rounded-xl border border-line bg-ash p-6 md:p-8 lg:col-span-5"
      >
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="diagnostic-website">Website</label>
          <input
            id="diagnostic-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <Field
          id="url"
          label={copy.form.fields.url}
          placeholder={copy.form.fields.urlPlaceholder}
          inputMode="url"
          required
        />
        <Field
          id="name"
          label={copy.form.fields.name}
          placeholder={copy.form.fields.namePlaceholder}
          autoComplete="name"
        />
        <Field
          id="email"
          label={copy.form.fields.email}
          type="email"
          placeholder={copy.form.fields.emailPlaceholder}
          autoComplete="email"
          required
        />
        <Field
          id="businessType"
          label={copy.form.fields.businessType}
          placeholder={copy.form.fields.businessTypePlaceholder}
        />

        <label className="mb-6 flex items-start gap-3 text-sm leading-relaxed text-smoke">
          <input
            name="privacyConsent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 accent-flame"
          />
          <span>{copy.form.consent}</span>
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 w-full rounded-full bg-flame py-4 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:opacity-60"
        >
          {buttonLabel}
        </button>

        {error && (
          <p role="alert" className="mt-4 text-sm leading-relaxed text-red-400">
            {error}
          </p>
        )}

        <p className="mt-5 text-xs leading-relaxed text-smoke">
          {copy.form.privacyNote}
        </p>
      </motion.form>

      <div className="lg:col-span-7">
        {status === "loading" && <DiagnosticLoading copy={copy.loading} />}
        {result && (
          <DiagnosticResults
            result={result}
            copy={copy.results}
            contactHref={contactHref}
          />
        )}
        {status === "idle" && (
          <div className="rounded-xl border border-line bg-ash p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-flame">
              {copy.form.idleEyebrow}
            </p>
            <p className="mt-4 max-w-xl text-lg text-paper/74">
              {copy.form.idleDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "url";
  autoComplete?: string;
}) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-xs uppercase tracking-widest text-smoke"
      >
        {label}
        {required ? <span className="text-flame"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full border-b border-line bg-transparent py-3 text-base text-paper placeholder:text-smoke/60 focus:border-flame focus:outline-none"
      />
    </div>
  );
}
