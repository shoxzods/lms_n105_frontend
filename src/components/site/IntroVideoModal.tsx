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

  const isEmbed =
    src.includes("youtube.com") ||
    src.includes("youtu.be") ||
    src.includes("vimeo.com");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tanishtiruv videosi"
        className="relative w-full max-w-[900px] overflow-hidden rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isEmbed ? (
          <iframe
            src={src}
            title="Tanishtiruv videosi"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-2xl"
          />
        ) : (
          <video
            src={src}
            controls
            autoPlay
            controlsList="nodownload"
            className="aspect-video w-full rounded-2xl bg-black"
          />
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Yopish"
        className="absolute top-6 right-6 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
      >
        ×
      </button>
    </div>
  );
}
