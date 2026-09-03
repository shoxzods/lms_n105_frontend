import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-card text-page-fg border border-line hover:bg-hover",
  ghost: "bg-transparent text-ink-500 hover:bg-hover",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Figma dagi login tugmasi: to'liq yumaloq (50px) */
  pill?: boolean;
  leftIcon?: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  pill = false,
  leftIcon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        "flex h-12 items-center justify-center gap-2.5 px-5 py-3",
        "text-sm font-medium leading-[1.45] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        pill ? "rounded-[50px]" : "rounded-lg",
        VARIANTS[variant],
        className,
      ].join(" ")}
    >
      {leftIcon}
      {children}
    </button>
  );
}
