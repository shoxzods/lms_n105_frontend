"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, TableEmpty, Th } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";

/**
 * Figma: "Natijalar".
 *
 * DIQQAT — bu sahifada ma'lumot YO'Q, chunki `schema.prisma` da imtihon
 * natijalari modeli mavjud emas. `Exam` faqat savol va to'g'ri javobni
 * saqlaydi; student qaysi testni yechgani, nechta to'g'ri javob bergani
 * hech qayerda yozilmaydi.
 *
 * Jadval ko'rinishi dizayndagidek tayyor — kerakli model qo'shilishi bilan
 * faqat ma'lumot manbai ulanadi.
 */
export default function ResultsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const meta = { total: 0, page, limit, totalPages: 1 };

  return (
    <>
      <PageHeader title="Natijalar" breadcrumb={["Natijalar"]} />

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

        <div className="flex flex-wrap items-end gap-3 px-6">
          <SearchBar
            defaultValue={search}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          {/* Figma: bitta sana oralig'i maydoni */}
          <div className="flex h-[46px] items-center gap-2 rounded-lg border border-line bg-card px-4">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Boshlanish sanasi"
              className="bg-transparent text-sm text-page-fg outline-none"
            />
            <span className="text-ink-500">–</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Tugash sanasi"
              className="bg-transparent text-sm text-page-fg outline-none"
            />
          </div>
        </div>

        <div className="px-6">
          <div className="mb-3 rounded-lg border border-[#fec84b] bg-[#fffaeb] px-4 py-3 text-sm font-medium text-[#b54708]">
            Imtihon natijalari bazada saqlanmaydi —{" "}
            <code className="font-mono">schema.prisma</code> da natijalar
            modeli yo&rsquo;q. Model qo&rsquo;shilgach jadval to&rsquo;ladi.
          </div>

          <Table>
            <thead>
              <tr>
                <Th width={48} align="center">
                  <input
                    type="checkbox"
                    disabled
                    aria-label="Hammasini belgilash"
                    className="size-4 accent-brand-500"
                  />
                </Th>
                <Th filterable>F.I.Sh</Th>
                <Th filterable>Kurs</Th>
                <Th filterable>Bo&rsquo;lim</Th>
                <Th sortable>To&rsquo;g&rsquo;ri javob</Th>
                <Th sortable>Noto&rsquo;g&rsquo;ri javob</Th>
                <Th width={200} sortable>
                  Imtixondan o&rsquo;tish natijasi
                </Th>
              </tr>
            </thead>

            <tbody>
              <TableEmpty colSpan={7} message="Natija topilmadi" />
            </tbody>
          </Table>
        </div>

        <TableFooter
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
          fileName="natijalar"
          rows={[]}
        />
      </div>
    </>
  );
}
