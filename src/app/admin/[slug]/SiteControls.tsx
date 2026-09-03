"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publishAction, setTemplateAction, unpublishAction } from "../actions";

interface Props {
  slug: string;
  live: boolean;
  isPublished: boolean;
  previewToken: string;
  templateId: string;
  templates: { id: string; name: string; archetype: string }[];
}

/**
 * Publish state, the preview link, and the template switch.
 *
 * Grouped in one component because they are one decision in practice: an
 * operator switches a template, looks at the preview, and publishes when it
 * reads right.
 */
export function SiteControls({ slug, live, isPublished, previewToken, templateId, templates }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-rule p-5">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${live ? "bg-brand" : "bg-ink-soft/40"}`} />
          <h2 className="font-medium">{live ? "Live" : isPublished ? "Unpublished" : "Draft"}</h2>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {live
            ? "Guests can open this site and reply to it."
            : isPublished
              ? "Taken off the web. The last published version is kept, so publishing again restores it."
              : "Not published yet. Only people with the preview link can see it."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {live ? (
            <button
              type="button" disabled={pending}
              onClick={() => run(() => unpublishAction(slug))}
              className="rounded-lg border border-rule px-3.5 py-2 text-sm transition-colors hover:border-ink/30 disabled:opacity-60"
            >
              {pending ? "Working…" : "Unpublish"}
            </button>
          ) : (
            <button
              type="button" disabled={pending}
              onClick={() => run(() => publishAction(slug))}
              className="rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              {pending ? "Publishing…" : "Publish"}
            </button>
          )}
          {live && (
            <Link
              href={`/wedding/${slug}`} target="_blank"
              className="rounded-lg border border-rule px-3.5 py-2 text-sm transition-colors hover:border-ink/30"
            >
              View live site
            </Link>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </section>

      <section className="rounded-xl border border-rule p-5">
        <h2 className="font-medium">Preview link</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Share this with the couple. It shows the draft, works before
          publishing, and search engines are told to ignore it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/preview/${previewToken}`} target="_blank"
            className="rounded-lg border border-rule px-3.5 py-2 text-sm transition-colors hover:border-ink/30"
          >
            Open preview
          </Link>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(`${window.location.origin}/preview/${previewToken}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="rounded-lg border border-rule px-3.5 py-2 text-sm transition-colors hover:border-ink/30"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-rule p-5 lg:col-span-2">
        <h2 className="font-medium">Template</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Switching keeps everything the couple has written. Only the design changes.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id} type="button" disabled={pending || t.id === templateId}
              onClick={() => run(() => setTemplateAction(slug, t.id))}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                t.id === templateId
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-rule hover:border-ink/30 disabled:opacity-60"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
