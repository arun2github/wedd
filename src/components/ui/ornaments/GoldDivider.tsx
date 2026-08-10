import { cn } from "@/lib/utils";

export function GoldDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      className={cn("h-4 w-24 text-gold", className)}
      fill="none"
      aria-hidden="true"
    >
      <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1" />
      <path
        d="M60 2 L66 8 L60 14 L54 8 Z"
        fill="currentColor"
      />
      <line x1="72" y1="8" x2="120" y2="8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
