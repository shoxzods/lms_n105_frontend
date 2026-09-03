import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/icons";

interface AuthShellProps {
  children: ReactNode;
  /** Forma ekran bo'yi bo'ylab qayerdan boshlanishi (Figma: Items y=330) */
  offsetClassName?: string;
}

/**
 * Figma: "Login & Registration" seksiyasidagi 4 ta ekran bir xil qolipda —
 * chapda 1186px illyustratsiya, o'ngda 734px forma va yuqori o'ngda logo.
 */
export function AuthShell({
  children,
  offsetClassName = "pt-[330px]",
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen bg-card">
      <div className="hidden flex-[1186] items-center justify-center overflow-hidden bg-auth-hero p-2.5 lg:flex">
        <Image
          src="/images/login-hero.png"
          alt=""
          width={755}
          height={755}
          priority
          className="size-[755px] max-w-full object-contain"
        />
      </div>

      <div
        className={`relative flex flex-[734] items-start justify-center px-2.5 pb-2.5 ${offsetClassName}`}
      >
        <Logo className="absolute top-[52px] right-12" />
        {children}
      </div>
    </main>
  );
}
