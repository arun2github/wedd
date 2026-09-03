import Link from "next/link";
import { listTemplates } from "@/lib/templates";
import { NewSiteForm } from "./NewSiteForm";

export const metadata = { title: "New site" };

export default function NewSitePage() {
  /* The picker needs name, id and palette only — passing whole template
     objects would ship every blurb and every hex to the browser for the eleven
     the operator does not choose. */
  const options = listTemplates().map((t) => ({
    id: t.id,
    name: t.name,
    tradition: t.tradition,
    archetype: t.archetype,
    swatches: [t.palette.surface, t.palette.brand, t.palette.gilt],
  }));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm text-ink-soft underline-offset-4 hover:underline">
        ← Sites
      </Link>
      <h1 className="mt-4 font-display text-3xl">New site</h1>
      <p className="mt-2 max-w-lg text-sm text-ink-soft">
        Enough to get a previewable site in front of the couple. Everything
        else — their story, photos, events — is edited after.
      </p>
      <NewSiteForm options={options} />
    </main>
  );
}
