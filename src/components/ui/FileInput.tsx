"use client";

import { useRef, useState, type ChangeEvent } from "react";

interface FileInputProps {
  id: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  requiredMark?: boolean;
  /** Tahrirlashda: hozir saqlanib turgan fayl nomi */
  currentName?: string | null;
  onChange: (files: FileList | null) => void;
  error?: string | null;
}

/** `Input` bilan bir xil ko'rinishdagi fayl tanlash maydoni */
export function FileInput({
  id,
  label,
  accept,
  multiple = false,
  requiredMark = false,
  currentName,
  onChange,
  error,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<string>("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    setPicked(
      !files || files.length === 0
        ? ""
        : files.length === 1
          ? files[0].name
          : `${files.length} ta fayl`,
    );

    onChange(files);
  }

  const shown = picked || currentName || "Fayl tanlanmagan";

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex w-full flex-col gap-1">
        <label htmlFor={id} className="text-sm font-semibold text-page-fg">
          {label}
          {requiredMark && <span className="text-danger-500"> *</span>}
        </label>

        <div
          className={`flex w-full items-center justify-between gap-2 rounded-md border bg-card px-4 py-[11px] ${
            error ? "border-danger-500" : "border-line"
          }`}
        >
          <span
            className={`min-w-0 flex-1 truncate text-[15px] font-medium ${
              picked || currentName ? "text-page-fg" : "text-ink-500"
            }`}
          >
            {shown}
          </span>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 cursor-pointer rounded-md bg-hover px-3 py-1.5 text-xs font-semibold text-page-fg hover:bg-ink-200"
          >
            Tanlash
          </button>
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
        <p className="text-[15px] font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
