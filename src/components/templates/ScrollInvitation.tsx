import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CurtainLoader } from "@/components/loader/CurtainLoader";
import { EnvelopeIntro } from "@/components/sections/EnvelopeIntro";
import { Countdown } from "@/components/sections/Countdown";
import { CoupleSection } from "@/components/sections/CoupleSection";
import { OurStory } from "@/components/sections/OurStory";
import { WeddingEvents } from "@/components/sections/WeddingEvents";
import { Venue } from "@/components/sections/Venue";
import { Gallery } from "@/components/sections/Gallery";
import { WeddingVideo } from "@/components/sections/WeddingVideo";
import { FamilySection } from "@/components/sections/FamilySection";
import { RSVP } from "@/components/sections/RSVP";
import { FinalInvitation } from "@/components/sections/FinalInvitation";
import type { WeddingData } from "@/types/wedding";

/**
 * The `scroll` archetype: full-bleed cinematic sections that arrive one at a
 * time, the page falling past the reader.
 *
 * This is a *page architecture*, not a template. Royal Ivory, Genda Raat and
 * Kanjeevaram all render through it and look nothing like each other, because
 * their grounds, palettes and faces differ — the archetype only decides how
 * the page is composed, never how it is painted. Colour arrives from the
 * variables `TemplateTheme` puts on an ancestor.
 *
 * It takes data and renders it. It does not fetch, and it does not know what a
 * tenant is.
 */
export function ScrollInvitation({ data }: { data: WeddingData }) {
  return (
    <>
      <CurtainLoader
        brideName={data.couple.brideName}
        groomName={data.couple.groomName}
        poster="/envelope/sealed.jpg"
      />
      <Navbar brideName={data.couple.brideName} groomName={data.couple.groomName} />
      <main className="flex-1">
        {/* The opening, as one shot: the envelope clip plays itself, the camera
            dives into its mouth, and the invitation grows out of it to fill the
            screen — and only then does the page unlock. The hero lives *inside*
            this section — it is the thing the envelope contains — so it isn't
            rendered separately here. */}
        <EnvelopeIntro
          couple={data.couple}
          weddingDate={data.weddingDate}
          invitationMessage={data.invitationMessage}
        />
        <Countdown weddingDate={data.weddingDate} />
        <CoupleSection couple={data.couple} />
        <OurStory story={data.story} />
        <WeddingEvents events={data.events} />
        <Venue venue={data.venue} />
        <Gallery gallery={data.gallery} />
        {data.video && <WeddingVideo video={data.video} />}
        <FamilySection families={data.families} />
        <RSVP rsvp={data.rsvp} />
        <FinalInvitation couple={data.couple} weddingDate={data.weddingDate} />
      </main>
      <Footer
        brideName={data.couple.brideName}
        groomName={data.couple.groomName}
        weddingDate={data.weddingDate}
      />
    </>
  );
}
