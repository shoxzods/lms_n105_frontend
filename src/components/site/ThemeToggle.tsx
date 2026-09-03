"use client";

import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { useThemeStore } from "@/store/theme";

/** Figma: navbardagi 56px dumaloq tugma (376:37059) */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const init = useThemeStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
      className={`flex size-14 items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800 ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
