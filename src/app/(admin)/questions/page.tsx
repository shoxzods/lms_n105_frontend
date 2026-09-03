"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { Table, TableEmpty, Th } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";
import { Textarea } from "@/components/ui/Textarea";

/**
 * Figma: "Savollar" (Savol-javoblar).
 *
 * DIQQAT — ma'lumot YO'Q: `schema.prisma` da student savoli va unga
 * beriladigan javob uchun model mavjud emas. Shu sabab jadval bo'sh
 * turadi. Model qo'shilgach faqat ma'lumot manbai ulanadi — ko'rinish
 * va "Javob berish" oynasi tayyor.
 */
export default function QuestionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [answering, setAnswering] = useState(false);

  const meta = { total: 0, page, limit, totalPages: 1 };

  return (
    <>
      <PageHeader title="Savollar" breadcrumb={["Savollar"]} />

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

          <div className="w-[200px]">
            <Select
              id="question-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Holatni tanlang</option>
              <option value="answered">O&rsquo;qilgan</option>
              <option value="pending">Javob kutilmoqda</option>
            </Select>
          </div>
        </div>

        <div className="px-6">
          <div className="mb-3 rounded-lg border border-[#fec84b] bg-[#fffaeb] px-4 py-3 text-sm font-medium text-[#b54708]">
            Savol-javoblar bazada saqlanmaydi —{" "}
            <code className="font-mono">schema.prisma</code> da bunday model
            yo&rsquo;q. Model qo&rsquo;shilgach jadval to&rsquo;ladi.
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
                <Th sortable>Savol</Th>
                <Th sortable>Javob</Th>
                <Th sortable>Fayllar</Th>
                <Th width={150} sortable>
                  Amallar
                </Th>
              </tr>
            </thead>

            <tbody>
              <TableEmpty colSpan={8} message="Savol topilmadi" />
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
          fileName="savollar"
          rows={[]}
        />
      </div>

      <AnswerModal open={answering} onClose={() => setAnswering(false)} />
    </>
  );
}

/* ==================== Javob berish ==================== */

/**
 * Figma: jadvaldagi ko'k "Javob berish" tugmasi ochadigan oyna.
 * Model qo'shilgach `POST /questions/:id/answer` ga ulanadi.
 */
function AnswerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!text.trim()) return;

    // TODO: savol-javob modeli qo'shilgach shu yerdan yuboriladi
  }

  return (
    <Modal open={open} title="Javob berish" onClose={onClose} width={440}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          id="answer-text"
          label="Matn"
          rows={5}
          placeholder="Yozing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={touched && !text.trim() ? "Javob matnini yozing" : null}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-page-fg">
            Fayl yuklash
          </span>

          <div className="flex items-stretch overflow-hidden rounded-lg border border-line">
            <label className="flex cursor-pointer items-center gap-2 bg-table-head px-4 py-2.5 text-sm font-medium text-page-fg hover:bg-hover">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="size-4"
                aria-hidden
              >
                <path d="M6.5 9.5l3-3M5 11a2.5 2.5 0 0 1 0-3.5l2.5-2.5M11 5a2.5 2.5 0 0 1 0 3.5L8.5 11" />
              </svg>
              Yuklash
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>

            <span className="flex flex-1 items-center px-4 text-sm text-ink-500">
              {file?.name ?? "File not found"}
            </span>
          </div>
        </div>

        <div className="flex justify-start pt-1">
          <Button type="submit" className="min-w-[110px]">
            ✓ Saqlash
          </Button>
        </div>
      </form>
    </Modal>
  );
}
