"use client";

import { create } from "zustand";
import { REFRESH_KEY, TOKEN_KEY } from "@/api/client";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";
import type { JwtPayload } from "@/types";

interface AuthState {
  user: JwtPayload | null;
  /** localStorage o'qilguncha true — sahifa "chaqnashi"ning oldini oladi */
  isLoading: boolean;
  setToken: (token: string, refreshToken?: string) => void;
  loadFromStorage: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setToken: (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    set({ user: decodeJwt(token), isLoading: false });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    const payload = decodeJwt(token);
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, isLoading: false });
      return;
    }

    set({ user: payload, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    set({ user: null, isLoading: false });
  },
}));
