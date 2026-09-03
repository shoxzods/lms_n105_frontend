"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemedLogo } from "@/components/ui/icons";
import { Container } from "./Container";
import { useT } from "@/lib/i18n";

/** Figma: "Footer" (376:36829) */
export function SiteFooter() {
  const t = useT();

  return (
    <footer className="flex flex-col items-center gap-16 border-t border-line bg-page-bg pt-16 pb-12">
      <Container className="flex flex-col items-center gap-12">
        <ThemedLogo />

        <div className="flex max-w-[768px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl leading-[38px] font-semibold text-[#101828] dark:text-ink-50">
            {t("Biz bilan muvaffaqiyatga erishing")}
          </h2>
          <p className="text-xl leading-[30px] text-[#475467] dark:text-ink-200">
            {t("Eng kuchlilar biz bilan qoladi!")}
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-3">
          <Link
            href="#"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#f2f4f7] bg-[#f2f4f7] px-[18px] py-3 text-base leading-6 font-medium text-[#344054] dark:border-ink-800 dark:bg-ink-800 dark:text-ink-100"
          >
            <Image
              src="/icons/play-circle.svg"
              alt=""
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
              className="dark:invert"
            />
            Intro video
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-[18px] py-3 text-base leading-6 font-medium text-white"
          >
            {t("Bog‘lanish")}
          </Link>
        </div>
      </Container>

      <Container>
        <div className="flex flex-wrap items-center justify-between gap-y-6 border-t border-[#eaecf0] pt-8 text-base leading-6 text-[#667085] dark:border-ink-800 dark:text-ink-500">
          <p>© 2024. Barcha huquqlar himoyalangan</p>

          <div className="flex h-6 gap-4">
            <Link href="#">Terminlar</Link>
            <Link href="#">Xavfsizlik</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
