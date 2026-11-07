import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "quiet";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  // The single action colour. Used for the one thing we want pressed.
  primary:
    "bg-accent text-ink-inverse hover:bg-accent-hover disabled:bg-line-strong disabled:text-ink-faint",
  secondary:
    "border border-line-strong bg-paper text-ink hover:bg-surface disabled:text-ink-faint disabled:hover:bg-paper",
  quiet:
    "text-ink-muted hover:text-ink hover:bg-surface disabled:text-ink-faint disabled:hover:bg-transparent",
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-control px-3.5 py-2",
        "text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        className,
      ].join(" ")}
    />
  );
}
