"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import ContentPanel from "@/components/ContentPanel";
import { CubeFace, faceOrientations, tileById, tiles } from "@/lib/tiles";
import { useUIStore } from "@/lib/ui-store";

const ThreeCube = dynamic(() => import("@/components/ThreeCube"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden rounded-[1.35rem] border border-cyan-300/16 bg-slate-950/60 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_18px_52px_rgba(2,6,23,0.32)] sm:h-[560px]">
      Se încarcă cubul interactiv...
    </div>
  )
});

const LogoCube = dynamic(() => import("@/components/LogoCube"), {
  ssr: false,
  loading: () => <div className="h-12 w-12 rounded-xl border border-cyan-300/12 bg-slate-900/60 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_8px_20px_rgba(2,6,23,0.28)]" />
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return coarse;
}

function TwoDNavIcon({ tileId }: { tileId: string }) {
  const baseProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (tileId) {
    case "about":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <circle cx="12" cy="12" r="7" {...baseProps} />
          <circle cx="12" cy="12" r="2" {...baseProps} />
          <path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" {...baseProps} />
        </svg>
      );
    case "services":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1.5" {...baseProps} />
          <rect x="13" y="4" width="7" height="7" rx="1.5" {...baseProps} />
          <rect x="4" y="13" width="7" height="7" rx="1.5" {...baseProps} />
          <path d="M16.5 13v7M13 16.5h7" {...baseProps} />
        </svg>
      );
    case "solutions":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <circle cx="6" cy="12" r="2" {...baseProps} />
          <circle cx="18" cy="6" r="2" {...baseProps} />
          <circle cx="18" cy="18" r="2" {...baseProps} />
          <path d="M8 12h4M12 12l4-4M12 12l4 4" {...baseProps} />
        </svg>
      );
    case "tech-stack":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" {...baseProps} />
          <path d="M10 10h4M10 14h4" {...baseProps} />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" {...baseProps} />
        </svg>
      );
    case "portfolio":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" {...baseProps} />
          <path d="M10.6 10a2 2 0 1 1 3.4 1.4c-.8.7-1.4 1.1-1.4 2" {...baseProps} />
          <circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <path d="M4 7.5 12 13l8-5.5" {...baseProps} />
          <rect x="3" y="5" width="18" height="14" rx="2" {...baseProps} />
          <path d="M9 12.5 4 17M20 17l-5-4.5" {...baseProps} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
          <circle cx="12" cy="12" r="7" {...baseProps} />
        </svg>
      );
  }
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();

  const openPanelId = useUIStore((state) => state.openPanelId);
  const setPanel = useUIStore((state) => state.setPanel);
  const twoDMode = useUIStore((state) => state.twoDMode);
  const setTwoDMode = useUIStore((state) => state.setTwoDMode);
  const setTargetOrientation = useUIStore((state) => state.setTargetOrientation);
  const [activeFace, setActiveFace] = useState<CubeFace>("front");
  const [mobileCubeLabel, setMobileCubeLabel] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = [
    { label: "Acasă", panelId: "about", code: "01", hint: "Poziționare & overview" },
    { label: "Servicii", panelId: "services", code: "02", hint: "Ce livrăm concret" },
    { label: "Soluții", panelId: "solutions", code: "03", hint: "Pe industrii & procese" },
    { label: "Tehnologii", panelId: "tech-stack", code: "04", hint: "Stack & infrastructură" },
    { label: "FAQ", panelId: "portfolio", code: "05", hint: "Întrebări frecvente" },
    { label: "Contact", panelId: "contact", code: "06", hint: "Start rapid conversația" }
  ] as const;
  const activeMenuItem = menuItems.find((item) => item.panelId === openPanelId) ?? null;

  const faceDescriptions: Record<CubeFace, string> = {
    front: "Construim sisteme software fiabile.",
    right: "Transformăm cerințe complexe în livrabile clare și rapide.",
    left: "Creăm soluții adaptate domeniului și proceselor tale.",
    back: "Livrăm rezultate măsurabile prin produse digitale scalabile.",
    top: "Combinăm arhitectură solidă cu experiență modernă de utilizare.",
    bottom: "Asigurăm suport, optimizare și evoluție continuă după lansare."
  };

  const lowPerfMode = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    return navigator.hardwareConcurrency <= 4 || memory <= 4;
  }, []);

  useEffect(() => {
    const panel = searchParams.get("panel");
    if (panel && tileById.has(panel)) {
      if (panel === openPanelId) return;
      setPanel(panel);
      return;
    }
    setPanel(null);
  }, [searchParams, openPanelId, setPanel, setTargetOrientation]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null;

      const helpDetailsList = document.querySelectorAll<HTMLDetailsElement>('details[data-help-details="true"]');
      helpDetailsList.forEach((helpDetails) => {
        if (!helpDetails.open) return;
        if (!targetNode || !helpDetails.contains(targetNode)) {
          helpDetails.removeAttribute("open");
        }
      });
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  const openPanel = (panelId: string, options?: { preserveCubeOrientation?: boolean }) => {
    setMobileMenuOpen(false);
    setPanel(panelId);
    const query = new URLSearchParams(searchParams.toString());
    query.set("panel", panelId);
    router.replace(`/?${query.toString()}`, { scroll: false });
    const tile = tileById.get(panelId);
    if (tile && !options?.preserveCubeOrientation) {
      setTargetOrientation(faceOrientations[tile.face]);
    }
  };

  const closePanel = () => {
    setPanel(null);
    const query = new URLSearchParams(searchParams.toString());
    query.delete("panel");
    const nextQuery = query.toString();
    router.replace(nextQuery ? `/?${nextQuery}` : "/", { scroll: false });
  };

  const navigateFromPage = (key: "Acasă" | "Servicii" | "Soluții" | "Tehnologii" | "FAQ" | "Contact") => {
    const menuToAction: Record<string, { panelId: string }> = {
      "Acasă": { panelId: "about" },
      Servicii: { panelId: "services" },
      "Soluții": { panelId: "solutions" },
      Tehnologii: { panelId: "tech-stack" },
      FAQ: { panelId: "portfolio" },
      Contact: { panelId: "contact" }
    };
    const action = menuToAction[key] ?? menuToAction["Acasă"];
    openPanel(action.panelId);
  };

  const navigateFromTile = (panelId: string) => {
    openPanel(panelId, { preserveCubeOrientation: true });
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-hidden overflow-y-auto px-3 pb-3 pt-2 sm:h-[100svh] sm:overflow-hidden sm:px-8 sm:pb-2 sm:pt-2">
      {/* Cube as faded/blurred background in 2D mode only */}
      {twoDMode && !coarsePointer && (
        <div
          className="pointer-events-none select-none absolute inset-0 z-0 flex items-center justify-center transition-all duration-300"
          style={{ opacity: 0.18, filter: 'blur(4px)' }}
        >
          <ThreeCube
            onTileSelect={navigateFromTile}
            reducedMotion={reducedMotion}
            lowPerfMode={lowPerfMode}
            onFaceChange={setActiveFace}
            onHoverLabelChange={setMobileCubeLabel}
          />
        </div>
      )}

      <a href="#hero" className="skip-link">
        Sari peste 3D
      </a>

      <div className="relative mx-auto mb-2 w-full max-w-7xl px-2 py-0 sm:mb-2 sm:px-4">
        <div className="flex items-center justify-between gap-2 sm:-ml-8 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <LogoCube />
            <p className="min-w-0 text-sm font-semibold tracking-wide text-slate-100 sm:ml-0 sm:text-xl">
              <span className="truncate sm:hidden">Technosoft</span>
              <span className="hidden sm:inline">Technosoft Logic Labs</span>
            </p>
          </div>

          <div className="z-20 flex items-center gap-2 sm:absolute sm:right-4 sm:top-1/2 sm:z-30 sm:-translate-y-1/2">
            <span className="hidden rounded-full border border-cyan-300/22 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.14),transparent_60%),rgba(8,47,73,0.35)] px-3 py-1 text-xs font-medium text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_8px_20px_rgba(2,6,23,0.18)] sm:inline-flex">
              Inginerie software pentru afaceri
            </span>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Închide meniul" : "Deschide meniul"}
              aria-expanded={mobileMenuOpen}
              aria-controls="site-sidebar-menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/75 pl-2.5 pr-2 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_28px_rgba(14,165,233,0.14)] backdrop-blur-xl transition duration-300 hover:border-cyan-200/55 hover:text-cyan-50 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_36px_rgba(6,182,212,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:pl-3"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(34,211,238,0.16),transparent_58%),radial-gradient(circle_at_92%_12%,rgba(56,189,248,0.12),transparent_48%)] opacity-90" />
              <span className="pointer-events-none absolute inset-[1px] rounded-[15px] border border-white/5" />
              <span className="relative inline-flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    mobileMenuOpen
                      ? "bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                      : "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]"
                  }`}
                />
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/90 sm:inline">
                  {mobileMenuOpen ? "Close" : "Menu"}
                </span>
              </span>
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/18 bg-slate-900/75 shadow-inner shadow-cyan-500/10">
                <span className="relative flex h-4 w-5 flex-col justify-between">
                  <span
                    className={`block h-0.5 w-5 origin-center rounded bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 origin-center rounded bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "scale-x-0 opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 origin-center rounded bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-center gap-3 text-xs text-slate-400 sm:absolute sm:left-1/2 sm:top-1/2 sm:z-30 sm:flex sm:-translate-x-1/2 sm:-translate-y-1/2">
          <button
            type="button"
            onClick={() => setTwoDMode(!twoDMode)}
            aria-pressed={twoDMode}
            className="rounded-md px-2 py-1 underline-offset-4 transition hover:text-cyan-200 hover:underline"
          >
            {twoDMode ? "Mod 3D" : "Mod 2D"}
          </button>

          <details data-help-details="true" className="group relative">
            <summary className="list-none cursor-pointer rounded-full border border-slate-600 px-2 py-0.5 text-[11px] leading-5 transition hover:border-cyan-300 hover:text-cyan-200 [&::-webkit-details-marker]:hidden">
              ?
            </summary>
            <div className="absolute right-0 top-8 z-30 w-52 rounded-lg border border-slate-700 bg-slate-950/95 p-2 text-[11px] text-slate-300 shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
              <p>Trage pentru rotație.</p>
              <p className="mt-1">Apasă pe cuburile evidențiate.</p>
              {lowPerfMode ? <p className="mt-1 text-cyan-200">Profil low-performance activ.</p> : null}
            </div>
          </details>
        </div>

      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              key="menu-overlay"
              type="button"
              aria-label="Închide meniul"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[68] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_38%),linear-gradient(to_bottom,rgba(2,6,23,0.58),rgba(2,6,23,0.82),rgba(0,0,0,0.88))] backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            />

            <motion.aside
              id="site-sidebar-menu"
              key="menu-sidebar"
              className="fixed inset-y-2 right-2 z-[70] w-[min(94vw,392px)] touch-pan-y overflow-hidden rounded-[1.35rem] border border-cyan-300/20 bg-slate-950/92 shadow-[0_0_0_1px_rgba(34,211,238,0.07),0_24px_90px_rgba(2,6,23,0.82),0_0_80px_rgba(14,165,233,0.14)] backdrop-blur-2xl sm:w-[min(92vw,392px)]"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 34, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 26, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_96%_8%,rgba(34,211,238,0.22),transparent_46%),radial-gradient(circle_at_12%_82%,rgba(59,130,246,0.16),transparent_55%)]" />
                <div className="absolute -right-16 top-[-8%] h-56 w-56 rounded-full bg-cyan-300/14 blur-3xl" />
                <div className="absolute left-[-22%] top-1/3 h-44 w-44 rounded-full bg-sky-500/12 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
              </div>

              <div className="relative flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-3 [-webkit-overflow-scrolling:touch] sm:p-4">
                <div className="mb-4 rounded-2xl border border-cyan-300/18 bg-slate-900/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_24px_rgba(8,145,178,0.08)]">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">Control Deck</p>
                      <h2 className="mt-1 text-base font-semibold text-slate-50">Mobile Navigation</h2>
                      <p className="mt-1 text-xs text-slate-300/80">Sidebar futurist cu acces rapid la paginile principale.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/75 text-slate-300 transition hover:border-cyan-300/45 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                      aria-label="Inchide meniul"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-cyan-300/12 bg-slate-950/70 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">State</p>
                      <p className="mt-1 inline-flex items-center gap-2 font-medium text-slate-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                        Sistem online
                      </p>
                    </div>
                    <div className="rounded-xl border border-cyan-300/12 bg-slate-950/70 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Mode</p>
                      <p className="mt-1 font-medium text-cyan-100">{twoDMode ? "2D overlay" : "3D cube"}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2.5 py-1 text-cyan-100/90">
                      Face: {activeFace}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-slate-200">
                      {lowPerfMode ? "Low perf profile" : "Full motion profile"}
                    </span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTwoDMode(!twoDMode)}
                    className="group relative overflow-hidden rounded-xl border border-cyan-300/22 bg-slate-900/65 px-3 py-2 text-left transition hover:border-cyan-300/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-transparent opacity-80" />
                    <span className="relative block text-[10px] uppercase tracking-[0.2em] text-slate-400">View</span>
                    <span className="relative mt-1 block text-sm font-semibold text-cyan-100">
                      {twoDMode ? "Switch 3D" : "Switch 2D"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPanel("contact")}
                    className="group relative overflow-hidden rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/14 to-sky-400/10 px-3 py-2 text-left transition hover:border-cyan-200/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(103,232,249,0.14),transparent_55%)]" />
                    </span>
                    <span className="relative block text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Action</span>
                    <span className="relative mt-1 block text-sm font-semibold text-cyan-100">Start Contact</span>
                  </button>
                </div>

                <motion.nav
                  className="space-y-2"
                  aria-label="Navigatie mobila"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: {
                      transition: reducedMotion ? undefined : { staggerChildren: 0.05, delayChildren: 0.03 }
                    },
                    closed: {
                      transition: reducedMotion ? undefined : { staggerChildren: 0.03, staggerDirection: -1 }
                    }
                  }}
                >
                  {menuItems.map((item) => {
                    const isActive = openPanelId === item.panelId;
                    return (
                      <motion.button
                        layout
                        key={`menu-sidebar-${item.panelId}`}
                        type="button"
                        onClick={() => openPanel(item.panelId)}
                        className={`group relative w-full overflow-hidden rounded-2xl border px-3 py-3 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${
                          isActive
                            ? "border-cyan-300/42 bg-[linear-gradient(135deg,rgba(34,211,238,0.13),rgba(15,23,42,0.78))] shadow-[0_0_26px_rgba(34,211,238,0.14)]"
                            : "border-slate-700/75 bg-slate-900/55 hover:border-cyan-300/22 hover:bg-slate-900/80"
                        }`}
                        variants={{
                          open: reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 },
                          closed: reducedMotion ? { opacity: 0 } : { opacity: 0, x: 18, scale: 0.99 }
                        }}
                        transition={{ duration: reducedMotion ? 0 : 0.2 }}
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300/75 to-cyan-300/0" />
                          <span className="absolute right-0 top-0 h-px w-24 bg-gradient-to-r from-transparent to-cyan-300/40" />
                        </span>

                        <span className="relative flex items-start gap-3">
                          <span
                            className={`mt-0.5 inline-flex min-w-[2.2rem] justify-center rounded-lg border px-2 py-1 text-[10px] font-semibold tracking-[0.14em] ${
                              isActive
                                ? "border-cyan-300/28 bg-slate-950/70 text-cyan-100"
                                : "border-cyan-300/12 bg-slate-950/75 text-cyan-200/85"
                            }`}
                          >
                            {item.code}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="block text-sm font-semibold text-slate-100">{item.label}</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  isActive
                                    ? "border border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                                    : "border border-slate-700/80 bg-slate-950/70 text-slate-400"
                                }`}
                              >
                                {isActive ? "OPEN" : "GO"}
                              </span>
                            </span>
                            <span className="mt-1 block text-[11px] text-slate-400">{item.hint}</span>

                            <AnimatePresence initial={false}>
                              {isActive ? (
                                <motion.span
                                  key={`menu-item-active-${item.panelId}`}
                                  className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-cyan-300/14 bg-slate-950/65 px-2.5 py-2 text-[11px]"
                                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                  transition={{ duration: reducedMotion ? 0 : 0.16 }}
                                >
                                  <span className="truncate text-cyan-100/95">Sectiune activa in overlay</span>
                                  <span className="text-right text-cyan-200/70">tap</span>
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                          </span>
                          <span className="mt-1 text-cyan-200/65 transition duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-100">
                            ↗
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.nav>

                <div className="mt-4 pt-4 sm:mt-auto">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/55 p-3 shadow-inner shadow-cyan-500/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Quick Launch</p>
                        <p className="mt-1 text-xs text-slate-200">
                          {activeMenuItem ? `Selectat: ${activeMenuItem.label}` : "Selecteaza o destinatie"}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2 py-1 text-[10px] font-medium text-cyan-100">
                        vNext UI
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openPanel("contact")}
                        className="rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                      >
                        Contact
                      </button>
                      <button
                        type="button"
                        onClick={() => openPanel("services")}
                        className="rounded-xl border border-slate-700/80 bg-slate-950/75 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/25 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                      >
                        Oferta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto mt-2 flex w-full max-w-md flex-wrap items-center justify-center gap-2 rounded-2xl border border-cyan-300/12 bg-slate-950/45 px-2.5 py-2 text-xs text-slate-400 shadow-[0_0_0_1px_rgba(34,211,238,0.02),0_8px_20px_rgba(2,6,23,0.18)] sm:hidden">
        {mobileCubeLabel ? (
          <span className="max-w-[58vw] truncate rounded-lg border border-cyan-300/22 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">
            {mobileCubeLabel}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setTwoDMode(!twoDMode)}
          aria-pressed={twoDMode}
          className="rounded-lg border border-slate-700/70 bg-slate-950/65 px-2.5 py-1 text-slate-200 underline-offset-4 transition hover:border-cyan-300/22 hover:text-cyan-100 hover:underline"
        >
          {twoDMode ? "Mod 3D" : "Mod 2D"}
        </button>

        <details data-help-details="true" className="group relative">
          <summary className="list-none cursor-pointer rounded-full border border-slate-700/80 bg-slate-950/70 px-2 py-0.5 text-[11px] leading-5 text-slate-300 transition hover:border-cyan-300/28 hover:text-cyan-100 [&::-webkit-details-marker]:hidden">
            ?
          </summary>
          <div className="absolute right-0 top-8 z-30 w-52 rounded-lg border border-slate-700 bg-slate-950/95 p-2 text-[11px] text-slate-300 shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
            <p>Trage pentru rotație.</p>
            <p className="mt-1">Apasă pe cuburile evidențiate.</p>
            {lowPerfMode ? <p className="mt-1 text-cyan-200">Profil low-performance activ.</p> : null}
          </div>
        </details>
      </div>

      <section
        id="hero"
        className="relative mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col items-center justify-start gap-y-4 pt-2 sm:justify-center sm:pt-0"
      >
        <div className="order-2 z-10 mx-auto mt-0 w-full max-w-6xl sm:-mt-2">
          <div className="relative">
            <div className={`mx-auto w-full max-w-6xl ${openPanelId ? "surface-blur" : ""}`}>
              {twoDMode ? (
                <section className="relative w-full overflow-hidden rounded-[1.35rem] border border-cyan-300/16 bg-slate-950/55 px-2 py-6 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_20px_60px_rgba(2,6,23,0.34)] sm:px-6 sm:py-8">
                  <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(34,211,238,0.1),transparent_48%),linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.015)_1px,transparent_1px)] bg-[size:auto,18px_18px,18px_18px]" />
                  <h2 className="relative mb-6 text-center text-lg font-bold text-cyan-100 sm:text-xl">Navigare rapidă</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                    {tiles.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => openPanel(tile.id)}
                        className="group relative flex min-h-[84px] items-center justify-start gap-3 overflow-hidden rounded-2xl border border-slate-700/75 bg-slate-900/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/26 hover:bg-slate-900/80 hover:shadow-[0_0_24px_rgba(34,211,238,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:justify-center sm:p-6"
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                          <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                          <span className="absolute right-0 top-0 h-px w-20 bg-gradient-to-r from-transparent to-cyan-300/35" />
                        </span>
                        <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/14 bg-slate-950/75 text-cyan-100 shadow-inner shadow-cyan-500/10 sm:h-12 sm:w-12">
                          <TwoDNavIcon tileId={tile.id} />
                        </span>
                        <span className="relative min-w-0 flex-1">
                          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">
                            {tile.id === "portfolio" ? "faq" : tile.id}
                          </span>
                          <span className="block text-sm font-semibold leading-tight text-slate-100 sm:mt-1 sm:text-base">
                            {tile.id === "portfolio" ? "Intrebari frecvente" : tile.label}
                          </span>
                        </span>
                        <span className="relative hidden shrink-0 text-cyan-200/65 transition duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-100 min-[360px]:inline">
                          GO
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <ThreeCube
                  onTileSelect={navigateFromTile}
                  reducedMotion={reducedMotion}
                  lowPerfMode={lowPerfMode}
                  onFaceChange={setActiveFace}
                  onHoverLabelChange={setMobileCubeLabel}
                />
              )}
            </div>
          </div>
        </div>

        <div className="order-4 mt-6 flex w-full flex-wrap justify-center gap-3 sm:mt-10">
          <p className="mx-auto flex basis-full w-full max-w-3xl min-h-[3rem] items-center justify-center rounded-2xl border border-cyan-300/14 bg-slate-950/55 px-3 py-3 text-center text-sm leading-6 text-slate-200 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_10px_28px_rgba(2,6,23,0.22)] sm:px-4 sm:text-lg">
            {faceDescriptions[activeFace]}
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <button
            onClick={() => openPanel("contact")}
            className="hidden rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 to-sky-400/14 px-4 py-2.5 text-sm font-semibold text-cyan-100 shadow-[0_10px_24px_rgba(2,6,23,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/60 hover:from-cyan-300/28 hover:to-sky-300/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:inline-flex"
          >
            Contact
          </button>
          <button
            onClick={() => openPanel("services")}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/75 px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-[0_10px_24px_rgba(2,6,23,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:w-auto"
            >
            Solicită ofertă
          </button>
          </div>
        </div>
      </section>

      {openPanelId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto">
            <ContentPanel
              panelId={openPanelId}
              onClose={closePanel}
              onNavigatePanel={openPanel}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      )}

      <footer className="mx-auto mb-1 mt-1 w-fit rounded-full border border-cyan-300/14 bg-slate-950/60 px-3 py-1.5 text-center text-[11px] leading-tight text-slate-300 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_8px_20px_rgba(2,6,23,0.2)] sm:px-4 sm:text-xs">
        <span className="sm:hidden">© 2026 Technosoft.</span>
        <span className="hidden sm:inline">© 2026 Technosoft Logic Labs. Toate drepturile rezervate.</span>
      </footer>
    </main>
  );
}

export default function ClientHome() {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 w-fit rounded-2xl border border-cyan-300/16 bg-slate-950/60 px-4 py-3 text-sm text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.03),0_12px_28px_rgba(2,6,23,0.22)]">Se încarcă...</div>}>
      <HomeContent />
    </Suspense>
  );
}
