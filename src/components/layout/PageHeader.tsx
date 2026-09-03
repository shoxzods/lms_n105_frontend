"use client";

import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { DotIcon } from "@/components/ui/icons";

interface PageHeaderProps {
  title: string;
  /** Sarlavha ostidagi yo'l: ["Foydalanuvchilar", "Administratorlar"] */
  breadcrumb: string[];
  /** O'ng tomondagi tugma (masalan "Qo'shish") */
  action?: ReactNode;
}

/** Figma: "Breadcrub" (32:435) */
export function PageHeader({ title, breadcrumb, action }: PageHeaderProps) {
  const t = useT();
  return (
    <div className="flex w-full max-w-[1600px] items-start justify-between gap-5 px-6">
      <div className="flex min-w-0 flex-col gap-3">
        <h1 className="text-2xl font-bold text-page-fg">{t(title)}</h1>

        <div className="flex items-center gap-5">
          {breadcrumb.map((crumb, index) => (
            <div key={crumb} className="flex items-center gap-5">
              <span className="whitespace-nowrap text-sm font-medium text-page-fg">
                {t(crumb)}
              </span>
              {index < breadcrumb.length - 1 && <DotIcon />}
            </div>
          ))}
          {breadcrumb.length === 1 && <DotIcon />}
        </div>
      </div>

      {action}
    </div>
  );
}
