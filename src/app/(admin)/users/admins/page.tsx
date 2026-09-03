"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { CirclePlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { apiErrorMessage } from "@/lib/apiError";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsersList } from "@/hooks/useUsers";

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { users, meta, clientSideFallback, isLoading, isError, error } = useUsersList({
    page,
    limit,
    search: search || undefined,
    role: "ADMIN",
  });

  return (
    <>
      <PageHeader
        title="Administratorlar"
        breadcrumb={["Foydalanuvchilar", "Administratorlar"]}
        action={
          <Button leftIcon={<CirclePlusIcon />} className="min-h-12">
            Qo&rsquo;shish
          </Button>
        }
      />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 pb-8">
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
        />

        <SearchBar
          defaultValue={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        <div className="px-6">
          {isError && (
            <p className="mb-3 text-sm font-medium text-danger-500">
              {apiErrorMessage(error)}
            </p>
          )}

          {clientSideFallback && !isError && (
            <p className="mb-3 text-xs font-medium text-ink-500">
              Eslatma: sahifalash va filtr hozircha brauzerda bajarilmoqda —
              backendda <code>page</code>, <code>limit</code>,{" "}
              <code>search</code>, <code>role</code> parametrlari hali
              qo&rsquo;shilmagan.
            </p>
          )}

          <UsersTable users={users} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
