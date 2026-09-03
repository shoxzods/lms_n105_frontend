"use client";

import Image from "next/image";
import { useState } from "react";
import { avatarUrl } from "@/lib/format";

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Backend `file` ustunida rasm nomini saqlaydi.
 * Rasm ochilmasa (hali statik fayllar ulanmagan) — bosh harflar ko'rsatiladi.
 */
export function Avatar({
  fullName,
  file,
  size = 32,
}: {
  fullName: string;
  file: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const src = avatarUrl(file);

  if (!src || failed) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-[#e0e7ff] text-xs font-semibold text-page-fg"
      >
        {initials(fullName)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
