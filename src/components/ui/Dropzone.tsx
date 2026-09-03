"use client";

import { useRef, useState, type DragEvent } from "react";

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 text-brand-500"
      aria-hidden
    >
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <path d="M12 15V4M8.5 7.5L12 4l3.5 3.5" />
    </svg>
  );
}

interface DropzoneProps {
  id: string;
  label: string;
  /** Maydon ostidagi kichik izoh — ruxsat etilgan format va o'lcham */
  hint: string;
  accept: string;
  /** Tahrirlashda ko'rsatiladigan saqlangan fayl havolasi */
  previewUrl?: string | null;
  /** Video uchun rasm o'rniga video tegi chiziladi */
  kind?: "image" | "video";
  onChange: (file: File | null) => void;
  error?: string | null;
}

/**
 * Figma: kurs qo'shish oynasidagi "Bu yerga bosing yoki faylni suring"
 * maydoni. Bosish ham, sudrab tashlash ham ishlaydi.
 */
export function Dropzone({
  id,
  label,
  hint,
  accept,
  previewUrl,
  kind = "image",
  onChange,
  error,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function accept_(file: File | null) {
    if (localUrl) URL.revokeObjectURL(localUrl);

    setLocalUrl(file ? URL.createObjectURL(file) : null);
    setFileName(file?.name ?? null);
    onChange(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    accept_(event.dataTransfer.files?.[0] ?? null);
  }

  const shownUrl = localUrl ?? previewUrl ?? null;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-semibold text-page-fg">{label}</span>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-5 text-center transition-colors ${
          error
            ? "border-danger-500"
            : over
              ? "border-brand-500 bg-brand-50"
              : "border-line bg-card hover:border-brand-500"
        }`}
      >
        {shownUrl &&
          (kind === "image" ? (
            <img
              src={shownUrl}
              alt=""
              className="h-24 w-full rounded-md object-cover"
            />
          ) : (
            <video
              src={shownUrl}
              className="h-24 w-full rounded-md object-cover"
              muted
            />
          ))}

        <UploadIcon />

        <p className="text-xs leading-snug text-ink-500">
          <span className="font-semibold text-brand-500">Bu yerga bosing</span>{" "}
          yoki faylni suring
        </p>

        <p className="text-[11px] leading-snug text-ink-500">
          {fileName ?? hint}
        </p>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => accept_(e.target.files?.[0] ?? null)}
        className="hidden"
      />

      {error && (
        <p className="text-sm font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
