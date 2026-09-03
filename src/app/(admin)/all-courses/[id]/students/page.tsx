"use client";

import { use, useState } from "react";
import { AdminListLayout } from "@/components/layout/AdminListLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableEmpty, Td, Th } from "@/components/ui/Table";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { usePaymentsList } from "@/hooks/usePayments";
import { useCoursesList } from "@/hooks/useContent";
import { formatDateTime, formatPrice } from "@/lib/format";

/**
 * Figma: "Kursda qatnashuvchilar".
 *
 * Ma'lumot `GET /payments?courseId=` dan keladi — kursga to'lov qilganlar
 * ro'yxati. Dizayndagi "To'lov turi" ustuni chiqarilmadi: `PurchasedCourse`
 * modelida bunday maydon yo'q. O'rniga to'lov holati ko'rsatiladi.
 */
export default function CourseStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const courseId = Number(id);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  const { payments, meta, isLoading, isError, error } = usePaymentsList({
    page,
    limit,
    courseId,
  });

  /* Sarlavhada kurs nomini ko'rsatish uchun */
  const { courses } = useCoursesList({ page: 1, limit: 100 });
  const course = courses.find((item) => item.id === courseId);

  const allChecked = payments.length > 0 && selected.length === payments.length;

  return (
    <AdminListLayout
      title="Kursda qatnashuvchilar"
      breadcrumb={["Kurslar", course?.name ?? `#${courseId}`]}
      meta={meta}
      onPageChange={setPage}
      onLimitChange={(next) => {
        setLimit(next);
        setPage(1);
      }}
      search=""
      onSearch={() => {}}
      error={isError ? error : null}
      exportName="qatnashuvchilar"
      exportRows={payments.map((payment) => ({
        Ism: payment.user.full_name,
        "Telefon raqami": payment.user.phone,
        Narxi: formatPrice(payment.price),
        Holati: payment.status,
        "Yaratilgan vaqt": formatDateTime(payment.create_at),
      }))}
    >
      <Table>
        <thead>
          <tr>
            <Th width={48} align="center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={() =>
                  setSelected((prev) =>
                    prev.length === payments.length
                      ? []
                      : payments.map((p) => p.userId),
                  )
                }
                aria-label="Hammasini belgilash"
                className="size-4 cursor-pointer accent-brand-500"
              />
            </Th>
            <Th filterable>Ism</Th>
            <Th filterable>Telefon raqami</Th>
            <Th filterable>Narxi</Th>
            <Th width={140} filterable>
              Holati
            </Th>
            <Th width={200} sortable>
              Yaratilgan vaqt
            </Th>
          </tr>
        </thead>

        <tbody>
          {isLoading && <TableEmpty colSpan={6} message="Yuklanmoqda..." />}

          {!isLoading && payments.length === 0 && (
            <TableEmpty
              colSpan={6}
              message="Bu kursga hali hech kim yozilmagan"
            />
          )}

          {!isLoading &&
            payments.map((payment) => (
              <tr key={`${payment.userId}-${payment.courseId}`}>
                <Td align="center">
                  <input
                    type="checkbox"
                    checked={selected.includes(payment.userId)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(payment.userId)
                          ? prev.filter((item) => item !== payment.userId)
                          : [...prev, payment.userId],
                      )
                    }
                    aria-label={`${payment.user.full_name} ni belgilash`}
                    className="size-4 cursor-pointer accent-brand-500"
                  />
                </Td>

                <Td>
                  <span className="flex items-center gap-2.5">
                    <Avatar
                      fullName={payment.user.full_name}
                      file={payment.user.file}
                    />
                    <span className="truncate">{payment.user.full_name}</span>
                  </span>
                </Td>

                <Td>{payment.user.phone}</Td>
                <Td>{formatPrice(payment.price)}</Td>

                <Td>
                  <PaymentStatusBadge status={payment.status} />
                </Td>

                <Td>{formatDateTime(payment.create_at)}</Td>
              </tr>
            ))}
        </tbody>
      </Table>
    </AdminListLayout>
  );
}
