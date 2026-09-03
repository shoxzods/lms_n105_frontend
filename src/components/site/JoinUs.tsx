"use client";

import { Container } from "./Container";
import { useT } from "@/lib/i18n";

/** Figma: "Frame 270990505" (1535:6131) — ikkita taklif kartasi */
const CARDS = [
  {
    title: "O’quvchimisiz?",
    text: "Agarda o’quvchi bo’lsangiz bizning xalqaro darajadagi tajribali mentorlarimizga shogird bo’ling",
    action: "Boshlash",
  },
  {
    title: "Mentormisiz?",
    text: "Bizning mualliflar jamoamizga qo’shilib, o’z tajribangizni boshqalar bilan oosn va qulay platforma orqali ulashing",
    action: "Qo’shilish",
  },
];

export function JoinUs() {
  const t = useT();

  return (
    <section className="bg-muted pb-15">
      <Container className="flex flex-col gap-[23px]">
        <h2 className="text-4xl leading-[60px] font-bold text-page-fg">
          {t("Bizga qo’shiling")}
        </h2>

        <p className="text-[15px] font-medium text-ink-500">
          Bizning safimizga nafaqat o’rganuvchi balki yetarkucha tajribangiz
          bo’lsa mentor sifatida ham qo’shilishingiz mumkin
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start gap-4 rounded-[10px] bg-card p-5"
            >
              <h3 className="text-2xl font-bold text-page-fg">{t(card.title)}</h3>
              <p className="text-[15px] leading-6 font-medium text-ink-500">
                {t(card.text)}
              </p>
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-lg bg-brand-500 px-6 text-[15px] font-medium text-white"
              >
                {t(card.action)}
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
