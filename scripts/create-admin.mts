import "dotenv/config";
import { betterAuth } from "better-auth";
import { authOptions } from "../src/lib/auth-config";

/**
 * Creates an operator account.
 *
 * Public sign-up is disabled, so this script is the only way an account comes
 * to exist. It builds its own Better Auth instance with `disableSignUp` turned
 * off — an explicit, local override rather than a hole in the deployed config,
 * because the caller already has a shell on this machine and the database
 * credentials.
 *
 * It goes through the library's sign-up endpoint rather than inserting into
 * `user` and `account` directly: password hashing, account linkage and field
 * shape are Better Auth's business, and a hand-rolled INSERT would be a second
 * implementation that diverges the first time the library changes.
 *
 *   npm run admin:create -- "Full Name" you@example.com 'a-long-password'
 */
const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error("Usage: npm run admin:create -- \"Full Name\" email@example.com 'password'");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const auth = betterAuth({
  ...authOptions,
  emailAndPassword: { ...authOptions.emailAndPassword, disableSignUp: false },
});

try {
  const result = await auth.api.signUpEmail({ body: { name, email, password } });
  console.log("Operator account created:", result.user.email);
  console.log("Sign in at /sign-in");
} catch (error) {
  console.error("Could not create the account:", error instanceof Error ? error.message : error);
  process.exit(1);
}
