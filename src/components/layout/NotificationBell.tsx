"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BellIcon } from "@/components/ui/icons";
import { useNotifications } from "@/hooks/useNotifications";
import { useT } from "@/lib/i18n";

export function NotificationBell() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { payments, messages, total, markMessagesSeen } = useNotifications();

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const items = [
    {
      key: "payments",
      count: payments,
      href: "/payments",
      label: t("ta to‘lov tasdiqlanishini kutmoqda"),
    },
    {
      key: "messages",
      count: messages,
      href: "/chats",
      label: t("ta yangi savol-javob xabari"),
    },
  ].filter((item) => item.count > 0);

  return (
    <div ref={boxRef} className="relative h-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-full cursor-pointer items-center justify-center rounded-[10px] bg-card px-3 pb-3.5 pt-3"
        aria-label={t("Bildirishnomalar")}
        aria-expanded={open}
      >
        <BellIcon />
        {total > 0 && (
          <span className="absolute left-5 top-1.5 flex size-[18px] items-center justify-center rounded-[50px] border border-white bg-danger-500 text-xs font-medium text-white">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[70px] z-20 w-[280px] rounded-[10px] bg-card p-2 shadow-lg ring-1 ring-black/5">
          {items.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-ink-500">
              {t("Yangi bildirishnoma yo‘q")}
            </p>
          ) : (
            items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => {
                  if (item.key === "messages") markMessagesSeen();
                  setOpen(false);
                }}
                className="flex items-start gap-2.5 rounded px-3.5 py-2.5 transition-colors hover:bg-hover"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-danger-500 text-[11px] font-medium text-white">
                  {item.count > 9 ? "9+" : item.count}
                </span>
                <span className="text-sm font-medium leading-5 text-page-fg">
                  {item.label}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
