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
    <footer className="bg-charcoal py-12 text-ivory">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
        <p className="font-display text-2xl">
          {brideName} <span className="font-script text-gold-light">&amp;</span> {groomName}
        </p>
        <p className="text-sm text-ivory/70">{dateLabel}</p>
        <GoldDivider className="text-gold-light" />
        <div className="flex items-center gap-4">
          {/* CSS-only: two decorative icons don't justify a motion component. */}
          <a
            href="#"
            aria-label="Share this invitation"
            className="text-ivory/70 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-gold-light focus-visible:-translate-y-0.5 focus-visible:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <Share2 className="size-5" />
          </a>
          <a
            href="#"
            aria-label="Contact us by email"
            className="text-ivory/70 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-gold-light focus-visible:-translate-y-0.5 focus-visible:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <Mail className="size-5" />
          </a>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-ivory/60">
          Made with <Heart className="size-3.5 fill-gold-light text-gold-light" /> for our
          wedding
        </p>
        <p className="text-xs text-ivory/50">
          &copy; {year} {brideName} &amp; {groomName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
