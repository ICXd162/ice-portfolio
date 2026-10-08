import { Media } from "./Media";
import { Reveal } from "./Reveal";
import { MaybeLink } from "./MaybeLink";
import { stills } from "@/lib/work";
import { imageDims } from "@/lib/image-dims";

// Layout family: masonry (CSS columns, natural aspect ratios, no fixed row height).
export function Stills() {
  if (!stills.items.length) return null;
  const items = stills.items.map((s) => ({ ...s, dims: imageDims(s.image) }));
  return (
    <section id="stills" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
            {stills.heading}
          </h2>
          {stills.intro && <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mute">{stills.intro}</p>}
        </Reveal>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 md:gap-5 lg:columns-3">
          {items.map((s, i) => (
            <Reveal key={`${s.image}-${i}`} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid md:mb-5" as="figure">
              <MaybeLink href={s.link} label={s.alt || "Open project"} className="group relative w-full overflow-hidden">
                {s.dims ? (
                  <div style={{ aspectRatio: `${s.dims.w} / ${s.dims.h}` }} className="w-full">
                    <Media
                      src={s.image}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                ) : (
                  // Size unknown at build time (external link): show at natural height.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={s.alt}
                    loading="lazy"
                    className="block h-auto w-full bg-ink-3 transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                )}
              </MaybeLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
