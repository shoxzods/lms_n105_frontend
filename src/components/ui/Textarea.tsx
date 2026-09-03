import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requiredMark?: boolean;
  error?: string | null;
}

/** `Input` bilan bir xil ko'rinish, lekin ko'p qatorli */
export function Textarea({
  label,
  requiredMark = false,
  error,
  id,
  className = "",
  rows = 3,
  ...props
}: TextareaProps) {
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
            "w-full rounded-md border bg-card px-4 py-3",
            "transition-colors focus-within:border-brand-500",
            error ? "border-danger-500" : "border-line",
            className,
          ].join(" ")}
        >
          <textarea
            {...props}
            id={id}
            rows={rows}
            className="w-full resize-none bg-transparent text-[15px] font-medium text-page-fg outline-none placeholder:text-ink-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-danger-500">{error}</p>
      )}
    </div>
  );
}
