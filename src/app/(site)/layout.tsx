import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNavbar } from "@/components/site/SiteNavbar";

/** Ochiq sayt — kirmagan odam ham ko'radi (landing, kurslar, biz haqimizda) */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-full bg-page-bg">
      <SiteNavbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
