"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { useT } from "@/lib/i18n";

/** Figma: "Hero" (283:207) — 1920x660 */
export function Hero() {
  const t = useT();

  return (
    <section className="py-8">
      <Container className="flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="flex w-full max-w-[624px] flex-col items-start gap-8">
          <h1 className="text-4xl leading-tight font-bold text-page-fg sm:text-5xl lg:text-[60px] lg:leading-[72px]">
            {/* Figma: linear-gradient(100.77deg, #615DFF 2.3%, #FF1111 38.2%) */}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100.77deg, #615dff 2.3%, #ff1111 38.2%)",
              }}
            >
              {t("Kelajak kasblarini")}
            </span>{" "}
            {t("biz bilan o’rganing!")}
          </h1>

          <p className="text-lg leading-7 font-medium text-ink-500 dark:text-ink-200">
            {t(
              "Tekinga o‘qib, pul ishlashga nima deysiz? Ishonmayapsizmi? Biz buni isbotlaymiz. Hammasi o‘zingizga bog‘liq.",
            )}
          </p>

          <Link
            href="/courses"
            className="w-[200px] rounded-full bg-brand-500 px-5 py-4 text-center text-sm leading-[1.45] font-medium text-white"
          >
            {t("Kurslar bilan tanishish")}
          </Link>
        </div>

        <Image
          src="/images/hero-learning.svg"
          alt=""
          width={590}
          height={590}
          className="w-full max-w-[590px]"
          priority
        />
      </Container>
    </section>
  );
}
