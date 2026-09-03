import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { CourseFilters } from "@/components/site/CourseFilters";

export const metadata: Metadata = {
  title: "Kurslar — IT Live Academy",
  description: "IT Live Academy dagi barcha kurslar",
};

/**
 * Figma: "Courses" (380:54449) — 1920x2044.
 *
 * DIQQAT: Figma limiti tufayli aniq o'lchamlar hali olinmagan.
 * Sarlavha va chiplar landing sahifasidagi "Ommabop kurslar"
 * bo'limi bo'yicha qurilgan — limit ochilgach solishtiriladi.
 */
export default function CoursesPage() {
  return (
    <section className="bg-muted">
      <Container className="flex flex-col gap-8 py-15">
        <h1 className="text-3xl leading-tight font-bold text-page-fg sm:text-4xl lg:text-5xl lg:leading-[60px]">
          Kurslar
        </h1>

        <CourseFilters />
      </Container>
    </section>
  );
}
