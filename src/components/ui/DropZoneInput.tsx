"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface DropZoneInputProps {
  id: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  requiredMark?: boolean;
  currentName?: string | null;
  onChange: (files: FileList | null) => void;
  error?: string | null;
}

export function DropZoneInput({
  id,
  label,
  accept,
  multiple = true,
  requiredMark = false,
  currentName,
  onChange,
  error,
}: DropZoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pickedText, setPickedText] = useState<string>("");

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      setPickedText("");
    } else if (files.length === 1) {
      setPickedText(files[0].name);
    } else {
      setPickedText(`${files.length} ta fayl tanlandi`);
    }
    onChange(files);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  const fileLabel = pickedText || currentName;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-page-fg">
        {label}
        {requiredMark && <span className="text-danger-500"> *</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 transition-colors ${
          error
            ? "border-danger-500 bg-danger-500/5"
            : isDragging
              ? "border-brand-500 bg-brand-500/5"
              : "border-line bg-card hover:border-brand-300 hover:bg-subtle/50"
        }`}
      >
        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-line bg-subtle/40 px-6 py-8 text-center transition-colors group-hover:border-brand-300">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-line bg-card shadow-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 text-ink-600"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
          </div>

          {fileLabel ? (
            <p className="text-sm font-semibold text-brand-600">{fileLabel}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-ink-600">
                <span className="font-semibold text-brand-600 hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="mt-1 text-xs text-ink-400">
                SVG, PNG, JPG or GIF (max. 800×400px)
              </p>
            </>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
