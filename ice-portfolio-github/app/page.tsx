import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ShortForm } from "@/components/ShortForm";
import { LongForm } from "@/components/LongForm";
import { MotionBento } from "@/components/MotionBento";
import { Stills } from "@/components/Stills";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ShortForm />
        <LongForm />
        <MotionBento />
        <Stills />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
