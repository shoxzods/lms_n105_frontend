import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page-bg px-6 text-center">
      <p className="text-6xl font-bold text-brand-500">404</p>

      <div className="flex max-w-[520px] flex-col gap-2">
        <h1 className="text-2xl font-bold text-page-fg">Sahifa topilmadi</h1>
        <p className="text-[15px] font-medium text-ink-500">
          Siz izlagan sahifa mavjud emas yoki ko&rsquo;chirilgan.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white"
        >
          Bosh sahifa
        </Link>

        <Link
          href="/courses"
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-page-fg"
        >
          Kurslar
        </Link>
      </div>
    </div>
  );
}
