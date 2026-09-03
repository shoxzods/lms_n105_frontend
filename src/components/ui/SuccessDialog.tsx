"use client";

import { useEffect } from "react";
import { useT } from "@/lib/i18n";

/** Figma: amal muvaffaqiyatli tugagach chiqadigan oyna */
export function SuccessDialog({
  open,
  message,
  actionLabel = "Yopish",
  tone = "success",
  onClose,
}: {
  open: boolean;
  message: string;
  /** Figma da ba’zi oynalarda tugma matni boshqacha ("Kirish") */
  actionLabel?: string;
  /** Figma: qo‘shilganda yashil belgi, o‘zgartirilganda ko‘k */
  tone?: "success" | "info";
  onClose: () => void;
}) {
  const t = useT();

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="flex w-full max-w-[275px] flex-col items-center gap-6 rounded-xl bg-card px-6 py-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={`flex size-16 items-center justify-center rounded-full ${
            tone === "info" ? "bg-brand-500" : "bg-[#26bf56]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8"
            aria-hidden
          >
            <path d="M4 12.5l5.5 5.5L20 7" />
          </svg>
        </span>

        <p className="text-center text-[15px] font-bold text-page-fg">
          {t(message)}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white"
        >
          {t(actionLabel)}
        </button>
      </div>
    </div>
  );
}
