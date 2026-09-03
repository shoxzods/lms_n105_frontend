"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { apiErrorMessage } from "@/lib/apiError";
import { ROLE_LABELS } from "@/lib/format";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, error, canRead } = useDashboardStats();

  return (
    <>
      <PageHeader title="Asosiy" breadcrumb={["Boshqaruv paneli"]} />

      <section className="flex w-full min-w-150 max-w-[1600px] flex-col gap-8 px-6 pb-8">
        {!canRead && (
          <p className="text-sm font-medium text-ink-500">
            Salom, {user?.full_name}. Siz{" "}
            {user ? ROLE_LABELS[user.role].toLowerCase() : ""} sifatida
            kirdingiz — umumiy statistika faqat administratorlarga
            ko&rsquo;rinadi.
          </p>
        )}

        {isError && (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        )}

        {canRead && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <StatCard
              value={data?.admins ?? 0}
              label="Jami Administratorlar"
              isLoading={isLoading}
            />
            <StatCard
              value={data?.mentors ?? 0}
              label="Jami Mentorlar"
              isLoading={isLoading}
            />
            <StatCard
              value={data?.assistants ?? 0}
              label="Jami Assistentlar"
              isLoading={isLoading}
            />
            <StatCard
              value={data?.students ?? 0}
              label="Jami Studentlar"
              isLoading={isLoading}
            />
            <StatCard
              value={data?.courses ?? 0}
              label="Jami Kurslar"
              isLoading={isLoading}
            />
          </div>
        )}
      </section>
    </>
  );
}
