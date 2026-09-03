import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { MediaGallery } from "@/components/site/MediaGallery";
import { Mentors } from "@/components/site/Mentors";
import { ABOUT_PARAGRAPHS, CERTIFICATE_IMAGES } from "@/constants/about";

export const metadata: Metadata = {
  title: "Biz haqimizda — IT Live Academy",
  description: "IT Live Academy haqida, media galereya va sertifikatlar",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-muted py-12">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-page-fg">Biz haqimizda</h1>

            {ABOUT_PARAGRAPHS.map((text) => (
              <p
                key={text.slice(0, 24)}
                className="text-sm leading-6 text-ink-500"
              >
                {text}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-page-fg">Media galereya</h2>
            <MediaGallery />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-page-fg">
              Sertifikat va guvohnomalar
            </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CERTIFICATE_IMAGES.map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    className="relative h-[220px] overflow-hidden rounded-xl border border-line bg-card shadow-xs transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={`/images/certificates/${name}`}
                      alt={`Sertifikat ${index + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
          </div>
        </Container>
      </section>

      <Mentors />
    </>
  );
}
