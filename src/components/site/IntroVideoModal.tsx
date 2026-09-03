"use client";

import { useEffect } from "react";

export function IntroVideoModal({
  open,
  src,
  onClose,
}: {
  open: boolean;
  src: string | null;
  onClose: () => void;
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

  if (!open || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tanishtiruv videosi"
        className="w-full max-w-[900px]"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={src}
          controls
          autoPlay
          controlsList="nodownload"
          className="aspect-video w-full rounded-lg bg-black"
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Yopish"
        className="absolute top-6 right-6 cursor-pointer text-3xl leading-none text-white/80 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
