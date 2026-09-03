"use client";

import { useEffect } from "react";
import { Logo, SidebarCollapseIcon } from "@/components/ui/icons";
import { navItemsForRole } from "@/constants/nav";
import { useAuthStore } from "@/store/auth";
import { useSidebarStore } from "@/store/sidebar";
import { useT } from "@/lib/i18n";
import { SidebarItem } from "./SidebarItem";

/** Figma: "Sidebar admin" — 320px kenglik, #0D1017 fon */
export function Sidebar() {
  const t = useT();
  const role = useAuthStore((s) => s.user?.role);
  const items = navItemsForRole(role);

  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const init = useSidebarStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <aside
      className={`flex shrink-0 flex-col overflow-y-auto bg-ink-900 transition-[width] duration-200 ${
        collapsed ? "w-[88px]" : "w-[320px]"
      }`}
    >
      {/* Logo qatori — 80px balandlik, pastki chegara */}
      <div
        className={`flex h-20 shrink-0 items-center border-b border-white/[0.04] px-6 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <Logo variant="light" />}

        <button
          type="button"
          onClick={toggle}
          className="cursor-pointer rounded-[10px] bg-white/[0.06] p-2.5 transition-colors hover:bg-white/10"
          aria-label={collapsed ? t("Panelni ochish") : t("Panelni yig‘ish")}
          aria-expanded={!collapsed}
          title={collapsed ? t("Panelni ochish") : t("Panelni yig‘ish")}
        >
          <span
            className={`block transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            <SidebarCollapseIcon />
          </span>
        </button>
      </div>

      {/* Menyu */}
      <nav
        className={`flex flex-col gap-[9px] pt-0 ${collapsed ? "px-3" : "px-5"}`}
      >
        {!collapsed && (
          <div className="px-5 py-3">
            <span className="flex h-8 items-center justify-center rounded-lg bg-white/[0.08] px-2.5 text-sm font-semibold uppercase text-white">
              {t("Boshqaruv paneli")}
            </span>
          </div>
        )}

        {collapsed && <div className="py-3" />}

        {items.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}
