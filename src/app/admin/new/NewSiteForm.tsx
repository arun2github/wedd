"use client";

import { useActionState, useState } from "react";
import { createSiteAction, type ActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  name: string;
  tradition: string;
  archetype: string;
  swatches: string[];
}

/** Turns "Priya" + "Aman" into "megha-arun" — the address a guest will type. */
function suggestSlug(bride: string, groom: string) {
  return [bride, groom]
    .map((n) => n.trim().toLowerCase().replace(/[^a-z0-9]+/g, ""))
    .filter(Boolean)
    .join("-");
}

export function NewSiteForm({ options }: { options: Option[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSiteAction,
    {}
  );
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  /* The slug follows the names until the operator types their own, at which
     point it stops moving under them. */
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [templateId, setTemplateId] = useState(options[0]?.id ?? "");

  const effectiveSlug = slugTouched ? slug : suggestSlug(bride, groom);
  const err = state.fieldErrors;

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="brideName">Bride&rsquo;s name</Label>
          <Input id="brideName" name="brideName" value={bride}
            onChange={(e) => setBride(e.target.value)} required autoFocus />
          {err?.brideName && <p className="text-xs text-destructive">{err.brideName[0]}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="groomName">Groom&rsquo;s name</Label>
          <Input id="groomName" name="groomName" value={groom}
            onChange={(e) => setGroom(e.target.value)} required />
          {err?.groomName && <p className="text-xs text-destructive">{err.groomName[0]}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Address</Label>
        <div className="flex items-center gap-0 overflow-hidden rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
          <span className="shrink-0 bg-surface-sunk px-3 py-2 font-mono text-xs text-ink-soft">
            /wedding/
          </span>
          <input
            id="slug" name="slug" value={effectiveSlug} required
            onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
            className="w-full bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        </div>
        <p className="text-xs text-ink-soft">
          This goes on the invitation, so it cannot be changed later without
          breaking every link already sent.
        </p>
        {err?.slug && <p className="text-xs text-destructive">{err.slug[0]}</p>}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium">Template</legend>
        <input type="hidden" name="templateId" value={templateId} />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                templateId === o.id ? "border-brand bg-brand/5" : "border-rule hover:border-ink/25"
              }`}
            >
              <input
                type="radio" name="template-choice" value={o.id}
                checked={templateId === o.id}
                onChange={() => setTemplateId(o.id)}
                className="sr-only"
              />
              <span className="flex shrink-0 gap-0.5" aria-hidden="true">
                {o.swatches.map((c, i) => (
                  <span key={i} className="size-4 rounded-full border border-ink/10" style={{ background: c }} />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{o.name}</span>
                <span className="block truncate text-xs text-ink-soft">{o.tradition} · {o.archetype}</span>
              </span>
            </label>
          ))}
        </div>
        {err?.templateId && <p className="text-xs text-destructive">{err.templateId[0]}</p>}
      </fieldset>

      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create site"}
      </Button>
    </form>
  );
}
