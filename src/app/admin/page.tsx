import Link from "next/link";
import { listTenants } from "@/lib/dal";
import { getTemplate } from "@/lib/templates";

export const metadata = { title: "Sites" };

/* Rendered per request: the console must never show a cached list of who is
   published. */
export const dynamic = "force-dynamic";

function StatusPill({ published, status }: { published: boolean; status: string }) {
  /* Two facts, not one. A site can be ACTIVE with nothing published, and a
     single badge would hide that — which is exactly the state an operator most
     needs to notice before telling a customer they are live. */
  const live = published && status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        live ? "bg-brand/10 text-brand" : "bg-surface-sunk text-ink-soft"
      }`}
    >
      <span className={`size-1.5 rounded-full ${live ? "bg-brand" : "bg-ink-soft/50"}`} />
      {live ? "Live" : published ? "Unpublished" : "Draft"}
    </span>
  );
}

export default async function AdminSitesPage() {
  const tenants = await listTenants();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Sites</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {tenants.length === 0
              ? "No sites yet."
              : `${tenants.length} ${tenants.length === 1 ? "site" : "sites"}.`}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          New site
        </Link>
      </div>

      {tenants.length === 0 ? (
        /* An empty screen is an instruction, not a shrug. */
        <div className="mt-10 rounded-xl border border-dashed border-rule px-6 py-16 text-center">
          <p className="font-display text-xl">Build the first site</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Pick a template and give the couple an address. You can share a
            preview link straight away and keep editing after.
          </p>
          <Link
            href="/admin/new"
            className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-surface hover:bg-brand-deep"
          >
            New site
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunk text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Couple</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Address</th>
                <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Template</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">RSVPs</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-t border-rule transition-colors hover:bg-surface-sunk/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/${t.slug}`} className="font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand">
                      {t.coupleNames ?? <span className="text-ink-soft">Not started</span>}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">/wedding/{t.slug}</td>
                  <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">{getTemplate(t.templateId).name}</td>
                  <td className="px-4 py-3"><StatusPill published={t.isPublished} status={t.status} /></td>
                  <td className="px-4 py-3 text-right tabular-nums">{t.rsvpCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
