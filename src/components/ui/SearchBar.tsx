"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { useT } from "@/lib/i18n";

/** Figma: "Table bottom" (380:54395) — 456px maydon + ko'k "Izlash" tugmasi */
export function SearchBar({
  defaultValue = "",
  placeholder,
  onSearch,
}: {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
}) {
  const t = useT();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-1.5 px-6">
      <div className="flex h-[46px] w-[456px] max-w-full items-center gap-3.5 rounded-lg border border-line bg-card px-4 py-3">
        <SearchIcon />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? `${t("Izlash")}...`}
          className="min-w-0 flex-1 bg-transparent text-sm text-page-fg outline-none placeholder:text-page-fg/45"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              onSearch("");
            }}
            className="cursor-pointer text-sm text-ink-500 hover:text-page-fg"
            aria-label="Tozalash"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-brand-500 px-5 text-base font-medium leading-none text-white transition-colors hover:bg-brand-600"
      >
        {t("Izlash")}
      </button>
    </form>
  );
}
