import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { IntroProvider } from "@/components/providers/IntroProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arun & Priya | Wedding Invitation",
  description:
    "Join us as we celebrate the union of Arun and Priya. View wedding events, our story, gallery, and RSVP.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // No `scroll-smooth` — native smooth scrolling fights Lenis.
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${inter.variable} h-full antialiased`}
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
        className="min-h-dvh flex flex-col bg-ivory text-charcoal font-sans"
      >
        <MotionProvider>
          <SmoothScrollProvider>
            <IntroProvider>{children}</IntroProvider>
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
