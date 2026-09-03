import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Ro‘yxatdan o‘tish — IT Live Academy",
};

/** Figma: "Registration" (517:22203) */
export default function RegisterPage() {
  return (
    <AuthShell offsetClassName="pt-[260px]">
      <RegisterForm />
    </AuthShell>
  );
}
