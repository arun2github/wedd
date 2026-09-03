import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * A fast filter in front of the console — not the lock on the door.
 *
 * Named `proxy.ts` because Next 16 renamed `middleware.ts`; the behaviour is
 * the same file convention.
 *
 * This checks only that a session cookie is *present*. It does not validate
 * it, and it deliberately does not hit the database: the proxy runs on every
 * prefetch, and Next's own documentation says it "should not be used as a full
 * session management or authorization solution". A forged cookie gets past
 * this and is then rejected by `requireOperator()`, which is the real
 * boundary. What this buys is that a signed-out visitor lands on the sign-in
 * page instead of watching a protected page render and then redirect.
 */
export function proxy(request: NextRequest) {
  const hasCookie = getSessionCookie(request);
  if (hasCookie) return NextResponse.next();

  const signIn = new URL("/sign-in", request.url);
  /* Remember where they were headed so signing in doesn't dump them on a
     dashboard they didn't ask for. */
  signIn.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/admin/:path*"],
};
