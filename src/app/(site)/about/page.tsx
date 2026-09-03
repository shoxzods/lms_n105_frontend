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
  const [first, second, ...rest] = CERTIFICATE_IMAGES;

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

            {CERTIFICATE_IMAGES.length === 0 ? (
              <p className="text-sm text-ink-500">
                Sertifikatlar hali qo&rsquo;shilmagan.
              </p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {[first, second].filter(Boolean).map((name) => (
                  <span
                    key={name}
                    className="relative h-[250px] overflow-hidden rounded-lg bg-card"
                  >
                    <Image
                      src={`/images/certificates/${name}`}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-2"
                    />
                  </span>
                ))}

                {rest.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {rest.map((name) => (
                      <span
                        key={name}
                        className="relative h-[117px] overflow-hidden rounded-lg bg-card"
                      >
                        <Image
                          src={`/images/certificates/${name}`}
                          alt=""
                          fill
                          sizes="33vw"
                          className="object-contain p-1"
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Mentors />
    </>
  );
}
