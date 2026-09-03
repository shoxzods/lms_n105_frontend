"use client";

import { useEffect, useState } from "react";
import { ChevronDown18 } from "@/components/ui/icons";
import { useLangStore, type Lang } from "@/store/lang";

const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: "uz", label: "O‘zbek", short: "O‘zbek tili" },
  { code: "ru", label: "Русский", short: "Русский язык" },
  { code: "en", label: "English", short: "English" },
];

/**
 * Figma: "Language selector" (32:427).
 *
 * Tanlangan til `localStorage` da saqlanadi va butun panel matnlariga
 * `useT()` orqali ta'sir qiladi.
 */
export function LanguageSelector() {
  const [open, setOpen] = useState(false);

  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const init = useLangStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const current =
    LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative w-[141px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[46px] w-full cursor-pointer items-center justify-between rounded-[10px] border border-line bg-card px-3.5 py-[15px]"
        aria-expanded={open}
      >
        <span className="truncate text-sm font-medium text-page-fg">
          {current.short}
        </span>
        <ChevronDown18 className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <>
          {/* Tashqariga bosilganda yopilsin */}
          <span
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-[50px] z-20 flex w-[141px] flex-col gap-1 rounded bg-card p-2.5 shadow-lg ring-1 ring-black/5">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center rounded px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-hover ${
                  item.code === lang
                    ? "bg-brand-500 text-white"
                    : "bg-table-head text-page-fg"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
