import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Figma: majburiy maydon labelidan keyin qizil yulduzcha */
  requiredMark?: boolean;
  /** Maydonning o'ng tomonidagi ikonka (Figma: 16x16 quti) */
  rightSlot?: ReactNode;
  error?: string | null;
}

export function Input({
  label,
  requiredMark = false,
  rightSlot,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-page-fg">
            {label}
            {requiredMark && <span className="text-danger-500"> *</span>}
          </label>
        )}

        <div
          className={[
            "flex w-full items-center justify-between gap-2 rounded-md border bg-card px-4 py-[15px]",
            "transition-colors focus-within:border-brand-500",
            error ? "border-danger-500" : "border-line",
            className,
          ].join(" ")}
        >
          <input
            {...props}
            id={id}
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-page-fg outline-none placeholder:text-ink-500"
          />
          {rightSlot && <span className="shrink-0">{rightSlot}</span>}
        </div>
      </div>

      {error && (
        <p className="text-[15px] font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
