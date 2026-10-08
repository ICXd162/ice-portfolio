import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Works } from "@/components/Works";
import { Process } from "@/components/Process";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        {/* On large screens the hero stays pinned while the About card slides up over it. */}
        <div className="relative">
          <div className="lg:sticky lg:top-0">
            <Hero />
          </div>
          <About />
        </div>
        <div className="relative z-10 bg-ink">
          <Works />
          <Process />
          <Stats />
          <Services />
          <Testimonials />
          <Pricing />
          <Contact />
          <Faq />
        </div>
      </main>
      <div className="relative z-10 bg-ink">
        <Footer />
      </div>
    </>
  );
}
