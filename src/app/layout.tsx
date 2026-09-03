import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

/**
 * Platform-level fallback only.
 *
 * This used to name one couple, which was right while the project *was* one
 * couple's invitation and became a bug the moment a second tenant existed —
 * every site would have shipped with someone else's name in the tab and in the
 * pasted link preview. Tenant routes now override all of it from their own
 * content through `generateMetadata`; what remains here is what a route with
 * no tenant behind it shows, which today means the 404.
 */
export const metadata: Metadata = {
  title: "Wedding Invitations",
  description: "Beautiful wedding websites for the celebrations that deserve one.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // No `scroll-smooth` — native smooth scrolling fights Lenis.
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
    >
      {/*
        `min-h-dvh`, not `min-h-full`: Lenis sets `html.lenis body { height: auto }`,
        which collapses a percentage-based min-height and drops the sticky footer.

        `suppressHydrationWarning` because extensions inject attributes here before
        React hydrates — ColorZilla's `cz-shortcut-listen`, Grammarly's `data-gr-*`
        — and the resulting mismatch is noise the app can't prevent. It applies one
        level deep only: this element's own attributes. Anything we actually render
        inside is still checked.
      */}
      <body
        suppressHydrationWarning
        className="min-h-dvh flex flex-col bg-surface text-ink font-sans"
      >
        <MotionProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
