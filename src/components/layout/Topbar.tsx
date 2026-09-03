"use client";

import { useEffect } from "react";
import { BadgeCheckIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import { ROLE_LABELS } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

/** Figma: "Topbar" (32:419) — 80px balandlik */
export function Topbar() {
  const t = useT();
  const role = useAuthStore((s) => s.user?.role);

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const initTheme = useThemeStore((s) => s.init);

  /* Saqlangan mavzuni brauzerdan o’qiymiz — server bilan mos kelishi uchun */
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <header className="flex w-full max-w-[1600px] items-center justify-end gap-6 px-6">
      {/* Chap tomon — kirgan foydalanuvchining roli */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <BadgeCheckIcon />
        <p className="truncate text-xl font-semibold text-page-fg">
          {role ? t(ROLE_LABELS[role]) : ""}
        </p>
      </div>

      {/* O'ng tomon — boshqaruv elementlari */}
      <div className="flex h-20 items-center justify-end gap-6 py-4">
        <NotificationBell />

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-full cursor-pointer items-center justify-center rounded-[10px] bg-card px-3 pb-3.5 pt-3"
          aria-label={theme === "dark" ? t("Kunduzgi rejim") : t("Tungi rejim")}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <LanguageSelector />
        <UserMenu />
      </div>
    </header>
  );
}
