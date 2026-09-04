"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownSm, Logo, UserIcon } from "@/components/ui/icons";
import { Container } from "./Container";
import { useT } from "@/lib/i18n";
import { useLangStore, type Lang } from "@/store/lang";

/**
 * Figma: "Frame 270990426" (368:5060) — 1920x105, oq fon.
 *
 * Sahifalar hali qurilmagan, shuning uchun href="#".
 * Har biri tayyor bo'lgach haqiqiy yo'l qo'yiladi.
 */
const NAV_LINKS = [
  { label: "Asosiy", href: "/" },
  { label: "Kurslar", href: "/courses" },
  { label: "Biz haqimizda", href: "/about" },
  { label: "Bog‘lanish", href: "/contact" },
];

export function SiteNavbar() {
  const t = useT();
  const pathname = usePathname();

  return (
    <header className="bg-page-bg">
      <Container className="flex items-center justify-between py-6">
        {/* Chap tomon — logo va menyu */}
        <div className="flex items-center gap-[29px]">
          <Link href="/" aria-label="Bosh sahifa">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = link.href === pathname;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-center p-2 text-[15px] font-medium ${
                    active
                      ? "border-b border-brand-500 text-page-fg"
                      : "text-[#2f3641]"
                  }`}
                >
                  {t(link.label)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* O'ng tomon — til va kirish */}
        <div className="flex items-center gap-4">
          <SiteLangSelector />

          <Link
            href="/login"
            className="flex h-12 items-center justify-center gap-2.5 rounded-lg bg-brand-500 px-4 text-[15px] font-medium whitespace-nowrap text-white lg:px-5"
          >
            <UserIcon />
            <span className="hidden sm:inline">
              {t("Kirish / Ro’yxatdan o’tish")}
            </span>
            <span className="sm:hidden">{t("Kirish")}</span>
          </Link>
        </div>
      </Container>
    </header>
  );
}

const LANGS: { code: Lang; short: string }[] = [
  { code: "uz", short: "O‘z" },
  { code: "ru", short: "Ру" },
  { code: "en", short: "En" },
];

/** Navbardagi dumaloq til tugmasi — bosilganda ro'yxat ochiladi */
function SiteLangSelector() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const init = useLangStore((s) => s.init);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const current = LANGS.find((item) => item.code === lang) ?? LANGS[0];

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-14 cursor-pointer items-center gap-2 rounded-full bg-ink-100 pr-2.5 pl-1.5"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-ink-200 text-base text-page-fg">
          {current.short}
        </span>
        <ChevronDownSm />
      </button>

      {open && (
        <>
          <span className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-16 z-20 flex w-[120px] flex-col gap-1 rounded-lg bg-card p-2 shadow-lg ring-1 ring-black/5">
            {LANGS.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
                className={`cursor-pointer rounded px-3 py-2 text-left text-sm font-medium transition-colors ${
                  item.code === lang
                    ? "bg-brand-500 text-white"
                    : "text-page-fg hover:bg-ink-100"
                }`}
              >
                {item.short}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
