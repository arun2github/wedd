import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import type { BetterAuthOptions } from "better-auth";
import { prisma } from "@/lib/prisma";

/**
 * Auth configuration, deliberately separate from the instance.
 *
 * `auth.ts` is `server-only`, which is the right guard for a module holding
 * session logic — and which also means nothing outside a Next runtime can
 * import it, including the CLI that creates the first operator account. So the
 * options live here and the guarded instance is built next door. The
 * alternative was a second copy of this config in the script, which is the
 * kind of duplication that is correct on the day it is written and wrong three
 * months later.
 */
export const authOptions = {
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    /*
      Registration is open, so a couple can start a site themselves.

      This is only safe because `role` exists: every account created here is a
      `customer`, and `requireOperator` checks the column before letting anyone
      near the console. `npm run admin:create` is still the only way an
      operator account comes to exist.
    */
    disableSignUp: false,
    /* Eight, not twelve. Twelve is right for the handful of people who
       administer the platform; it is a wall in front of a couple signing up to
       look at wedding designs. */
    minPasswordLength: 8,
  },
  session: {
    /* A week, refreshed daily: long enough to build a site over several
       evenings without being logged out mid-edit. */
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  /* Must be last. It lets Better Auth set cookies from server actions, which
     is how sign-in completes without a client-side fetch. */
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;
