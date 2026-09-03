"use client";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className = "", label }: SpinnerProps) {
  const sizeMap = {
    sm: "size-4 border-2",
    md: "size-8 border-3",
    lg: "size-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div
          className={`rounded-full border-brand-500/20 ${sizeMap[size]}`}
        />
        <div
          className={`absolute inset-0 animate-spin rounded-full border-brand-500 border-t-transparent ${sizeMap[size]}`}
        />
      </div>
      {label && <p className="text-sm font-medium text-ink-500">{label}</p>}
    </div>
  );
}
