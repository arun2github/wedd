import { getTemplate, paletteVars, fontVars } from "@/lib/templates";
import type { CSSProperties, ReactNode } from "react";

/**
 * Scopes a template's colour *and* type identity to its subtree.
 *
 * The palette arrives as inline custom properties rather than a stylesheet
 * class, and that is the point: a stylesheet would mean every new template
 * needs a CSS edit and a deploy, which no admin panel can perform. As
 * variables, the whole catalogue is a data table — and a bespoke palette for
 * one tenant later costs nothing structurally.
 *
 * It works at all because no component reads a colour variable directly; every
 * one of the ~200 palette usages in the sections goes through a Tailwind
 * utility, and each of those compiles to `var(--role)`. Redefining the roles
 * here therefore repaints the entire tree, including the shadcn form controls,
 * which alias the same variables.
 */
export function TemplateTheme({
  templateId,
  colorwayId,
  children,
  /* Defaults to a full page shell. The gallery overrides it to scope a
     template's identity to a single card, so each one is shown in its own
     colours and its own face rather than described in someone else's. */
  className = "flex min-h-dvh flex-1 flex-col bg-surface text-ink",
}: {
  templateId: string;
  colorwayId?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const template = getTemplate(templateId, colorwayId);

  return (
    <div
      data-template={template.id}
      data-archetype={template.archetype}
      /* The default className re-applies `bg-surface`/`text-ink` rather than
         inheriting them. The body is painted from `:root`, so without that the
         page behind the sections would stay the default template's cream while
         the sections went dark. */
      className={className}
      style={{ ...paletteVars(template), ...fontVars(template.fonts) } as CSSProperties}
    >
      {children}
    </div>
  );
}
