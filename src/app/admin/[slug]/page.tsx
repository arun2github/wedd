import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantForOperator, listRsvps } from "@/lib/dal";
import { getTemplate, listTemplates } from "@/lib/templates";
import { SiteControls } from "./SiteControls";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/admin/[slug]">) {
  const { slug } = await params;
  const site = await getTenantForOperator(slug);
  return { title: site?.draft ? `${site.draft.couple.brideName} & ${site.draft.couple.groomName}` : "Site" };
}

export default async function AdminSitePage({ params }: PageProps<"/admin/[slug]">) {
  const { slug } = await params;
  const site = await getTenantForOperator(slug);
  if (!site) notFound();

  const rsvps = await listRsvps(slug);
  const template = getTemplate(site.templateId);
  const live = site.isPublished && site.status === "ACTIVE";
  const attending = rsvps.filter((r) => r.attending);
  const headcount = attending.reduce((n, r) => n + r.guestCount, 0);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm text-ink-soft underline-offset-4 hover:underline">
        ← Sites
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            {site.draft ? `${site.draft.couple.brideName} & ${site.draft.couple.groomName}` : slug}
          </h1>
          <p className="mt-1 font-mono text-xs text-ink-soft">/wedding/{site.slug}</p>
        </div>
      </div>

      <SiteControls
        slug={site.slug}
        live={live}
        isPublished={site.isPublished}
        previewToken={site.previewToken}
        templateId={site.templateId}
        templates={listTemplates().map((t) => ({ id: t.id, name: t.name, archetype: t.archetype }))}
      />

      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-2">
          <h2 className="font-display text-xl">Responses</h2>
          {rsvps.length > 0 && (
            <p className="text-sm text-ink-soft">
              {attending.length} attending · {headcount} {headcount === 1 ? "guest" : "guests"} ·{" "}
              {rsvps.length - attending.length} declined
            </p>
          )}
        </div>

        {rsvps.length === 0 ? (
          <p className="mt-6 text-sm text-ink-soft">
            {live
              ? "No responses yet. They'll appear here as guests reply."
              : "Guests can reply once the site is published."}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-rule">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-surface-sunk text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Guest</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Contact</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Reply</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Party</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r) => (
                  <tr key={r.id} className="border-t border-rule align-top">
                    <td className="px-4 py-3">
                      <span className="font-medium">{r.guestName}</span>
                      {r.message && <p className="mt-1 max-w-xs text-xs text-ink-soft">{r.message}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft">
                      <span className="block">{r.email}</span>
                      <span className="block">{r.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={r.attending ? "text-brand" : "text-ink-soft"}>
                        {r.attending ? "Attending" : "Declined"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.attending ? r.guestCount : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-soft">
                      {r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-10 text-xs text-ink-soft">
        Template: {template.name} · created{" "}
        {site.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </main>
  );
}
