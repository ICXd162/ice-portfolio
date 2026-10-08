"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Media } from "./Media";
import { Reveal } from "./Reveal";
import { MaybeLink } from "./MaybeLink";
import { shortForm } from "@/lib/work";

const { categories } = shortForm;

// Layout family: tabbed horizontal scroll-snap rail.
export function ShortForm() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = categories[Math.min(active, categories.length - 1)];
  if (!current) return null;

  return (
    <section id="short-form" className="scroll-mt-16 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
            {shortForm.heading}
          </h2>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mute">
            {shortForm.intro}
          </p>
        </Reveal>

        <div role="tablist" aria-label="Short form categories" className="mt-12 flex gap-8 overflow-x-auto no-scrollbar">
          {categories.map((c, ci) => {
            const selected = ci === active;
            return (
              <button
                key={`${c.label}-${ci}`}
                role="tab"
                aria-selected={selected}
                aria-controls="short-rail"
                onClick={() => setActive(ci)}
                className={`relative pb-3 text-[15px] whitespace-nowrap transition-colors ${
                  selected ? "text-paper" : "text-mute hover:text-paper"
                }`}
              >
                {c.label}
                {selected && (
                  <motion.span
                    layoutId="short-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-line" />
      </div>

      <div id="short-rail" role="tabpanel" className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={active}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:gap-6 md:px-8 xl:px-[max(2rem,calc((100vw-1400px)/2+2rem))]"
          >
            {current.items.map((item, i) => (
              <li key={`${item.image}-${i}`} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[26vw] lg:w-[18vw] xl:w-[220px]">
                <MaybeLink href={item.videoUrl} label={`Watch ${current.label} short ${i + 1}`}>
                <Media
                  src={item.image}
                  alt={`${current.label} short, clip ${i + 1}`}
                  sizes="(min-width: 1280px) 220px, (min-width: 768px) 26vw, 62vw"
                  className="aspect-[9/16] w-full"
                  imgClassName="transition-transform duration-700 hover:scale-[1.04] motion-reduce:transition-none"
                />
                </MaybeLink>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
