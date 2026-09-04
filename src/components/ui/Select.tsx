import type { SelectHTMLAttributes } from "react";
import { ChevronDownSm } from "@/components/ui/icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
}

/** Input bilan bir xil ko'rinish, lekin ochiluvchi ro'yxat */
export function Select({
  label,
  error,
  id,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-page-fg">
            {label}
          </label>
        )}

        <div
          className={[
            "flex w-full items-center gap-2 rounded-md border bg-card px-4 py-[15px]",
            "transition-colors focus-within:border-brand-500",
            error ? "border-danger-500" : "border-line",
            className,
          ].join(" ")}
        >
          <select
            {...props}
            id={id}
            className="min-w-0 flex-1 appearance-none bg-transparent text-[15px] font-medium text-page-fg outline-none"
          >
            {children}
          </select>
          <ChevronDownSm />
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
