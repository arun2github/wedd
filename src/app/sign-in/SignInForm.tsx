"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup";

/**
 * One form, two modes.
 *
 * Signing in and creating an account are the same three fields plus a name,
 * and splitting them across two pages makes a couple who guessed wrong start
 * over. The toggle keeps whatever they have already typed.
 */
export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result =
      mode === "signup"
        ? await signUp.email({ email, password, name: String(form.get("name") ?? "") })
        : await signIn.email({ email, password });

    if (result.error) {
      /*
        Sign-in stays deliberately vague — naming which half was wrong confirms
        which addresses have accounts. Sign-up can be specific, because the
        person already knows the address they typed.
      */
      setError(
        mode === "signup"
          ? result.error.message ?? "That didn't work. Try a different email, or a longer password."
          : "That email and password don't match an account."
      );
      setBusy(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div>
      <div className="flex gap-1 rounded-full border border-ink/12 bg-card p-1">
        {(["signin", "signup"] as const).map((m2) => (
          <button
            key={m2}
            type="button"
            onClick={() => { setMode(m2); setError(null); }}
            aria-pressed={mode === m2}
            className={`relative flex-1 rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
              mode === m2 ? "text-linen" : "text-soft hover:text-ink"
            }`}
          >
            {mode === m2 && (
              /* One pill that slides between the two, rather than two that
                 cross-fade — the movement is what tells you they are a pair. */
              <m.span
                layoutId="auth-mode"
                className="absolute inset-0 rounded-full bg-sage"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              {m2 === "signin" ? "Sign in" : "Create account"}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
        <AnimatePresence initial={false}>
          {mode === "signup" && (
            <m.div
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pb-4">
                <Label htmlFor="name">Your names</Label>
                <Input id="name" name="name" placeholder="Priya & Aman" required={mode === "signup"} />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
          />
          {mode === "signup" && (
            <p className="text-xs text-soft">At least 8 characters.</p>
          )}
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={busy} className="mt-2 rounded-full bg-sage text-linen hover:bg-forest">
          {busy
            ? mode === "signup" ? "Creating your account…" : "Signing in…"
            : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
