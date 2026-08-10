/**
 * Every date on this page is formatted in the timezone the wedding actually
 * happens in, not the reader's.
 *
 * Two things go wrong otherwise. A bare `"2027-02-14"` parses as UTC midnight,
 * so `toLocaleDateString` renders it as Feb 13 anywhere west of Greenwich — the
 * whole of the Americas would see every event a day early. And because these
 * strings are server-rendered then hydrated, a UTC server disagreeing with a
 * UTC+11 browser is a genuine hydration mismatch, not just a wrong label.
 *
 * Pinning the zone fixes both: the output is identical on the server, in the
 * browser, and for a guest reading from any timezone in the world.
 */
const WEDDING_TIME_ZONE = "Asia/Kolkata";

export function formatWeddingDate(
  date: string,
  options: Intl.DateTimeFormatOptions
): string {
  return new Date(date).toLocaleDateString("en-US", {
    ...options,
    timeZone: WEDDING_TIME_ZONE,
  });
}
