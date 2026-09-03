"use client";

import { Container } from "./Container";
import { useT } from "@/lib/i18n";

/** Figma: "Map" (286:362) — 1920x450, ko'k fon + nuqtali dunyo xaritasi */
export function PromoBanner() {
  const t = useT();

  return (
    <section className="relative flex min-h-[320px] items-center overflow-hidden bg-brand-500 py-16 lg:h-[450px] lg:py-0">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/dotted-map.svg')] bg-contain bg-center bg-no-repeat"
      />

      <Container className="relative flex flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl lg:leading-[60px]">
          {t("Istalgan nuqtadan onlayn o’qish imkoniyati")}
        </h2>

        <p className="text-xl leading-[30px] font-medium text-white">
          {t("Biz sizga bu imkoniyatni taqdim qilamiz")}
        </p>

        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-lg bg-white px-6 text-[15px] font-medium text-ink-800"
        >
          {t("Ro’yxatdan o’tish")}
        </button>
      </Container>
    </section>
  );
}
