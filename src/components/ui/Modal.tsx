"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Figma: admin panelidagi modal oyna — 405px kenglik, 24px padding,
 * sarlavha va o'ng tomonda yopish tugmasi.
 */
export function Modal({
  open,
  title,
  onClose,
  children,
  width = 405,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
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
      {/*
        Uzun formalar ekranga sig'masligi mumkin — shuning uchun oyna
        balandligi cheklanadi va ichki qismi aylantiriladi. Sarlavha bilan
        yopish tugmasi tepada qotib turadi.
      */}
      <div
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: width }}
        className="flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-5">
          <h2 className="text-xl font-bold text-page-fg">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="cursor-pointer text-2xl leading-none text-ink-500 hover:text-page-fg"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
