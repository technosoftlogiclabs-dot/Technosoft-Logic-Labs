import { create } from "zustand";

type Orientation = [number, number, number] | null;

type UIState = {
  openPanelId: string | null;
  targetOrientation: Orientation;
  twoDMode: boolean;
  setPanel: (panelId: string | null) => void;
  setTargetOrientation: (orientation: Orientation) => void;
  setTwoDMode: (enabled: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  openPanelId: null,
  targetOrientation: null,
  twoDMode: false,
  setPanel: (panelId) => set({ openPanelId: panelId }),
  setTargetOrientation: (orientation) => set({ targetOrientation: orientation }),
  setTwoDMode: (enabled) => set({ twoDMode: enabled })
}));