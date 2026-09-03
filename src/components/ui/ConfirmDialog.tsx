"use client";

import { useEffect } from "react";
import { useT } from "@/lib/i18n";

/**
 * Figma: o'chirishdan oldin so'raladigan oyna.
 * Sarlavhasi va yopish tugmasi yo'q — faqat savol va ikkita tugma.
 */
export function ConfirmDialog({
  open,
  message,
  confirmLabel,
  cancelLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = useT();

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="flex w-full max-w-[275px] flex-col items-center gap-6 rounded-xl bg-card px-6 py-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-danger-500 text-3xl font-bold text-white">
          ?
        </span>

        <p className="text-center text-[15px] font-bold text-page-fg">
          {message ?? t("Siz rostdan ham o‘chirmoqchimisiz?")}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-page-fg"
          >
            {cancelLabel ?? t("Bekor qilish")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isPending ? "..." : (confirmLabel ?? t("O‘chirish"))}
          </button>
        </div>
      </div>
    </div>
  );
}
