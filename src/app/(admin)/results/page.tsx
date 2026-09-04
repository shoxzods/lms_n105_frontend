"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useCoursesList, useSectionsList } from "@/hooks/useContent";
import {
  useDeleteExamResult,
  useExamResultDetail,
  useExamResults,
  useMyExamResults,
} from "@/hooks/useExamResults";
import { useAuthStore } from "@/store/auth";
import { fileUrl } from "@/api/public";
import { formatDateTime } from "@/lib/format";
import type { ExamResultItem, ExamStatus } from "@/types";

/* ==================== SVG Icons ==================== */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-ink-400"
      aria-hidden
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5L18 18" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-ink-500"
      aria-hidden
    >
      <path d="M3 5h8M15 5h2M7 5a2 2 0 100-4 2 2 0 000 4z" />
      <path d="M3 10h2M9 10h8M5 10a2 2 0 100-4 2 2 0 000 4z" />
      <path d="M3 15h10M17 15h0M13 15a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-ink-500"
      aria-hidden
    >
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M14 2v4M6 2v4M3 8h14" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3 text-ink-400"
      aria-hidden
    >
      <path d="M1.5 2.5a.75.75 0 01.75-.75h11.5a.75.75 0 01.53 1.28L9 8.31v4.94a.75.75 0 01-1.06.67l-2-1A.75.75 0 015.5 12.25V8.31L1.72 3.03a.75.75 0 01-.22-.53z" />
    </svg>
  );
}

function SortArrowsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3 text-ink-400"
      aria-hidden
    >
      <path d="M8 2.5a.75.75 0 01.53.22l2.5 2.5a.75.75 0 01-1.06 1.06L8.75 5.06v5.88l1.22-1.22a.75.75 0 111.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06l1.22 1.22V5.06L6.03 6.28A.75.75 0 014.97 5.22l2.5-2.5A.75.75 0 018 2.5z" />
    </svg>
  );
}

function ExcelIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
      <rect width="16" height="16" rx="2" fill="#1D6F42" />
      <path
        d="M4.6 4.6l2.2 3.4-2.2 3.4h1.6l1.4-2.3 1.4 2.3h1.6L8.4 8l2.2-3.4H9L7.6 6.9 6.2 4.6H4.6z"
        fill="#fff"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 text-ink-500"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

/* ==================== Sahifalash (Pagination) ==================== */

function buildPages(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);

  return pages;
}

/* ==================== Avatar komponenti ==================== */

const AVATAR_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-rose-400 to-red-500",
];

function StudentAvatar({
  name,
  file,
  index = 0,
}: {
  name: string;
  file?: string | null;
  index?: number;
}) {
  const [error, setError] = useState(false);
  const url = file ? fileUrl("images", file) : null;
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  if (url && !error) {
    return (
      <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <Image
          src={url}
          alt={name}
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setError(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-xs font-bold text-white shadow-xs`}
    >
      {initial}
    </span>
  );
}

/* ==================== Asosiy Natijalar Sahifasi ==================== */

export default function ResultsPage() {
  const user = useAuthStore((s) => s.user);
  const isStudent = user?.role === "STUDENT";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [courseId, setCourseId] = useState<number | undefined>(undefined);
  const [sectionId, setSectionId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<ExamStatus | undefined>(undefined);

  // Tanlangan qatorlar (checkbox)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modallar va filtrlash popoverlari
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sanalar uchun ichki holat
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");

  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Tashqariga bosganda popoverlarni yopish
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(e.target as Node)
      ) {
        setShowFilterPopover(false);
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ma'lumotlarni olish
  const query = {
    page,
    limit,
    search: search.trim() || undefined,
    dateRange: dateRange.trim() || undefined,
    courseId,
    sectionId,
    status,
  };

  const adminQuery = useExamResults(query);
  const studentQuery = useMyExamResults(query);
  const { courses } = useCoursesList({ page: 1, limit: 100 });
  const { sections } = useSectionsList({
    page: 1,
    limit: 100,
    courseId: courseId ?? undefined,
  });

  const detailQuery = useExamResultDetail(selectedResultId);

  const activeQuery = isStudent ? studentQuery : adminQuery;
  const { results, meta, isLoading, isFetching } = activeQuery;

  // Hammasini tanlash
  const allSelected =
    results.length > 0 &&
    results.every((item) => selectedIds.includes(item.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map((r) => r.id));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  // Excel eksport qilish
  function handleExportExcel() {
    const exportItems =
      selectedIds.length > 0
        ? results.filter((r) => selectedIds.includes(r.id))
        : results;

    if (exportItems.length === 0) return;

    const rows = exportItems.map((r) => ({
      ID: r.id,
      "F.I.Sh": r.student?.fullName ?? "—",
      Kurs: r.course?.name ?? "—",
      "Bo'lim": r.section?.name ?? "—",
      "To'g'ri javob": r.correctAnswers,
      "Noto'g'ri javob": r.wrongAnswers,
      "Imtixondan o'tish natijasi": r.status === "PASSED" ? "O'tgan" : "O'tmagan",
      Foiz: `${r.percentage}%`,
      Sana: formatDateTime(r.create_at),
    }));

    const headers = Object.keys(rows[0]);
    const escape = (value: string | number) =>
      String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");

    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${headers
      .map((h) => `<th>${escape(h)}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${escape(row[h as keyof typeof row] ?? "")}</td>`).join("")}</tr>`,
      )
      .join("")}</tbody></table></body></html>`;

    const blob = new Blob(["\uFEFF", html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "natijalar.xls";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  // Sanani formatlash (YYYY-MM-DD -> DD.MM.YYYY)
  function applyDateRange() {
    if (tempStart && tempEnd) {
      const s = tempStart.split("-").reverse().join(".");
      const e = tempEnd.split("-").reverse().join(".");
      setDateRange(`${s}-${e}`);
    } else if (tempStart) {
      const s = tempStart.split("-").reverse().join(".");
      setDateRange(`${s}-${s}`);
    } else {
      setDateRange("");
    }
    setShowDatePicker(false);
    setPage(1);
  }

  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  const exportCount = selectedIds.length > 0 ? selectedIds.length : meta.total;

  return (
    <div className="flex w-full flex-col bg-[#fafbfc] min-h-screen">
      {/* Sarlavha qismi (Screenshot: Natijalar / Natijalar •) */}
      <div className="px-8 pt-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#101828]">
          {isStudent ? "Mening natijalarim" : "Natijalar"}
        </h1>
        <div className="flex items-center gap-1.5 pt-1 text-sm font-medium text-ink-500">
          <span>{isStudent ? "Mening natijalarim" : "Natijalar"}</span>
          <span className="text-xs">●</span>
        </div>
      </div>

      {/* Yuqori boshqaruv va filtrlar paneli (Screenshot: Qidiruv, Sana, Pagination) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 pb-4">
        {/* Chap tomon: Qidiruv va Sana */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Qidiruv inputi (O'quvchining ismi yoki familiyasi + Filter ikonkasi) */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="O'quvchining ismi yoki familiyasi"
              className="h-10 w-72 sm:w-80 rounded-lg border border-[#e4e7ec] bg-white pl-10 pr-10 text-sm text-[#101828] placeholder-[#98a2b3] shadow-2xs outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowFilterPopover((prev) => !prev)}
              title="Filtrlar"
              className={`absolute right-2.5 flex size-6 items-center justify-center rounded-md transition-colors hover:bg-slate-100 ${
                courseId || sectionId || status ? "text-brand-600" : "text-ink-400"
              }`}
            >
              <SlidersIcon />
            </button>

            {/* Filtr popoveri */}
            {showFilterPopover && (
              <div
                ref={filterPopoverRef}
                className="absolute top-12 left-0 z-50 flex w-80 flex-col gap-3.5 rounded-xl border border-[#e4e7ec] bg-white p-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-600">
                    Qo&apos;shimcha filtrlar
                  </span>
                  {(courseId || sectionId || status) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseId(undefined);
                        setSectionId(undefined);
                        setStatus(undefined);
                        setPage(1);
                      }}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Tozalash
                    </button>
                  )}
                </div>

                {/* Kurs tanlash */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink-700">
                    Kurs:
                  </label>
                  <select
                    value={courseId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setCourseId(val);
                      setSectionId(undefined);
                      setPage(1);
                    }}
                    className="h-9 rounded-lg border border-[#e4e7ec] bg-white px-2.5 text-xs text-[#101828] outline-none focus:border-brand-500"
                  >
                    <option value="">Barcha kurslar</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bo'lim tanlash */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink-700">
                    Bo&apos;lim:
                  </label>
                  <select
                    value={sectionId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setSectionId(val);
                      setPage(1);
                    }}
                    className="h-9 rounded-lg border border-[#e4e7ec] bg-white px-2.5 text-xs text-[#101828] outline-none focus:border-brand-500"
                  >
                    <option value="">Barcha bo&apos;limlar</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Natija holati */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink-700">
                    Holat:
                  </label>
                  <select
                    value={status ?? ""}
                    onChange={(e) => {
                      const val = (e.target.value as ExamStatus) || undefined;
                      setStatus(val);
                      setPage(1);
                    }}
                    className="h-9 rounded-lg border border-[#e4e7ec] bg-white px-2.5 text-xs text-[#101828] outline-none focus:border-brand-500"
                  >
                    <option value="">Barchasi</option>
                    <option value="PASSED">O&apos;tgan</option>
                    <option value="FAILED">O&apos;tmagan</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sana oralig'i (Screenshot: 04.08.2024-05.08.2024 + Kalendar ikonkasi) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              className="flex h-10 items-center justify-between gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3.5 text-sm text-[#101828] shadow-2xs transition-all hover:border-slate-300 focus:border-brand-500 min-w-[190px]"
            >
              <span className={dateRange ? "font-medium text-[#101828]" : "text-[#98a2b3]"}>
                {dateRange || "04.08.2024-05.08.2024"}
              </span>
              <CalendarIcon />
            </button>

            {/* Sana popoveri */}
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute top-12 left-0 z-50 flex w-72 flex-col gap-3 rounded-xl border border-[#e4e7ec] bg-white p-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-600">
                    Sana oralig&apos;ini tanlang
                  </span>
                  {dateRange && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateRange("");
                        setTempStart("");
                        setTempEnd("");
                        setShowDatePicker(false);
                        setPage(1);
                      }}
                      className="text-xs font-semibold text-danger-500 hover:underline"
                    >
                      Tozalash
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-ink-600">Dan:</span>
                    <input
                      type="date"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                      className="h-8 rounded-md border border-[#e4e7ec] px-2 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-ink-600">Gacha:</span>
                    <input
                      type="date"
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                      className="h-8 rounded-md border border-[#e4e7ec] px-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyDateRange}
                  className="mt-1 h-8 rounded-lg bg-brand-500 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Qo&apos;llash
                </button>
              </div>
            )}
          </div>
        </div>

        {/* O'ng tomon: Yuqori sahifalash (Screenshot: Bir sahifada:10 v | 1 2 3 ... 15 Keyingi) */}
        <div className="flex items-center gap-4">
          {/* Bir sahifada nechta */}
          <label className="relative flex items-center gap-1 text-xs sm:text-sm font-medium text-[#344054]">
            <span className="whitespace-nowrap">Bir sahifada:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="cursor-pointer appearance-none bg-transparent pr-4 font-semibold text-[#101828] outline-none"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0">
              <ChevronDownIcon />
            </span>
          </label>

          {/* Sahifa raqamlari */}
          <div className="flex items-center gap-1">
            {buildPages(page, meta.totalPages).map((item, index) =>
              item === "..." ? (
                <span
                  key={`gap-${index}`}
                  className="flex size-8 items-center justify-center text-xs font-medium text-[#475467]"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}-${index}`}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    item === page
                      ? "border border-[#d0d5dd] bg-white text-[#101828] shadow-2xs"
                      : "text-[#475467] hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer rounded-lg border border-[#d0d5dd] bg-white px-3 py-1.5 text-xs font-medium text-[#344054] shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 ml-1"
            >
              Keyingi
            </button>
          </div>
        </div>
      </div>

      {/* Jadval qismi (Screenshot: F.I.Sh, Kurs, Bo'lim, To'g'ri javob, Noto'g'ri javob, Imtixondan o'tish natijasi) */}
      <div className="relative w-full px-8">
        {isFetching && !isLoading && (
          <div className="absolute top-2 right-12 z-10 flex items-center gap-1.5 rounded-md bg-white/80 px-2 py-1 text-xs font-medium text-ink-500 backdrop-blur-xs">
            <Spinner size="sm" />
            <span>Yangilanmoqda...</span>
          </div>
        )}

        <div className="w-full overflow-x-auto rounded-lg border border-[#e4e7ec] bg-white shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e4e7ec] bg-[#f8f9fa] text-xs font-bold text-[#344054]">
                {/* Checkbox */}
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Barcha qatorlarni tanlash"
                    className="size-4 cursor-pointer rounded border-[#d0d5dd] accent-brand-500"
                  />
                </th>

                {/* F.I.Sh */}
                <th className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span>F.I.Sh</span>
                    <FunnelIcon />
                  </div>
                </th>

                {/* Kurs */}
                <th className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span>Kurs</span>
                    <FunnelIcon />
                  </div>
                </th>

                {/* Bo'lim */}
                <th className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span>Bo&apos;lim</span>
                    <FunnelIcon />
                  </div>
                </th>

                {/* To'g'ri javob */}
                <th className="px-4 py-3.5 text-center">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>To&apos;g&apos;ri javob</span>
                    <SortArrowsIcon />
                  </div>
                </th>

                {/* Noto'g'ri javob */}
                <th className="px-4 py-3.5 text-center">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Noto&apos;g&apos;ri javob</span>
                    <SortArrowsIcon />
                  </div>
                </th>

                {/* Imtixondan o'tish natijasi */}
                <th className="px-4 py-3.5 text-center">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Imtixondan o&apos;tish natijasi</span>
                    <SortArrowsIcon />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f2f4f7] text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <Spinner size="lg" />
                      <span className="text-sm font-medium text-ink-500">
                        Natijalar yuklanmoqda...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm font-medium text-ink-400">
                    Imtihon natijalari topilmadi
                  </td>
                </tr>
              ) : (
                results.map((item, idx) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isPassed = item.status === "PASSED";

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedResultId(item.id)}
                      className={`cursor-pointer transition-colors hover:bg-[#f8f9fa] ${
                        isSelected ? "bg-slate-50/80" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="px-4 py-3.5 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="size-4 cursor-pointer rounded border-[#d0d5dd] accent-brand-500"
                        />
                      </td>

                      {/* F.I.Sh (Avatar + Ism) */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            name={item.student?.fullName ?? "Talaba"}
                            file={item.student?.image ?? null}
                            index={idx}
                          />
                          <span className="font-semibold text-[#101828]">
                            {item.student?.fullName ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Kurs */}
                      <td className="px-4 py-3.5 font-normal text-[#344054]">
                        {item.course?.name ?? "—"}
                      </td>

                      {/* Bo'lim */}
                      <td className="px-4 py-3.5 font-normal text-[#344054]">
                        {item.section?.name ?? item.lesson?.name ?? "—"}
                      </td>

                      {/* To'g'ri javob */}
                      <td className="px-4 py-3.5 text-center font-medium text-[#344054]">
                        {item.correctAnswers}
                      </td>

                      {/* Noto'g'ri javob */}
                      <td className="px-4 py-3.5 text-center font-medium text-[#344054]">
                        {item.wrongAnswers}
                      </td>

                      {/* Imtixondan o'tish natijasi (Pill badge: O'tgan / O'tmagan) */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-5 py-1 text-xs font-semibold ${
                            isPassed
                              ? "bg-[#e6f9f0] text-[#12b76a]"
                              : "bg-[#fee4e2] text-[#f04438]"
                          }`}
                        >
                          {isPassed ? "O'tgan" : "O'tmagan"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ajratuvchi chiziq (Screenshot dagi kabi) */}
      <div className="px-8 pt-5 pb-2">
        <div className="border-t-2 border-[#e4e7ec]" />
      </div>

      {/* Pastki qism / Footer (Screenshot: Sahifada 0-10 gacha. Umumiy 2ta | (2) Yuklab olish .XLS | Pagination) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 pb-8">
        {/* Chap tomon: Sahifada 0-10 gacha. Umumiy 2ta va Excel tugmasi */}
        <div className="flex flex-wrap items-center gap-6">
          <p className="whitespace-nowrap text-sm font-semibold text-[#101828]">
            Sahifada {from}-{to} gacha. Umumiy {meta.total}ta
          </p>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={results.length === 0}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#101828] transition-colors hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ExcelIcon />
            <span className="font-semibold">
              ({exportCount}) Yuklab olish .XLS
            </span>
          </button>
        </div>

        {/* O'ng tomon: Pastki sahifalash */}
        <div className="flex items-center gap-4">
          <label className="relative flex items-center gap-1 text-xs sm:text-sm font-medium text-[#344054]">
            <span className="whitespace-nowrap">Bir sahifada:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="cursor-pointer appearance-none bg-transparent pr-4 font-semibold text-[#101828] outline-none"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0">
              <ChevronDownIcon />
            </span>
          </label>

          <div className="flex items-center gap-1">
            {buildPages(page, meta.totalPages).map((item, index) =>
              item === "..." ? (
                <span
                  key={`gap-b-${index}`}
                  className="flex size-8 items-center justify-center text-xs font-medium text-[#475467]"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-b-${item}-${index}`}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    item === page
                      ? "border border-[#d0d5dd] bg-white text-[#101828] shadow-2xs"
                      : "text-[#475467] hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer rounded-lg border border-[#d0d5dd] bg-white px-3 py-1.5 text-xs font-medium text-[#344054] shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 ml-1"
            >
              Keyingi
            </button>
          </div>
        </div>
      </div>

      {/* Natija Tafsilotlari Modali (Savollar va javoblar tahlili) */}
      <Modal
        open={selectedResultId !== null}
        title="Imtihon natijasi tafsilotlari"
        onClose={() => setSelectedResultId(null)}
        width={720}
      >
        {detailQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Spinner size="lg" />
            <span className="text-sm text-ink-500">Natija yuklanmoqda...</span>
          </div>
        ) : !detailQuery.data?.data ? (
          <p className="py-6 text-center text-sm text-ink-500">
            Natija topilmadi yoki yuklashda xatolik yuz berdi.
          </p>
        ) : (
          (() => {
            const d = detailQuery.data.data;
            const passed = d.status === "PASSED";

            return (
              <div className="flex flex-col gap-6">
                {/* Asosiy ma'lumotlar */}
                <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 border border-line">
                  {d.student && (
                    <div className="flex items-center gap-3 border-b border-line pb-3">
                      <StudentAvatar
                        name={d.student.fullName}
                        file={d.student.image}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#101828]">
                          {d.student.fullName}
                        </span>
                        <span className="text-xs text-ink-500">
                          {d.student.phone} {d.student.email && `• ${d.student.email}`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <div>
                      <span className="block text-xs text-ink-500">Kurs:</span>
                      <span className="font-semibold text-[#101828]">{d.course?.name}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-ink-500">Bo&apos;lim / Dars:</span>
                      <span className="font-semibold text-[#101828]">
                        {d.section?.name ?? d.lesson?.name}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-ink-500">To&apos;g&apos;ri / Jami:</span>
                      <span className="font-bold text-[#12b76a]">
                        {d.correctAnswers} / {d.totalQuestions}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-ink-500">Holat:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          passed
                            ? "bg-[#e6f9f0] text-[#12b76a]"
                            : "bg-[#fee4e2] text-[#f04438]"
                        }`}
                      >
                        {passed ? "O'tgan" : "O'tmagan"} ({d.percentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savollar va javoblar */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-bold text-[#101828]">
                    Savollar va javoblar tahlili ({d.details?.length ?? 0} ta savol)
                  </h4>

                  {!d.details || d.details.length === 0 ? (
                    <p className="text-xs text-ink-500">
                      Savollar bo&apos;yicha batafsil ma&apos;lumot saqlanmagan.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {d.details.map((item, idx) => (
                        <div
                          key={item.questionId || idx}
                          className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
                            item.isCorrect
                              ? "border-[#a6f4c5] bg-[#f6fef9]"
                              : "border-[#fecdca] bg-[#fffbfa]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold text-[#101828] text-sm">
                              {idx + 1}. {item.question}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                item.isCorrect
                                  ? "bg-[#e6f9f0] text-[#12b76a]"
                                  : "bg-[#fee4e2] text-[#f04438]"
                              }`}
                            >
                              {item.isCorrect ? "To'g'ri" : "Noto'g'ri"}
                            </span>
                          </div>

                          {item.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {(
                                [
                                  ["variantA", item.options.variantA],
                                  ["variantB", item.options.variantB],
                                  ["variantC", item.options.variantC],
                                  ["variantD", item.options.variantD],
                                ] as const
                              ).map(([key, optVal]) => {
                                if (!optVal) return null;
                                const isUserChoice = item.selectedAnswer === key;
                                const isCorrectChoice = item.correctAnswer === key;

                                let badgeStyle = "border-[#e4e7ec] bg-white text-[#344054]";
                                if (isCorrectChoice) {
                                  badgeStyle =
                                    "border-[#12b76a] bg-[#e6f9f0] text-[#12b76a] font-bold";
                                } else if (isUserChoice && !item.isCorrect) {
                                  badgeStyle =
                                    "border-[#f04438] bg-[#fee4e2] text-[#f04438] font-bold";
                                }

                                return (
                                  <div
                                    key={key}
                                    className={`flex items-center justify-between rounded-md border p-2.5 ${badgeStyle}`}
                                  >
                                    <span>
                                      {key.replace("variant", "")}) {optVal}
                                    </span>
                                    {isUserChoice && (
                                      <span className="text-[10px] uppercase tracking-wider text-ink-500">
                                        (Tanlangan)
                                      </span>
                                    )}
                                    {isCorrectChoice && !isUserChoice && (
                                      <span className="text-[10px] uppercase tracking-wider text-[#12b76a]">
                                        (To&apos;g&apos;ri javob)
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedResultId(null)}
                    className="h-9 rounded-lg border border-[#d0d5dd] bg-white px-4 text-xs font-semibold text-[#344054] hover:bg-slate-50"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            );
          })()
        )}
      </Modal>
    </div>
  );
}
