import { Hero } from "@/components/site/Hero";
import { JoinUs } from "@/components/site/JoinUs";
import { Mentors } from "@/components/site/Mentors";
import { PopularCourses } from "@/components/site/PopularCourses";
import { PromoBanner } from "@/components/site/PromoBanner";
import { Testimonials } from "@/components/site/Testimonials";

/**
 * Figma: "Landing page" (368:346) — 1920x5167.
 *
 *   1. Navbar           ✅ (layout ichida)
 *   2. Hero             ✅
 *   3. Ommabop kurslar  ✅
 *   4. Bizga qo'shiling ✅
 *   5. Ko'k banner      ✅  nuqtali xarita foni qo'yilmagan
 *   6. Mentorlar        ✅  o'lchamlar taxminiy
 *   7. Izohlar          ✅  o'lchamlar taxminiy
 *   8. Footer CTA       ✅  o'lchamlar taxminiy  (layout ichida)
 *   9. Footer           ✅  o'lchamlar taxminiy  (layout ichida)
 *
 * "taxminiy" — Figma MCP limiti tufayli aniq o'lchamlar olinmagan.
 * Limit tiklangach solishtirib tuzatish kerak.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <PopularCourses />
      <JoinUs />
      <PromoBanner />
      <Mentors />
      <Testimonials />
    </>
  );
}
