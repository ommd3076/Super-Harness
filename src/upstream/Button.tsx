import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet";
type ButtonSize = "xs" | "sm" | "md";

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const sizeClass = size === "xs" ? "h-7 px-2.5 text-[12px]" : size === "sm" ? "h-[27px] px-3 text-[13px]" : "px-4 py-[9px] text-sm";
  const toneClass = variant === "primary" || variant === "accent" || variant === "success"
    ? "bg-ink text-canvas hover:opacity-85"
    : variant === "ghost" || variant === "quiet"
      ? "text-ink-2 hover:bg-hover"
      : "bg-surface text-ink shadow-btn hover:bg-inset";
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-[transform,background-color,opacity] duration-150 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 ${sizeClass} ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}
