"use client";

import { navToTileId, tileById, faceOrientations } from "@/lib/tiles";
import { useUIStore } from "@/lib/ui-store";

type Props = {
  onNavigate: (panelId: string) => void;
};

const links = ["Acasa", "Servicii", "Contact"] as const;

export default function Navbar({ onNavigate }: Props) {
  const setTargetOrientation = useUIStore((state) => state.setTargetOrientation);

  const navigate = (key: string) => {
    const keyMap: Record<string, string> = {
      Acasa: "home",
      Servicii: "services",
      Contact: "contact"
    };
    const panelId = navToTileId[keyMap[key] ?? "home"] ?? "about";
    const tile = tileById.get(panelId);
    if (tile) {
      setTargetOrientation(faceOrientations[tile.face]);
      onNavigate(panelId);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 py-3 sm:px-8">
      <div className="glass mx-auto flex w-full max-w-7xl items-center justify-between rounded-xl px-4 py-3">
        <button
          onClick={() => navigate("home")}
          className="text-sm font-semibold tracking-wide text-slate-100 transition hover:text-cyan-300"
        >
          TLL - Technosoft Logic Labs
        </button>

        <nav aria-label="Principal" className="flex items-center gap-5 text-sm text-slate-200">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => navigate(link)}
              className="capitalize transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {link}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
