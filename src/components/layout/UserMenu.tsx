"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown14 } from "@/components/ui/icons";
import { ROLE_LABELS } from "@/lib/format";
import { useAuthStore } from "@/store/auth";
import { useT } from "@/lib/i18n";

/** Figma: profil bloki (32:428) — 211px kenglik */
export function UserMenu() {
  const router = useRouter();
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-full w-[211px] cursor-pointer items-center gap-2 rounded-[10px] bg-card p-2.5"
        aria-expanded={open}
      >
        <Image
          src="/images/avatar.png"
          alt=""
          width={38}
          height={38}
          style={{ width: "38px", height: "38px" }}
          className="size-[38px] shrink-0 rounded-full object-cover"
        />

        <span className="flex min-w-0 flex-1 flex-col items-start gap-[3px]">
          <span className="truncate text-sm font-bold text-page-fg">
            {user?.full_name ?? "—"}
          </span>
          <span className="text-xs font-medium text-ink-500">
            {user ? t(ROLE_LABELS[user.role]) : ""}
          </span>
        </span>

        <ChevronDown14 className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute right-0 top-[70px] z-20 w-[211px] rounded-[10px] bg-card p-2 shadow-lg ring-1 ring-black/5">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block rounded px-3.5 py-2.5 text-left text-sm font-medium text-page-fg transition-colors hover:bg-hover"
          >
            {t("Profil sozlamalari")}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer rounded px-3.5 py-2.5 text-left text-sm font-medium text-danger-500 transition-colors hover:bg-hover"
          >
            {t("Chiqish")}
          </button>
        </div>
      )}
    </div>
  );
}
