import { Heart, Mail, Share2 } from "lucide-react";
import { GoldDivider } from "@/components/ui/ornaments/GoldDivider";
import { formatWeddingDate } from "@/lib/format-date";

interface FooterProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
}

export function Footer({ brideName, groomName, weddingDate }: FooterProps) {
  const year = new Date(weddingDate).getFullYear();
  const dateLabel = formatWeddingDate(weddingDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="bg-ink py-12 text-surface">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
        <p className="font-display text-2xl">
          {brideName} <span className="font-script text-gilt-soft">&amp;</span> {groomName}
        </p>
        <p className="text-sm text-surface/70">{dateLabel}</p>
        <GoldDivider className="text-gilt-soft" />
        <div className="flex items-center gap-4">
          {/* CSS-only: two decorative icons don't justify a motion component. */}
          <a
            href="#"
            aria-label="Share this invitation"
            className="text-surface/70 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-gilt-soft focus-visible:-translate-y-0.5 focus-visible:text-gilt-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt"
          >
            <Share2 className="size-5" />
          </a>
          <a
            href="#"
            aria-label="Contact us by email"
            className="text-surface/70 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-gilt-soft focus-visible:-translate-y-0.5 focus-visible:text-gilt-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt"
          >
            <Mail className="size-5" />
          </a>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-surface/60">
          Made with <Heart className="size-3.5 fill-gilt-soft text-gilt-soft" /> for our
          wedding
        </p>
        <p className="text-xs text-surface/50">
          &copy; {year} {brideName} &amp; {groomName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
