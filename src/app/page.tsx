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
import { weddingData } from "@/data/wedding-data";

export default function Home() {
  return (
    <>
      <CurtainLoader
        brideName={weddingData.couple.brideName}
        groomName={weddingData.couple.groomName}
        poster="/envelope/sealed.jpg"
      />
      <Navbar brideName={weddingData.couple.brideName} groomName={weddingData.couple.groomName} />
      <main className="flex-1">
        {/* The opening, as one shot: the envelope clip plays itself, the camera
            dives into its mouth, and the invitation grows out of it to fill the
            screen — and only then does the page unlock. The hero lives *inside*
            this section — it is the thing the envelope contains — so it isn't
            rendered separately here. */}
        <EnvelopeIntro
          couple={weddingData.couple}
          weddingDate={weddingData.weddingDate}
          invitationMessage={weddingData.invitationMessage}
        />
        <Countdown weddingDate={weddingData.weddingDate} />
        <CoupleSection couple={weddingData.couple} />
        <OurStory story={weddingData.story} />
        <WeddingEvents events={weddingData.events} />
        <Venue venue={weddingData.venue} />
        <Gallery gallery={weddingData.gallery} />
        <WeddingVideo video={weddingData.video} />
        <FamilySection families={weddingData.families} />
        <RSVP rsvp={weddingData.rsvp} />
        <FinalInvitation couple={weddingData.couple} weddingDate={weddingData.weddingDate} />
      </main>
      <Footer
        brideName={weddingData.couple.brideName}
        groomName={weddingData.couple.groomName}
        weddingDate={weddingData.weddingDate}
      />
    </>
  );
}
