import { Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Button } from "./Button";
import { pricing } from "@/lib/work";

// Layout family: package columns. Hidden until packages are added in the admin.
export function Pricing() {
  if (!pricing.plans.length) return null;
  const cols = pricing.plans.length >= 3 ? "lg:grid-cols-3" : pricing.plans.length === 2 ? "md:grid-cols-2" : "";
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={pricing.heading} intro={pricing.intro} />
        <ul className={`mx-auto mt-14 grid max-w-[64rem] grid-cols-1 gap-4 md:gap-5 ${cols}`}>
          {pricing.plans.map((p, i) => (
            <Reveal
              key={p.name}
              as="li"
              delay={i * 0.08}
              className={`flex flex-col rounded-[var(--radius-card)] p-7 ${p.highlighted ? "bg-accent text-white" : "bg-ink-2"}`}
            >
              <h3 className="text-xl font-medium">{p.name}</h3>
              {p.description && <p className={`mt-2 text-[15px] ${p.highlighted ? "text-white/80" : "text-mute"}`}>{p.description}</p>}
              <p className="mt-6 text-5xl font-medium tracking-[-0.04em] tabular-nums">
                {p.price}
                {p.period && <span className={`ml-1 text-lg ${p.highlighted ? "text-white/80" : "text-mute"}`}>/{p.period}</span>}
              </p>
              {p.features.length > 0 && (
                <ul className="mt-6 grid gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px]">
                      <Check size={18} weight="bold" className={`mt-0.5 shrink-0 ${p.highlighted ? "text-white" : "text-accent"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 pt-2">
                <Button href="#contact" variant={p.highlighted ? "light" : "accent"}>
                  Book a project
                </Button>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
