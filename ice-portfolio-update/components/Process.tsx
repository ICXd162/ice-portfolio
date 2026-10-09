import { ParallaxMedia } from "./ParallaxMedia";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { workflow } from "@/lib/work";

// Layout family: three-up step cards (a real sequence, so order is shown with a step count).
export function Process() {
  if (!workflow.steps.length) return null;
  const cols = workflow.steps.length >= 3 ? "md:grid-cols-3" : workflow.steps.length === 2 ? "md:grid-cols-2" : "";
  return (
    <section id="process" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={workflow.heading} intro={workflow.intro} />
        <ol className={`mt-14 grid grid-cols-1 gap-4 md:gap-5 ${cols}`}>
          {workflow.steps.map((s, i) => (
            <Reveal key={s.title} as="li" delay={Math.min(i, 4) * 0.08} className="flex flex-col rounded-[var(--radius-card)] bg-ink-2 p-3">
              <div className="flex items-start justify-between gap-4 px-3 pt-3">
                <h3 className="text-2xl font-medium tracking-[-0.03em]">{s.title}</h3>
                <span className="rounded-full bg-ink-3 px-3 py-1 text-xs text-mute tabular-nums">
                  Step {i + 1} of {workflow.steps.length}
                </span>
              </div>
              <p className="mt-3 mb-6 px-3 text-[15px] leading-relaxed text-mute">{s.body}</p>
              {s.image && (
                <ParallaxMedia src={s.image} alt="" sizes="(min-width: 768px) 30vw, 100vw" className="mt-auto aspect-[16/10] w-full rounded-[var(--radius-media)]" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
