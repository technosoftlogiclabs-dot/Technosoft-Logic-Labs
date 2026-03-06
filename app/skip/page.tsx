import Link from "next/link";
import { tiles } from "@/lib/tiles";

export default function SkipPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-8">
      <section className="hud-surface p-4 sm:p-5">
        <div className="relative">
          <div className="mb-4 rounded-2xl border border-cyan-300/18 bg-slate-900/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_24px_rgba(8,145,178,0.08)]">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-cyan-100">
                    ACCESS MODE
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">
                    Skip 3D
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-slate-50 sm:text-3xl">
                  Technosoft Logic Labs
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  Navigare fara 3D pentru accesibilitate si dispozitive cu performanta redusa.
                  Pastreaza acelasi continut, intr-un flux direct de acces.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs text-slate-200">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">State</p>
                <p className="mt-1 inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
                  Accessibility route online
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2.5 py-1 text-cyan-100">
                {tiles.length} panouri disponibile
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-slate-200">
                Fast navigation mode
              </span>
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile, index) => (
              <Link
                key={tile.id}
                href={`/?panel=${tile.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/75 bg-slate-900/55 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-slate-900/78 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                  <span className="absolute right-0 top-0 h-px w-20 bg-gradient-to-r from-transparent to-cyan-300/35" />
                </span>

                <div className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/14 bg-slate-950/75 text-xl text-cyan-100 shadow-inner shadow-cyan-500/10">
                      {tile.icon}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{tile.id}</p>
                  <p className="mt-1 text-base font-semibold text-slate-100">{tile.label}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300">
                    {tile.content.intro}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-cyan-200/70">Face: {tile.face}</span>
                    <span className="text-cyan-100 transition duration-300 group-hover:translate-x-0.5">
                      Open ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/55 p-3 shadow-inner shadow-cyan-500/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Return Path</p>
                <p className="mt-1 text-xs text-slate-200">
                  Revino la experienta principala cu cubul interactiv.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                Inapoi la pagina principala
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
