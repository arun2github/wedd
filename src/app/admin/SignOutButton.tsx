"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await signOut();
        /* `refresh` as well as `push`: the session cookie is gone, but the
           router cache still holds the signed-in render of wherever we were. */
        router.push("/sign-in");
        router.refresh();
      }}
      className="rounded border border-rule px-2.5 py-1.5 text-ink-soft transition-colors hover:border-ink/30 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
