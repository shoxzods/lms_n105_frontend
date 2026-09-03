/**
 * RegExp yordamida satr boshi (^) yoki so'zlar boshidan qidirish
 */
export function matchStartsWith(
  text: string | null | undefined,
  query: string,
): boolean {
  if (!text || !query) return false;
  const trimmed = query.trim();
  if (!trimmed) return true;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|\\s)${escaped}`, "i");
  return regex.test(text);
}

/**
 * Telefon raqamini RegExp / raqamlar bo'yicha qidirish
 */
export function matchPhone(
  phone: string | null | undefined,
  query: string,
): boolean {
  if (!phone || !query) return false;
  const searchDigits = query.replace(/\D/g, "");
  const phoneDigits = phone.replace(/\D/g, "");

  if (searchDigits) {
    return phoneDigits.includes(searchDigits);
  }

  return matchStartsWith(phone, query);
}
