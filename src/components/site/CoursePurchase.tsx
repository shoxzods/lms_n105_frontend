"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient, getApiErrorMessage } from "@/api/client";
import { fileUrl } from "@/api/public";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/store/auth";
import { IntroVideoModal } from "./IntroVideoModal";
import { PurchaseAuthModal } from "./PurchaseAuthModal";
import { Stars } from "./Stars";
import type { PublicCourseDetail } from "@/types";

async function buyCourse(courseId: number) {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    "/payments",
    { courseId },
  );
  return data;
}

export function CoursePurchase({ course }: { course: PublicCourseDetail }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const banner = fileUrl("images", course.banner);
  const intro = fileUrl("videos", course.intro_video);

  const [playing, setPlaying] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const buy = useMutation({ mutationFn: () => buyCourse(course.id) });

  function handleBuy() {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    buy.mutate();
  }

  return (
    <aside className="flex w-full flex-col gap-4 rounded-xl bg-card p-4 shadow-lg lg:w-[340px]">
      <div className="relative h-[190px] overflow-hidden rounded-lg bg-hover">
        {banner && (
          <Image
            src={banner}
            alt=""
            fill
            sizes="340px"
            className="object-cover"
          />
        )}

        {intro && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Tanishtiruv videosini ko'rish"
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 transition-colors hover:bg-black/40"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="#101828" className="size-6 pl-0.5">
                <path d="M6 4l14 8-14 8z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <IntroVideoModal
        open={playing}
        src={intro}
        onClose={() => setPlaying(false)}
      />

      <PurchaseAuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => buy.mutate()}
      />

      <p className="text-2xl font-bold text-page-fg">
        {formatPrice(course.price)} UZS
      </p>

      <p className="line-clamp-3 text-sm leading-5 text-ink-500">
        {course.description}
      </p>

      <Stars rating={4.5} />

      {buy.isSuccess ? (
        <div className="flex flex-col gap-2 rounded-lg bg-[#ecfdf3] px-4 py-3">
          <p className="text-sm font-bold text-[#027a48]">
            To&rsquo;lov qabul qilindi
          </p>
          <p className="text-xs text-[#027a48]">
            Administrator tasdiqlagach kurs ochiladi. Holatni shaxsiy
            kabinetingizda kuzating.
          </p>
          <button
            type="button"
            onClick={() => router.push("/my-courses")}
            className="mt-1 cursor-pointer rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white"
          >
            Shaxsiy kabinetga kirish
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleBuy}
            disabled={buy.isPending}
            className="cursor-pointer rounded-lg bg-ink-900 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {buy.isPending ? "Yuborilmoqda..." : "Sotib olish"}
          </button>

          {buy.isError && (
            <p className="text-sm font-medium text-danger-500">
              {getApiErrorMessage(buy.error, "To'lovni yuborib bo'lmadi")}
            </p>
          )}


        </>
      )}
    </aside>
  );
}
