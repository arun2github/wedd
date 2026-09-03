import { cn } from "@/lib/utils";

interface CornerFlourishProps {
  className?: string;
  /** Rotates the motif to sit in a different corner. */
  rotate?: 0 | 90 | 180 | 270;
}

/** A restrained mandala-inspired corner motif — used sparingly per section. */
export function CornerFlourish({ className, rotate = 0 }: CornerFlourishProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-16 w-16 text-gilt/60", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4 C 4 40, 4 60, 40 60"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M4 4 C 40 4, 60 4, 60 40"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="4" cy="4" r="3" fill="currentColor" />
      <circle cx="40" cy="60" r="2" fill="currentColor" />
      <circle cx="60" cy="40" r="2" fill="currentColor" />
      <path
        d="M14 14 C 14 30, 14 40, 30 40"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.6"
      />
    </svg>
  );
}
