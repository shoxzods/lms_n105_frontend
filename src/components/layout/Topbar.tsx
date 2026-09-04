"use client";

import { BadgeCheckIcon } from "@/components/ui/icons";
import { ROLE_LABELS } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

/** Figma: "Topbar" (32:419) — 80px balandlik */
export function Topbar() {
  const t = useT();
  const role = useAuthStore((s) => s.user?.role);

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
        <LanguageSelector />
        <UserMenu />
      </div>
    </header>
  );
}
