import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/** Better Auth's own endpoints: sign-in, sign-out, session. Everything under
 *  `/api/auth/*` is handled by the library, not by us. */
export const { GET, POST } = toNextJsHandler(auth.handler);
