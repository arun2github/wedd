"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side auth. Used for sign-in and sign-out only.
 *
 * Nothing in the console decides what to *render* from this client. Every
 * authorisation check happens on the server in `requireOperator()`, because a
 * check that runs in the browser is a suggestion, not a boundary.
 */
export const authClient = createAuthClient();
export const { signIn, signUp, signOut, useSession } = authClient;
