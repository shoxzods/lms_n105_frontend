import { AxiosError } from "axios";

/**
 * Xatoni foydalanuvchi tushunadigan xabarga aylantiradi.
 *
 * Ilgari hamma nosozlik uchun bitta xabar chiqarardi ("Backend ishlab
 * turibdimi?") — 403 kelganda ham shu chiqib, sababni yashirardi.
 */
export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "Kutilmagan xatolik yuz berdi.";
  }

  if (!error.response) {
    return "Serverga ulanib bo‘lmadi. Backend ishlab turibdimi?";
  }

  const data = error.response.data as { message?: string | string[] } | undefined;
  if (data?.message) {
    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }
    return data.message;
  }

  switch (error.response.status) {
    case 401:
      return "Sessiya tugagan. Qaytadan kiring.";
    case 403:
      return "Bu amalni bajarishga ruxsatingiz yo‘q.";
    case 404:
      return "Ma’lumot topilmadi.";
    case 409:
      return "Bunday yozuv allaqachon mavjud.";
    default:
      return error.response.status >= 500
        ? "Serverda xatolik yuz berdi."
        : "So‘rovni bajarib bo‘lmadi.";
  }
}
