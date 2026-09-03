"use client";

import Image from "next/image";
import { Container } from "./Container";
import { useT } from "@/lib/i18n";

/**
 * Figma: "Frame 270990443" (517:1994) — 1920x703.
 *
 * Bu bo'lim BUTUNLAY STATIK bo'lib qoladi — schema.prisma da
 * izohlar uchun model yo'q, ya'ni backend qismi qilinmaydi.
 *
 * Dizaynda bu bo'lim Poppins bilan chizilgan (qolgan sahifa Inter).
 */
const REVIEWS = [
  {
    text: "Lorem ipsum dolor sit amet consectetur. Sit in eget posuere facilisis elementum. Est semper aenean erat est etiam sit. Auctor risus semper ultrices eleifend vel at. Pharetra turpis fames cursus sit in faucibus.",
    name: "Xurshid Istamov",
    job: "Frontend kursi o’quvchisi",
  },
  {
    text: "Lorem ipsum dolor sit amet consectetur. In mattis ullamcorper faucibus amet libero. Et varius lorem magna non ultricies dictum duis. Quis imperdiet parturient leo orci libero gravida. Tortor malesuada quam.",
    name: "Xurshid Istamov",
    job: "Frontend kursi o’quvchisi",
  },
  {
    text: "Lorem ipsum dolor sit amet consectetur. Lectus placerat convallis vel mauris. Donec nunc tincidunt mattis enim rhoncus viverra libero enim nulla. Faucibus eleifend commodo sollicitudin eu turpis risus vitae.",
    name: "Xurshid Istamov",
    job: "Frontend kursi o’quvchisi",
  },
];

export function Testimonials() {
  const t = useT();

  return (
    <section className="bg-muted">
      <Container className="flex flex-col items-center gap-8 py-15 text-center">
        <h2 className="text-3xl leading-tight font-bold text-page-fg sm:text-4xl lg:text-5xl lg:leading-[60px]">
          {t("Izohlar")}
        </h2>
        <p className="text-xl leading-[30px] font-medium text-ink-500">
          {t("O’quvchilarimiz tomonidan qoldirilgan izohlar")}
        </p>
      </Container>

      <div className="flex justify-center gap-8 overflow-x-auto px-8 pb-15">
        {REVIEWS.map((review, i) => (
          <figure
            key={i}
            className="flex w-[340px] shrink-0 flex-col gap-[43px] rounded-[10px] border border-line bg-card p-8 shadow-[0_60px_40px_0_rgba(198,212,240,0.25)] lg:w-[405px] dark:shadow-none"
          >
            <Image
              src="/icons/quote.svg"
              alt=""
              width={46}
              height={38}
              className="shrink-0"
            />

            <blockquote className="font-poppins text-base leading-8 font-medium text-page-fg">
              {review.text}
            </blockquote>

            <figcaption className="font-poppins">
              <p className="text-xl leading-8 font-bold text-page-fg">
                {review.name}
              </p>
              <p className="text-sm font-medium text-ink-500">{review.job}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
