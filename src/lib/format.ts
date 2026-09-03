import type { UserRole } from "@/types";

/** "2026-08-02T22:08:22.588Z" → "2026-08-02 22:08:22" (Figma dagi ko'rinish) */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPERADMIN: "Super administrator",
  ADMIN: "Administrator",
  TEACHER: "Mentor",
  ASSISTANT: "Assistent",
  STUDENT: "Student",
};

export function avatarUrl(file: string | null): string | null {
  if (!file) return null;
  const base = (
    process.env.NEXT_PUBLIC_API_URL ?? "https://lms-n105.dedyn.io/api/v1"
  ).replace(/\/api\/v1$/, "");
  return `${base}/uploads/images/${file}`;
}



/**
 * Prisma `Decimal` ni JSON da MATN sifatida yuboradi ("1600000").
 * Uni bo'shliq bilan ajratib ko'rsatamiz: 1 600 000
 */
export function formatPrice(value: string | number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return new Intl.NumberFormat("uz-UZ").format(n).replace(/\u00A0/g, " ");
}

/**
 * Telefon raqamini xalqaro formatga (+998XXXXXXXXX) keltirish.
 * NestJS backend class-validator `@IsPhoneNumber()` uchun + belgisi bilan 13 ta belgi bo'lishi shart.
 */
export function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  if (raw.trim().startsWith("+")) {
    return raw.trim();
  }
  return digits ? `+${digits}` : "";
}
