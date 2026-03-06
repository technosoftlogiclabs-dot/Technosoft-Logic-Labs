"use client";

import "./globals.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="ro">
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-12 text-slate-100 sm:px-8">
          <section className="hud-surface w-full p-4 sm:p-5">
            <div className="relative rounded-2xl border border-cyan-300/18 bg-slate-900/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_24px_rgba(8,145,178,0.08)]">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-rose-300/18 bg-rose-300/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-rose-100">
                      GLOBAL ERROR
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Application boundary
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-50">Eroare aplicatie</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    A aparut o eroare la nivel global. Te rugam sa incerci din nou.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Digest</p>
                  <p className="mt-1 break-all text-slate-200">{error.digest ?? "n/a"}</p>
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-slate-700/75 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Message</p>
                <p className="mt-1 break-words text-slate-200">{error.message || "Unknown error"}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={reset}
                  className="inline-flex items-center rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  Reincarca
                </button>
                <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-[11px] text-slate-300">
                  Global fallback activ
                </span>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
