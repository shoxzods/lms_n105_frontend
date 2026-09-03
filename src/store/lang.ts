"use client";

import { create } from "zustand";

export type Lang = "uz" | "ru" | "en";

const STORAGE_KEY = "lms_lang";

interface LangState {
  lang: Lang;
  /** Brauzerdagi saqlangan tilni o'qiydi */
  init: () => void;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  /*
    Server va brauzer birinchi chizishda bir xil qiymatni ko'rishi kerak,
    aks holda React hidratsiya xatosi beradi. Haqiqiy qiymat init() da
    o'qiladi.
  */
  lang: "uz",

  init: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "uz" || saved === "ru" || saved === "en") {
        set({ lang: saved });
      }
    } catch {
      // brauzer ruxsat bermasa — o'zbekcha qoladi
    }
  },

  setLang: (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // saqlab bo'lmasa ham til almashadi
    }
    set({ lang });
  },
}));
