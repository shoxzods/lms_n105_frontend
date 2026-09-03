import type { JwtPayload } from "@/types";

/**
 * JWT ning payload qismini o'qiydi.
 * DIQQAT: bu imzoni TEKSHIRMAYDI — token ichidagi ma'lumot faqat
 * interfeysni chizish uchun ishlatiladi. Haqiqiy tekshiruv backendda.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Token muddati tugaganmi */
export function isTokenExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}
