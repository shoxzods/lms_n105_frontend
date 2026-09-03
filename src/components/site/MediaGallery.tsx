"use client";

import Image from "next/image";
import { useState } from "react";
import { GALLERY_IMAGES, GALLERY_PAGE_SIZE } from "@/constants/about";

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M13 8H3M6.5 4.5L3 8l3.5 3.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
    </svg>
  );
}

export function MediaGallery() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(GALLERY_IMAGES.length / GALLERY_PAGE_SIZE),
  );

  const shown = GALLERY_IMAGES.slice(
    (page - 1) * GALLERY_PAGE_SIZE,
    page * GALLERY_PAGE_SIZE,
  );

  const top = shown.slice(0, 3);
  const bottom = shown.slice(3, 5);

  if (GALLERY_IMAGES.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        Galereyaga hali rasm qo&rsquo;shilmagan.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((name) => (
          <span
            key={name}
            className="relative h-[135px] overflow-hidden rounded-lg bg-hover"
          >
            <Image
              src={`/images/gallery/${name}`}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </span>
        ))}
      </div>

      {bottom.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {bottom.map((name) => (
            <span
              key={name}
              className="relative h-[225px] overflow-hidden rounded-lg bg-hover"
            >
              <Image
                src={`/images/gallery/${name}`}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </span>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-page-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft />
            Ortga
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  n === page
                    ? "bg-brand-500 text-white"
                    : "text-ink-500 hover:bg-hover"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-page-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Keyingi
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
