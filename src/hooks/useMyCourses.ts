"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { getPublicCourses } from "@/lib/api/public";
import type { ApiResponse, Payment, PublicCourse } from "@/types";

export interface MyCourse {
  id: number;
  name: string;
  categoryName: string;
  banner: string | null;
  mentorName: string;
  mentorFile: string | null;
  /** To'lov tasdiqlanmagan bo'lsa kursni ochib bo'lmaydi */
  unlocked: boolean;
  status: Payment["status"];
}

/** GET /payments/my — student o'z to'lovlari */
async function getMyPayments() {
  const { data } = await apiClient.get<ApiResponse<Payment[]>>("/payments/my");
  return data;
}

/**
 * Student "Mening kurslarim" ro'yxati.
 *
 * `GET /payments/my` kursning faqat id, nomi va kategoriyasini qaytaradi —
 * banner va mentor u yerda yo'q. Shuning uchun ochiq `GET /public/courses`
 * dan bir marta olib, id bo'yicha birlashtiramiz. Har kurs uchun alohida
 * so'rov yuborilmaydi.
 */
export function useMyCourses() {
  const payments = useQuery({
    queryKey: ["payments", "my"],
    queryFn: getMyPayments,
  });

  const published = useQuery({
    queryKey: ["public-courses", "all"],
    queryFn: () => getPublicCourses({ page: 1, limit: 100 }),
  });

  const byId = new Map<number, PublicCourse>(
    (published.data?.data ?? []).map((course) => [course.id, course]),
  );

  const courses: MyCourse[] = (payments.data?.data ?? []).map((payment) => {
    const full = byId.get(payment.courseId);

    return {
      id: payment.courseId,
      name: payment.courses.name,
      categoryName: payment.courses.categories?.name ?? "",
      banner: full?.banner ?? null,
      mentorName: full?.mentorProfile?.user.full_name ?? "—",
      mentorFile: full?.mentorProfile?.user.file ?? null,
      unlocked: payment.status === "COMPLETED",
      status: payment.status,
    };
  });

  return {
    courses,
    isLoading: payments.isLoading || published.isLoading,
    isError: payments.isError,
    error: payments.error,
  };
}
