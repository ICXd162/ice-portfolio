import { ParallaxMedia } from "./ParallaxMedia";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { BeforeAfter } from "./BeforeAfter";
import { services } from "@/lib/work";

// Layout family: service cards on a 6-column grid. First two cards are wide, the rest share a row,
// so any count from 1 to 5+ fills the grid without gaps.
function spanFor(i: number, n: number) {
  if (n === 1) return "md:col-span-6";
  if (i < 2) return "md:col-span-3";
  const rest = n - 2;
  const pos = i - 2;
  const lastRow = rest % 3;
  const inLast = pos >= rest - lastRow;
  if (lastRow === 1 && inLast) return "md:col-span-6";
  if (lastRow === 2 && inLast) return "md:col-span-3";
  return "md:col-span-2";
}

export function Services() {
  if (!services.items.length) return null;
  const n = services.items.length;
  return (
    <section id="services" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={services.heading} intro={services.intro} />
        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {services.items.map((s, i) => (
            <Reveal key={s.title} as="li" delay={(i % 3) * 0.08} className={`flex flex-col rounded-[var(--radius-card)] bg-ink-2 p-3 ${spanFor(i, n)}`}>
              {s.image && (
                <ParallaxMedia
                  src={s.image}
                  alt=""
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className={`w-full rounded-[var(--radius-media)] ${i < 2 ? "aspect-[16/9]" : "aspect-[16/10]"}`}
                />
              )}
              <div className="px-3 pt-5 pb-3">
                <h3 className="text-xl font-medium tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-mute">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        {services.beforeImage && services.afterImage && (
          <Reveal className="mt-5">
            <BeforeAfter before={services.beforeImage} after={services.afterImage} title={services.beforeAfterTitle || "Before and after"} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
