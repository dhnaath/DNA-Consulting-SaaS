import { create } from "zustand";

interface DockStore {
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  toggleMinimized: () => void;
}

export const useDockStore = create<DockStore>((set) => ({
  isMinimized: false,
  setIsMinimized: (val) => set({ isMinimized: val }),
  toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
}));
