import { Reveal } from "./Reveal";
import { Media } from "./Media";
import { SectionHead } from "./SectionHead";
import { testimonials } from "@/lib/work";

// Layout family: masonry quote cards. Hidden until real client quotes are added in the admin.
export function Testimonials() {
  if (!testimonials.items.length) return null;
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={testimonials.heading} />
        <div className="mt-14 columns-1 gap-4 md:columns-2 md:gap-5 lg:columns-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={(i % 3) * 0.06} as="figure" className="mb-4 break-inside-avoid rounded-[var(--radius-card)] bg-ink-2 p-6 md:mb-5">
              <blockquote className="text-[17px] leading-relaxed text-paper">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.photo && <Media src={t.photo} alt="" sizes="44px" className="h-11 w-11 shrink-0 rounded-full" />}
                <div>
                  <p className="text-[15px] font-medium text-paper">{t.name}</p>
                  {t.role && <p className="text-sm text-mute">{t.role}</p>}
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
