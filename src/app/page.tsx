import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { ZohoEcosystem } from "@/components/sections/ZohoEcosystem";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { ResumeBand } from "@/components/sections/ResumeBand";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { CharacterStage } from "@/character/CharacterStage";
import { InteractiveNetwork } from "@/effects/InteractiveNetwork";
import { CustomCursor } from "@/effects/CustomCursor";
import { ScrollProgress } from "@/effects/ScrollProgress";

/**
 * CHINMAI SAGAR — premium personal developer website.
 *
 * Composition (P1 content architecture):
 *   Hero → About → Experience → Zoho → Stack → Projects → Resume → Contact
 *
 * Enhancement layers (P4–P5), all failure-tolerant:
 *   network canvas · custom cursor · scroll progress · SVG character guide
 */
export default function Home() {
  return (
    <>
      <InteractiveNetwork />
      <ScrollProgress />
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Experience />
        <ZohoEcosystem />
        <TechStack />
        <Projects />
        <ResumeBand />
        <Contact />
      </main>

      <Footer />

      {/* the guide — mounts last, fails silently, never blocks content */}
      <CharacterStage />
    </>
  );
}
