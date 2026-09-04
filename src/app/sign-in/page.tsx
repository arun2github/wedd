import { BRAND, pageTitle } from "@/lib/brand";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal";
import { getTemplate } from "@/lib/templates";
import { demoWeddingContent } from "@/data/wedding-data";
import { TemplatePoster } from "@/components/marketing/TemplatePoster";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: pageTitle("Sign in"),
  description: "Sign in, or create an account and start building your wedding website.",
};

/**
 * Where to send someone after they sign in.
 *
 * `next` arrives in a query string, which anyone can write, so it is treated
 * as untrusted: only a same-site absolute path gets through. Without this,
 * `/sign-in?next=https://evil.example` turns our own sign-in page into an open
 * redirect — a credible phishing hop, because the link genuinely starts on the
 * real domain.
 */
function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!/^\/(?!\/|\\)/.test(value)) return "/";
  return value;
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  if (await getSession()) redirect("/");
  const { next } = await searchParams;

  const { brideName, groomName, heroPhoto } = demoWeddingContent.couple;
  const showcase = getTemplate("malabar");

  return (
    <div className="grid min-h-dvh bg-linen font-sans text-ink [--body-face:var(--font-jost)] [--display-face:var(--font-cormorant)] lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:py-14">
        <Link href="/" className="font-mark text-3xl leading-none">{BRAND}</Link>

        <div className="mx-auto w-full max-w-sm py-14">
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em]">
            Start your
            <br />
            wedding website.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-soft">
            Build it free and share a private link with your family. You only
            pay when you publish.
          </p>

          <div className="mt-9">
            <SignInForm next={safeNext(next)} />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-soft">
          By continuing you agree to our terms. We&rsquo;ll only email you about
          your own website.
        </p>
      </div>

      {/*
        The other half is the product, not decoration: a real design rendered
        in its own palette and face. Someone signing up to build a wedding
        website should be looking at one while they do it.
      */}
      <div className="relative hidden items-center justify-center bg-sage p-14 lg:flex">
        <div className="w-full max-w-sm">
          <TemplatePoster
            template={showcase}
            photo={heroPhoto}
            brideName={brideName}
            groomName={groomName}
            className="rounded-xl aspect-[3/4] shadow-2xl"
          />
          <p className="mt-6 text-center text-sm text-linen/75">
            {showcase.name} — one of the designs
          </p>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-16 size-64 rounded-t-full border border-linen/15"
        />
      </div>
    </div>
  );
}
