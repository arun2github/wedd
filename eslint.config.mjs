import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma's generated client. Not ours to lint, and re-created on every
    // `prisma generate`.
    "src/generated/**",
  ]),
  {
    /*
      Tenant isolation, enforced by the linter rather than by reviewer memory.

      Every tenant-owned row carries a `tenantId`, but that only isolates
      anything if no query can be written without one. `src/lib/dal.ts` resolves
      a tenant before it touches a table; anywhere else, `prisma` is an unscoped
      handle on every tenant's data at once. So the client is reachable from two
      files and no others: the singleton that constructs it, and the layer that
      scopes it.

      This is the mitigation for the obvious failure mode — one hurried route
      handler calling `prisma.rsvpResponse.findMany()` without a `where`, which
      leaks every couple's guest list and looks perfectly normal in review.

      `auth-config.ts` is the third exemption: Better Auth owns the user, session and
      account tables outright and manages them itself, so routing it through a
      tenant-scoped layer would be pretence rather than safety.
    */
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/dal.ts", "src/lib/prisma.ts", "src/lib/auth-config.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/prisma",
              message:
                "The Prisma client is unscoped. Go through src/lib/dal.ts, which resolves a tenant first.",
            },
          ],
          patterns: [
            {
              group: ["@/generated/prisma", "@/generated/prisma/*"],
              message:
                "Import types and queries through src/lib/dal.ts rather than constructing a second Prisma client.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
