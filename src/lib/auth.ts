import "server-only";
import { betterAuth } from "better-auth";
import { authOptions } from "@/lib/auth-config";

/**
 * The auth instance the app uses.
 *
 * Configuration lives in `auth-config.ts`; this module exists to hold the
 * `server-only` guard, so an accidental import from a client component fails
 * the build rather than shipping session internals to the browser.
 */
export const auth = betterAuth(authOptions);
