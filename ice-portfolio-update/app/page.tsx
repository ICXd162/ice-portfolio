import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { VideoWork } from "@/components/VideoWork";
import { DesignWork } from "@/components/DesignWork";
import { Process } from "@/components/Process";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { theme, type SectionId } from "@/lib/work";

// Section order and visibility come from the admin (หน้าแรก > ลำดับส่วนต่างๆ).
const SECTIONS: Record<SectionId, () => React.ReactNode> = {
  about: () => <About overlap={false} />,
  video: () => <VideoWork />,
  design: () => <DesignWork />,
  process: () => <Process />,
  stats: () => <Stats />,
  services: () => <Services />,
  testimonials: () => <Testimonials />,
  pricing: () => <Pricing />,
  contact: () => <Contact />,
  faq: () => <Faq />,
};

export default function Page() {
  const [first, ...rest] = theme.sections;
  // When About comes first it slides up over the pinned hero (large screens).
  const aboutFirst = first === "about";
  const after = aboutFirst ? rest : theme.sections;
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        {aboutFirst ? (
          <div className="relative">
            <div className="lg:sticky lg:top-0">
              <Hero />
            </div>
            <About />
          </div>
        ) : (
          <Hero />
        )}
        <div className="relative z-10 bg-ink">
          {after.map((id) => (
            <div key={id}>{SECTIONS[id]()}</div>
          ))}
        </div>
      </main>
      <div className="relative z-10 bg-ink">
        <Footer />
      </div>
    </>
  );
}
