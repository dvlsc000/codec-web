"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Turnstile } from "@/components/contact/Turnstile";
import type { Accent } from "@/content/types";
import type { Dictionary } from "@/content/dictionaries/hr";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

type Labels = Dictionary["contact"]["form"];
type Field = "name" | "email" | "message" | "consent";

const ease = [0.16, 1, 0.3, 1] as const;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  labels,
  locale,
  privacyHref,
  fallbackEmail,
  services,
}: {
  labels: Labels;
  locale: string;
  privacyHref: string;
  fallbackEmail: string;
  services: { id: string; title: string; icon: IconName; accent: Accent }[];
}) {
  const uid = useId();
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const openedAt = useRef(0);
  const [token, setToken] = useState("");
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (status === "idle") openedAt.current = Date.now();
  }, [status]);

  // Preselect a service when arriving from a service page (?service=id).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("service");
    if (id && services.some((s) => s.id === id)) setSelected([id]);
  }, [services]);

  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      services: selected,
      locale,
      elapsed: Math.max(0, Date.now() - openedAt.current),
      turnstile: token || undefined,
    };

    const next: Partial<Record<Field, string>> = {};
    if (data.name.length < 2) next.name = labels.errors.name;
    if (!emailRe.test(data.email)) next.email = labels.errors.email;
    if (data.message.length < 10) next.message = labels.errors.message;
    if (!data.consent) next.consent = labels.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      track("contact_submit", { services: selected.join(",") || "none", locale });
      form.reset();
      setSelected([]);
    } catch {
      setStatus("error");
    } finally {
      setToken("");
      setRound((r) => r + 1);
    }
  }

  const fieldCls =
    "peer w-full rounded-[var(--radius-control)] border border-line bg-night/60 px-4 pb-2.5 pt-6 text-fg outline-none transition-[border-color,box-shadow,background] duration-300 hover:border-line-strong focus:border-ember/70 focus:bg-night focus:shadow-[0_0_0_4px_rgb(255_90_31/0.1)] aria-[invalid=true]:border-[#ff7a8a]";
  const floatLabel =
    "pointer-events-none absolute left-4 top-4 origin-left text-muted transition-all duration-300 ease-[var(--ease-out-expo)] peer-focus:top-2 peer-focus:scale-[0.8] peer-focus:text-ember peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-[0.8]";

  const errorText = (f: Field) =>
    errors[f] ? (
      <p id={`${uid}-${f}-err`} className="mt-1.5 text-sm text-[#ff9aa6]">
        {errors[f]}
      </p>
    ) : null;

  const [before, after] = labels.consent.split("{privacy}");

  return (
    <div className="glass relative overflow-hidden rounded-[var(--radius-panel)] p-6 md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
          >
            <m.span
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-ember text-night"
            >
              <Icon name="check" size={30} strokeWidth={2.2} />
            </m.span>
            <h3 className="text-h2 mt-8">{labels.successTitle}</h3>
            <p className="text-lead mt-3">{labels.successText}</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-ember underline-offset-4 hover:underline">
              {labels.sendAnother}
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative">
                <input id={`${uid}-name`} name="name" autoComplete="name" required placeholder=" " className={fieldCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} />
                <label htmlFor={`${uid}-name`} className={floatLabel}>{labels.name}</label>
                {errorText("name")}
              </div>
              <div className="relative">
                <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required placeholder=" " className={fieldCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined} />
                <label htmlFor={`${uid}-email`} className={floatLabel}>{labels.email}</label>
                {errorText("email")}
              </div>
              <div className="relative">
                <input id={`${uid}-company`} name="company" autoComplete="organization" placeholder=" " className={fieldCls} />
                <label htmlFor={`${uid}-company`} className={floatLabel}>
                  {labels.company} <span className="text-subtle">({labels.optional})</span>
                </label>
              </div>
              <div className="relative">
                <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder=" " className={fieldCls} />
                <label htmlFor={`${uid}-phone`} className={floatLabel}>
                  {labels.phone} <span className="text-subtle">({labels.optional})</span>
                </label>
              </div>
            </div>

            <fieldset className="mt-2">
              <legend className="mb-3 text-muted">{labels.interest}</legend>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => {
                  const on = selected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-accent={s.accent}
                      aria-pressed={on}
                      onClick={() => toggle(s.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-fg/80 transition-all duration-300 hover:border-line-strong aria-pressed:border-[var(--accent)] aria-pressed:bg-[rgb(var(--accent-rgb)/0.12)] aria-pressed:text-fg"
                    >
                      <Icon name={on ? "check" : s.icon} size={15} className="text-[var(--accent)]" />
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="relative">
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={5}
                required
                placeholder={labels.messagePlaceholder}
                className={`${fieldCls} resize-y pt-7 placeholder:text-transparent focus:placeholder:text-subtle`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${uid}-message-err` : undefined}
              />
              <label htmlFor={`${uid}-message`} className={floatLabel}>{labels.message}</label>
              {errorText("message")}
            </div>

            {/* Honeypot: hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Turnstile onToken={setToken} language={locale} resetKey={round} />

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                <input
                  name="consent"
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-line-strong bg-night transition-colors checked:border-ember checked:bg-ember checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230a0f24%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m5 12 5 5 9-10%22/></svg>')] bg-center bg-no-repeat"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                />
                <span>
                  {before}
                  <Link href={privacyHref} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-ember">
                    {labels.consentLink}
                  </Link>
                  {after}
                </span>
              </label>
              {errorText("consent")}
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-[var(--radius-control)] border border-[#ff7a8a]/40 bg-[#ff7a8a]/10 px-4 py-3 text-sm text-[#ffc2c9]">
                {labels.errorGeneric.replace("{email}", fallbackEmail)}
              </p>
            )}

            <div className="pt-2">
              <Button type="submit" icon="arrowRight" disabled={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? labels.sending : labels.submit}
              </Button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
