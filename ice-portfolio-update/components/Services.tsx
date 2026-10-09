import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { BeforeAfter } from "./BeforeAfter";
import { ServiceTabs } from "./ServiceTabs";
import { services } from "@/lib/work";

// Services, split into Video and Graphic design tabs that advance on their own every 10 seconds.
export function Services() {
  if (!services.items.length) return null;
  const groups = [
    { id: "video" as const, label: services.videoLabel, items: services.items.filter((s) => s.category === "video") },
    { id: "design" as const, label: services.designLabel, items: services.items.filter((s) => s.category === "design") },
  ].filter((g) => g.items.length);

  return (
    <section id="services" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={services.heading} intro={services.intro} />
        <ServiceTabs groups={groups} />
        {services.beforeImage && services.afterImage && (
          <Reveal className="mt-5">
            <BeforeAfter before={services.beforeImage} after={services.afterImage} title={services.beforeAfterTitle || "Before and after"} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
