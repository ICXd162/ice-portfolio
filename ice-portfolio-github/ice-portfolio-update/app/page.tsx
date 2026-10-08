import { Nav } from "@/components/Nav";
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
      <Nav />
      <main>
        <Hero />
        <About />
        <Works />
        <Process />
        <Stats />
        <Services />
        <Testimonials />
        <Pricing />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
