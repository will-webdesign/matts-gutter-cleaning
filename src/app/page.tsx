import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { WhyChoose } from "@/components/marketing/WhyChoose";
import { Pricing } from "@/components/marketing/Pricing";
import { WhyClean } from "@/components/marketing/WhyClean";
import { Reviews } from "@/components/marketing/Reviews";
import { Gallery } from "@/components/marketing/Gallery";
import { Process } from "@/components/marketing/Process";
import { Areas } from "@/components/marketing/Areas";
import { FAQ } from "@/components/marketing/FAQ";
import { Contact } from "@/components/marketing/Contact";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { faqSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Services />
        <WhyChoose />
        <Pricing />
        <WhyClean />
        <Reviews />
        <Gallery />
        <Process />
        <Areas />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
