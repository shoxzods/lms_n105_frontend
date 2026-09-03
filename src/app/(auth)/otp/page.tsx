import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpForm } from "@/components/auth/OtpForm";

export const metadata: Metadata = {
  title: "Tasdiqlash kodi — IT Live Academy",
};

/**
 * Figma: "OTP" (517:22320).
 *
 * OtpForm `useSearchParams` ishlatadi — Next.js statik sahifada uni
 * Suspense ichida talab qiladi, aks holda build ogohlantirish beradi.
 */
export default function OtpPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="w-[380px] max-w-full" />}>
        <OtpForm />
      </Suspense>
    </AuthShell>
  );
}
