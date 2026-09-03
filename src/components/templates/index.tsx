import { getTemplate } from "@/lib/templates";
import { TemplateTheme } from "./TemplateTheme";
import { ScrollInvitation } from "./ScrollInvitation";
import { ProgramInvitation } from "./ProgramInvitation";
import { ScreenInvitation } from "./ScreenInvitation";
import { AlbumInvitation } from "./AlbumInvitation";
import { PatrikaInvitation } from "./PatrikaInvitation";
import { PanelInvitation } from "./PanelInvitation";
import { CardInvitation } from "./CardInvitation";
import { IntroProvider } from "@/components/providers/IntroProvider";
import type { WeddingData } from "@/types/wedding";

/**
 * Renders a tenant's site through whichever template it has chosen.
 *
 * One entry point for both public and preview routes, so a draft is composed
 * by exactly the code that will serve it once published — a preview that
 * renders through a different path is a preview of something else.
 */

/*
  Archetype → component, and whether it opens with the cinematic intro.

  `scroll` opens with the curtain and the envelope film. `program` is a printed
  order of service and has neither — which matters beyond looks: `IntroProvider`
  holds the page still until something calls `finishLoading`, and the only thing
  that does is the curtain. An archetype without a curtain must therefore mount
  already finished, or it would lock scrolling forever.

  All four are now genuinely built. No design falls back to another's layout,
  so "a different template" finally means a different page rather than the same
  page repainted.
*/
const ARCHETYPES = {
  scroll: { Component: ScrollInvitation, hasIntro: true },
  program: { Component: ProgramInvitation, hasIntro: false },
  screen: { Component: ScreenInvitation, hasIntro: false },
  album: { Component: AlbumInvitation, hasIntro: false },
  patrika: { Component: PatrikaInvitation, hasIntro: false },
  panel: { Component: PanelInvitation, hasIntro: false },
  card: { Component: CardInvitation, hasIntro: false },
} as const;

export function WeddingSite({
  data,
  templateId,
  colorwayId,
  /* The catalogue sets this. A real invitation never does — the opening *is*
     the invitation there. */
  skipIntro = false,
}: {
  data: WeddingData;
  templateId: string;
  colorwayId?: string | null;
  skipIntro?: boolean;
}) {
  const template = getTemplate(templateId, colorwayId);
  const { Component: Archetype, hasIntro } = ARCHETYPES[template.archetype];

  return (
    <TemplateTheme templateId={template.id} colorwayId={colorwayId}>
      {/* The intro lives here rather than in the root layout: it belongs to a
          wedding site, not to the app. The storefront and the console share
          neither its curtain nor its scroll lock. */}
      <IntroProvider initialPhase={skipIntro || !hasIntro ? "done" : "loading"}>
        <Archetype data={data} />
      </IntroProvider>
    </TemplateTheme>
  );
}
