/**
 * The brand, in one place.
 *
 * It was pasted into fourteen files — six page titles, the header, the footer,
 * the sign-in panel and two more — which is how a rename ends up half-done and
 * a site ships with two names on it. Everything reads from here now.
 */

/**
 * The name, everywhere: wordmark, page titles, prose.
 *
 * Small `e`, capital `N`. There were briefly two constants — a lower-case mark
 * and a capitalised prose form — but they now hold the same string, and two
 * constants with one value is how they drift apart later. One name, one place.
 */
export const BRAND = "eNimantaran";

/** The address. Used where a domain is what the reader wants: the footer line,
 *  and anywhere the site refers to itself as a place rather than as a name. */
export const BRAND_DOMAIN = "enimantaran.com";

/** `<title>` for a marketing page. Keeps every tab consistently suffixed. */
export function pageTitle(page: string): string {
  return `${page} — ${BRAND}`;
}
