import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Parolni qayta tiklash — IT Live Academy",
};

/**
 * Figma: "Reset password" (517:22437).
 *
 * Forma `useSearchParams` ishlatadi — Next.js statik sahifada uni
 * Suspense ichida talab qiladi.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="w-[380px] max-w-full" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
