"use client";

import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

interface ThemeState {
  theme: Theme;
  /** Brauzerdagi saqlangan qiymatni o'qib, holatga oladi */
  init: () => void;
  toggle: () => void;
}

/** <html> ga `.dark` klassini qo'yadi yoki oladi */
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Boshlang'ich qiymat serverda ham, clientda ham bir xil bo'lishi kerak —
  // aks holda React hidratsiya xatosi beradi. Haqiqiy qiymat init() da o'qiladi.
  theme: "light",

  init: () => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const theme: Theme =
      saved ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    applyTheme(theme);
    set({ theme });
  },

  toggle: () => {
    const theme: Theme = get().theme === "dark" ? "light" : "dark";

    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },
}));
