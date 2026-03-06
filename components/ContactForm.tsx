"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
  company: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
  company: ""
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Te rugam sa introduci numele.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Te rugam sa introduci un email valid.";
    }
    if (form.message.trim().length < 20) {
      nextErrors.message = "Mesajul trebuie sa aiba cel putin 20 de caractere.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      let data: { ok?: boolean; message?: string } | null = null;
      try {
        data = (await response.json()) as { ok?: boolean; message?: string };
      } catch {
        data = null;
      }

      if (!response.ok || !data?.ok) {
        setStatus(data?.message ?? "Nu am putut trimite mesajul. Incearca din nou.");
        return;
      }

      setForm(initialState);
      setErrors({});
      setStatus("Mesaj trimis. Revenim catre tine cat mai curand.");
    } catch {
      setStatus("Eroare de retea. Verifica conexiunea si incearca din nou.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-300/35 focus-visible:ring-2 focus-visible:ring-cyan-300/60";

  const statusTone = useMemo(() => {
    if (!status) return null;
    const lower = status.toLowerCase();
    if (lower.includes("trimis")) return "success";
    return "error";
  }, [status]);

  return (
    <section
      id="contact-form"
      className="mb-4 overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-900/50"
    >
      <div className="relative p-3 sm:p-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.08),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.018)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40" />
        </div>

        <div className="relative mb-3 rounded-xl border border-cyan-300/12 bg-slate-950/70 px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">
                Contact Channel
              </p>
              <p className="mt-1 text-slate-100">Trimite brief-ul tau si revenim cu pasi concreti.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2.5 py-1 text-[11px] text-cyan-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
              Secure form
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block rounded-xl border border-slate-700/70 bg-slate-900/55 p-3 text-sm">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-slate-400">
                Nume
              </span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className={inputClass}
                placeholder="Nume complet"
                autoComplete="name"
                required
              />
              {errors.name ? <span className="mt-2 block text-xs text-rose-300">{errors.name}</span> : null}
            </label>

            <label className="block rounded-xl border border-slate-700/70 bg-slate-900/55 p-3 text-sm">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-slate-400">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className={inputClass}
                placeholder="nume@companie.ro"
                autoComplete="email"
                required
              />
              {errors.email ? (
                <span className="mt-2 block text-xs text-rose-300">{errors.email}</span>
              ) : null}
            </label>
          </div>

          <label className="hidden" aria-hidden="true">
            Companie
            <input
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <label className="block rounded-xl border border-slate-700/70 bg-slate-900/55 p-3 text-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-400">
                Detalii proiect
              </span>
              <span className="text-[11px] text-slate-500">
                {form.message.trim().length}/20 minim
              </span>
            </div>

            <textarea
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              rows={5}
              className={`${inputClass} min-h-[132px] resize-y`}
              placeholder="Ce vrei sa construiesti, ce problema rezolva, ce termen estimativ ai?"
              required
            />
            {errors.message ? (
              <span className="mt-2 block text-xs text-rose-300">{errors.message}</span>
            ) : null}
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition duration-200 hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading
                    ? "animate-pulse bg-cyan-100 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                    : "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]"
                }`}
                aria-hidden="true"
              />
              {loading ? "Se trimite..." : "Trimite mesajul"}
            </button>

            <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              Raspuns mediu: 1 zi lucratoare
            </div>
          </div>

          {status ? (
            <p
              className={`rounded-xl border px-3 py-2 text-sm ${
                statusTone === "success"
                  ? "border-emerald-400/25 bg-emerald-400/8 text-emerald-100"
                  : "border-rose-400/25 bg-rose-400/8 text-rose-100"
              }`}
            >
              {status}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
