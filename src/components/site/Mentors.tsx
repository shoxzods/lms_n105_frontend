"use client";

import Image from "next/image";
import { usePublicMentors } from "@/hooks/usePublic";
import { fileUrl } from "@/lib/api/public";
import type { PublicMentor } from "@/types";
import { Container } from "./Container";
import { useT } from "@/lib/i18n";

function SocialIcon({ src, inset }: { src: string; inset: string }) {
  return (
    <span className="relative block size-6 shrink-0">
      <span className="absolute" style={{ inset }}>
        <Image src={src} alt="" fill />
      </span>
    </span>
  );
}

function InstagramIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <span className="absolute inset-[12.5%]">
        <Image src="/icons/social/instagram-1.svg" alt="" fill />
      </span>
      <span className="absolute inset-[25.82%_25.12%_30.73%_30.73%]">
        <Image src="/icons/social/instagram-2.svg" alt="" fill />
      </span>
    </span>
  );
}

function MentorCard({ mentor }: { mentor: PublicMentor }) {
  const profile = mentor.mentorProfile[0] ?? null;
  const photo = fileUrl("images", mentor.image ?? mentor.file);

  return (
    <article className="group relative h-[380px] w-[300px] shrink-0 overflow-hidden rounded bg-[#e0e0e0] lg:h-[500px] lg:w-[405px]">
      {photo ? (
        <Image
          src={photo}
          alt={mentor.full_name}
          fill
          sizes="(max-width: 1024px) 300px, 405px"
          className="object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-5xl font-bold text-ink-500">
          {mentor.full_name.charAt(0)}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-5 bg-gradient-to-b from-transparent to-black to-[67%] px-5 py-8 transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex flex-col gap-0.5 text-white">
          <p className="text-xl leading-[30px] font-bold">{mentor.full_name}</p>
          <p className="text-sm">{profile?.job ?? "Mentor"}</p>
        </div>

        <div className="flex gap-3">
          {profile?.telegram && (
            <SocialIcon src="/icons/social/telegram.svg" inset="8.33%" />
          )}
          {profile?.instagram && <InstagramIcon />}
          {profile?.facebook && (
            <SocialIcon src="/icons/social/facebook.svg" inset="8.33%" />
          )}
          {profile?.linkedin && (
            <SocialIcon src="/icons/social/linkedin.svg" inset="12.5%" />
          )}
          {profile?.github && (
            <SocialIcon src="/icons/social/github.svg" inset="9.36% 8.33%" />
          )}
        </div>
      </div>
    </article>
  );
}

/** Figma: "Frame 270990442" (373:16699) — 1920x802 */
export function Mentors() {
  const t = useT();
  const { mentors, isLoading } = usePublicMentors();

  return (
    <section className="bg-page-bg">
      <Container className="flex flex-col items-center gap-8 py-15 text-center">
        <h2 className="text-3xl leading-tight font-bold text-page-fg sm:text-4xl lg:text-5xl lg:leading-[60px]">
          {t("Tajribali Mentorlar")}
        </h2>
        <p className="text-xl leading-[30px] font-medium text-ink-500">
          {t("Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan")}
        </p>
      </Container>

      {isLoading && (
        <p className="pb-15 text-center text-sm font-medium text-ink-500">
          {t("Yuklanmoqda...")}
        </p>
      )}

      {!isLoading && mentors.length === 0 && (
        <p className="pb-15 text-center text-sm font-medium text-ink-500">
          {t("Hozircha mentorlar qo‘shilmagan.")}
        </p>
      )}

      <div className="flex gap-8 overflow-x-auto pb-15">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </section>
  );
}
