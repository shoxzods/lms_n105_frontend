"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronDown16 } from "@/components/ui/icons";
import { useT } from "@/lib/i18n";
import type { NavChild, NavItem } from "@/constants/nav";

const ROW = "flex w-full items-center gap-[7px] rounded-md py-2";

/** Ochiladigan menyudagi bitta havola — ikkala holatda ham bir xil */
function ChildLink({
  child,
  active,
  onNavigate,
  label,
}: {
  child: NavChild;
  active: boolean;
  onNavigate?: () => void;
  label: string;
}) {
  if (child.disabled) {
    return (
      <span
        className="cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium text-white/35"
        title="Bu bo‘lim hali tayyor emas"
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      href={child.href}
      onClick={onNavigate}
      className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

export function SidebarItem({
  item,
  collapsed = false,
}: {
  item: NavItem;
  /** Yig'ilgan holatda faqat ikonka ko'rinadi */
  collapsed?: boolean;
}) {
  const t = useT();
  const pathname = usePathname();
  const Icon = item.icon;

  const childActive = item.children?.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(Boolean(childActive));

  /*
    Yig'ilgan holatda menyu ikonkaning yonida suzib chiqadi. Panelda
    `overflow-y-auto` bo'lgani uchun oddiy `absolute` qirqilib ketardi —
    shuning uchun tugmaning ekrandagi o'rnini o'lchab, `fixed` qilamiz.
  */
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flyout, setFlyout] = useState<{ top: number; left: number } | null>(
    null,
  );

  const pad = collapsed ? "justify-center px-0" : "px-4";
  const label = t(item.label);

  /* --- Bolalari yo'q: oddiy havola --- */
  if (!item.children) {
    const active = item.href ? pathname.startsWith(item.href) : false;

    if (item.disabled || !item.href) {
      return (
        <span
          className={`${ROW} ${pad} cursor-not-allowed text-white/35`}
          title="Bu bo‘lim hali tayyor emas"
        >
          <Icon />
          {!collapsed && (
            <span className="flex-1 text-left text-sm font-medium">{label}</span>
          )}
        </span>
      );
    }

    return (
      <Link
        href={item.href}
        title={collapsed ? label : undefined}
        className={`${ROW} ${pad} text-sm font-medium text-white transition-colors ${
          active ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <Icon />
        {!collapsed && <span className="flex-1 text-left">{label}</span>}
      </Link>
    );
  }

  /* --- Yig'ilgan: ikonka bosilsa yonida suzuvchi menyu --- */
  if (collapsed) {
    return (
      <>
        <button
          ref={buttonRef}
          type="button"
          title={label}
          aria-expanded={flyout !== null}
          onClick={() => {
            if (flyout) {
              setFlyout(null);
              return;
            }

            const box = buttonRef.current?.getBoundingClientRect();
            if (box) setFlyout({ top: box.top, left: box.right + 8 });
          }}
          className={`${ROW} ${pad} cursor-pointer text-white transition-colors ${
            childActive ? "bg-white/10" : "hover:bg-white/5"
          }`}
        >
          <Icon />
        </button>

        {flyout && (
          <>
            {/* Tashqariga bosilganda yopilsin */}
            <span
              className="fixed inset-0 z-30"
              onClick={() => setFlyout(null)}
            />

            <div
              style={{ top: flyout.top, left: flyout.left }}
              className="fixed z-40 flex w-[220px] flex-col gap-1 rounded-lg bg-ink-900 p-2 shadow-xl ring-1 ring-white/10"
            >
              <span className="px-4 py-1.5 text-xs font-semibold uppercase text-white/40">
                {label}
              </span>

              {item.children.map((child) => (
                <ChildLink
                  key={child.href}
                  child={child}
                  label={t(child.label)}
                  active={pathname.startsWith(child.href)}
                  onNavigate={() => setFlyout(null)}
                />
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  /* --- Ochiq: odatdagi akkordeon --- */
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${ROW} cursor-pointer justify-between px-4 text-sm font-medium text-white transition-colors hover:bg-white/5`}
        aria-expanded={open}
      >
        <span className="flex flex-1 items-center gap-[7px]">
          <Icon />
          <span className="flex-1 text-left">{label}</span>
        </span>
        <ChevronDown16
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-1 pl-4">
          {item.children.map((child) => (
            <ChildLink
              key={child.href}
              child={child}
              label={t(child.label)}
              active={pathname.startsWith(child.href)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
