"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page-bg px-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-[#fef3f2] text-4xl">
        ⚠️
      </span>

      <div className="flex max-w-[520px] flex-col gap-2">
        <h1 className="text-2xl font-bold text-page-fg">
          Kutilmagan xatolik yuz berdi
        </h1>
        <p className="text-[15px] font-medium text-ink-500">
          Sahifani qayta yuklab ko&rsquo;ring. Muammo takrorlansa, backend
          ishlab turganini tekshiring.
        </p>

        {error.digest && (
          <p className="text-xs text-ink-500">Xato kodi: {error.digest}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Qayta urinish
        </button>

        <Link
          href="/"
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-page-fg"
        >
          Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
