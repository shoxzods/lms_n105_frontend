"use client";

import { create } from "zustand";

const STORAGE_KEY = "lms_sidebar_collapsed";

interface SidebarState {
  collapsed: boolean;
  /** Brauzerdagi saqlangan holatni o'qiydi */
  init: () => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  /*
    Server va brauzer birinchi chizishda bir xil qiymatni ko'rishi kerak,
    aks holda React hidratsiya xatosi beradi. Haqiqiy qiymat init() da.
  */
  collapsed: false,

  init: () => {
    try {
      set({ collapsed: localStorage.getItem(STORAGE_KEY) === "1" });
    } catch {
      // brauzer ruxsat bermasa — ochiq holicha qoladi
    }
  },

  toggle: () => {
    const collapsed = !get().collapsed;

    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // saqlab bo'lmasa ham panel yopiladi
    }

    set({ collapsed });
  },
}));
