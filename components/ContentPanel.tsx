"use client";

import { type MouseEvent, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import { tileById } from "@/lib/tiles";

type Props = {
  panelId: string | null;
  onClose: () => void;
  onNavigatePanel: (panelId: string) => void;
  reducedMotion: boolean;
};

const CASE_STUDY_CARDS = [
  {
    title: "FlowOps Suite",
    summary: "Re-arhitectura fluxurilor operationale pentru o companie de servicii."
  },
  {
    title: "ClientBridge",
    summary: "Portal multi-tenant pentru onboarding si managementul clientilor."
  },
  {
    title: "DataPulse",
    summary: "Pipeline de analytics automatizat cu dashboard-uri aproape in timp real."
  }
];

const PANEL_META: Record<string, { code: string; label: string; status: string }> = {
  about: { code: "01", label: "Overview", status: "Online" },
  services: { code: "02", label: "Services", status: "Ready" },
  solutions: { code: "03", label: "Solutions", status: "Ready" },
  "tech-stack": { code: "04", label: "Tech Stack", status: "Live" },
  portfolio: { code: "05", label: "FAQ / Cases", status: "Loaded" },
  "case-studies": { code: "05", label: "Case Studies", status: "Loaded" },
  contact: { code: "06", label: "Contact", status: "Standby" }
};

const TECH_STACK_ITEMS = ["Next.js", "TypeScript", "Node.js", "Azure", "PostgreSQL", "Docker"];

export default function ContentPanel({
  panelId,
  onClose,
  onNavigatePanel,
  reducedMotion
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const tile = useMemo(() => (panelId ? tileById.get(panelId) : undefined), [panelId]);

  const handlePanelHashNavigation = (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;

    const targetId = href.slice(1);
    const inPortfolioPanel = panelId === "portfolio" || panelId === "case-studies";

    if ((targetId === "contact" || targetId === "contact-form") && panelId !== "contact") {
      event.preventDefault();
      onNavigatePanel("contact");
      return;
    }

    if (targetId === "case-studies" && !inPortfolioPanel) {
      event.preventDefault();
      onNavigatePanel("portfolio");
      return;
    }

    const fallbackTargetId =
      targetId === "contact" && panelId === "contact" ? "contact-form" : targetId;
    const target = panelRef.current?.querySelector<HTMLElement>(`#${fallbackTargetId}`);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!panelId) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", trapFocus);

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "button, [href], input, textarea"
    );
    firstFocusable?.focus();

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", trapFocus);
    };
  }, [panelId, onClose]);

  if (!tile) return <AnimatePresence />;

  const panelMeta = PANEL_META[panelId ?? ""] ?? { code: "00", label: "Panel", status: "Ready" };
  const visibleCtas = tile.content.ctas.filter((cta) => {
    const label = cta.label.toLowerCase();
    if (label.includes("contact")) return false;
    if (panelId === "contact" && label.includes("ofert")) return false;
    if (label.includes("studiu") || label.includes("caz")) return false;
    return true;
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_35%),linear-gradient(to_bottom,rgba(2,6,23,0.56),rgba(2,6,23,0.82),rgba(0,0,0,0.88))] backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        onClick={onClose}
      />

      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        ref={panelRef}
        className="fixed inset-x-2 bottom-2 top-2 z-50 overflow-hidden rounded-[1.1rem] border border-cyan-300/20 bg-slate-950/92 shadow-[0_0_0_1px_rgba(34,211,238,0.07),0_24px_90px_rgba(2,6,23,0.82),0_0_80px_rgba(14,165,233,0.14)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-auto sm:right-8 sm:top-20 sm:max-h-[84vh] sm:w-[min(92vw,620px)] sm:rounded-[1.35rem]"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_8%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_10%_82%,rgba(59,130,246,0.12),transparent_52%)]" />
          <div className="absolute -right-10 top-[-6%] h-52 w-52 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="absolute left-[-18%] top-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.028)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
        </div>

        <div className="relative max-h-[calc(100svh-1rem)] overflow-y-auto p-3 sm:max-h-[84vh] sm:p-5">
          <section className="mb-4 rounded-2xl border border-cyan-300/18 bg-slate-900/55 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_24px_rgba(8,145,178,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-cyan-100">
                    {panelMeta.code}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">
                    {panelMeta.label}
                  </span>
                </div>
                <h2 id="panel-title" className="mt-2 text-xl font-semibold text-slate-50 sm:text-2xl">
                  {tile.content.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{tile.content.intro}</p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/75 text-slate-300 transition hover:border-cyan-300/45 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:h-10 sm:w-10"
                aria-label="Inchide panoul"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-slate-950/70 px-2.5 py-1 text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]" />
                {panelMeta.status}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-slate-200">
                Panel: {tile.id}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-slate-200">
                Face: {tile.face}
              </span>
            </div>
          </section>

          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Highlights</p>
              <span className="text-[11px] text-cyan-200/70">{tile.content.bullets.length} items</span>
            </div>

            <ul className="space-y-2 text-sm text-slate-200">
              {tile.content.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/75 bg-slate-900/55 px-3 py-3 transition duration-300 hover:border-cyan-300/22 hover:bg-slate-900/80"
                >
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                    <span className="absolute right-0 top-0 h-px w-20 bg-gradient-to-r from-transparent to-cyan-300/35" />
                  </span>

                  <span className="relative flex items-start gap-3">
                    <span className="mt-0.5 inline-flex min-w-[2.2rem] justify-center rounded-lg border border-cyan-300/12 bg-slate-950/75 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-cyan-200/85">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="min-w-0 leading-6">{bullet}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {panelId === "case-studies" ? (
            <section id="case-studies" className="mb-4 rounded-2xl border border-cyan-300/15 bg-slate-900/50 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Case Studies</p>
                <span className="text-[11px] text-cyan-200/70">Preview</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {CASE_STUDY_CARDS.map((card, index) => (
                  <article
                    key={card.title}
                    className="group relative overflow-hidden rounded-xl border border-slate-700/75 bg-slate-950/70 p-3 transition hover:border-cyan-300/22"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(34,211,238,0.08),transparent_55%)]" />
                    </span>
                    <div className="relative">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">
                        Case {(index + 1).toString().padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-slate-100">{card.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{card.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {panelId === "tech-stack" ? (
            <section className="mb-4 rounded-2xl border border-cyan-300/15 bg-slate-900/50 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Runtime Matrix</p>
                <span className="text-[11px] text-cyan-200/70">{TECH_STACK_ITEMS.length} nodes</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm text-slate-200 sm:grid-cols-3">
                {TECH_STACK_ITEMS.map((tech, index) => (
                  <div
                    key={tech}
                    className="group relative overflow-hidden rounded-xl border border-slate-700/75 bg-slate-950/70 px-3 py-2.5 transition hover:border-cyan-300/22"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_65%)]" />
                    </span>
                    <div className="relative">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                        {`N${index + 1}`}
                      </p>
                      <p className="mt-1 font-medium text-slate-100">{tech}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {panelId === "contact" ? <ContactForm /> : null}

          <section className="rounded-2xl border border-slate-700/70 bg-slate-900/55 p-3 shadow-inner shadow-cyan-500/5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Quick Actions</p>
                <p className="mt-1 text-xs text-slate-200">
                  Navigare rapida in acelasi ton vizual ca meniul mobil.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2 py-1 text-[10px] font-medium text-cyan-100">
                vNext UI
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {visibleCtas.map((cta) => {
                let ctaClass =
                  "inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70";

                if (cta.label.toLowerCase().includes("ofert")) {
                  ctaClass +=
                    " border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 text-cyan-100 hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18";
                } else {
                  ctaClass +=
                    " border-slate-700/80 bg-slate-950/75 text-slate-200 hover:border-cyan-300/25 hover:text-cyan-100";
                }

                return (
                  <a
                    key={cta.label}
                    href={cta.href}
                    onClick={(event) => handlePanelHashNavigation(cta.href, event)}
                    className={ctaClass}
                  >
                    {cta.label}
                  </a>
                );
              })}

              {panelId !== "contact" ? (
                <a
                  href="#contact"
                  onClick={(event) => handlePanelHashNavigation("#contact", event)}
                  className="inline-flex items-center rounded-xl border border-cyan-300/24 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  Deschide contact
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
