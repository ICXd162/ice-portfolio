"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, ArrowUpRight } from "@phosphor-icons/react";
import { Media } from "./Media";
import { ParallaxMedia } from "./ParallaxMedia";
import { SectionHead } from "./SectionHead";
import { MaybeLink } from "./MaybeLink";
import { works, workCategories, type Work } from "@/lib/work";

const PAGE = 8;

function Card({ w }: { w: Work }) {
  return (
    <MaybeLink
      href={w.videoUrl}
      label={`Watch ${w.title}`}
      className="group h-full rounded-[var(--radius-card)] bg-ink-2 p-3 transition-colors hover:bg-ink-3"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-ink-3">
        {w.orientation === "portrait" ? (
          <>
            {/* Vertical work: blurred fill behind the full 9:16 frame so nothing is cropped. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.cover} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl" />
            <div className="absolute inset-y-0 left-1/2 aspect-[9/16] -translate-x-1/2 py-4">
              <Media
                src={w.cover}
                alt={w.title}
                sizes="(min-width: 768px) 20vw, 45vw"
                className="h-full w-full rounded-[10px]"
                imgClassName="transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
          </>
        ) : (
          <ParallaxMedia src={w.cover} alt={w.title} sizes="(min-width: 768px) 48vw, 100vw" className="h-full w-full" strength={6} />
        )}
        {w.videoUrl && (
          <span className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Play size={16} weight="fill" />
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 pt-4 pb-1">
        <h3 lang="th" className="min-w-0 text-[17px] leading-snug font-medium text-paper">
          {w.title}
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {[w.category, ...w.tags.filter((t) => t !== w.category)].slice(0, 2).map((t) => (
            <li key={t} className="rounded-full bg-ink-3 px-3 py-1 text-xs whitespace-nowrap text-mute group-hover:bg-ink">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </MaybeLink>
  );
}

// Layout family: filter pills + two-column card grid with progressive "show more".
export function Works() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [shown, setShown] = useState(PAGE);
  const items = useMemo(
    () => (filter === "All" ? works.items : works.items.filter((w) => w.category === filter)),
    [filter],
  );
  if (!works.items.length) return null;
  const filters = ["All", ...workCategories];

  return (
    <section id="work" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={works.heading} intro={works.intro}>
          {filters.length > 2 && (
            <div role="tablist" aria-label="Filter work" className="no-scrollbar mt-8 flex max-w-full gap-2 overflow-x-auto">
              {filters.map((f) => {
                const on = f === filter;
                return (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setFilter(f);
                      setShown(PAGE);
                    }}
                    className={`h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors ${
                      on ? "bg-paper text-ink" : "bg-ink-2 text-mute hover:text-paper"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          )}
        </SectionHead>

        <motion.ul layout={!reduce} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <AnimatePresence initial={false} mode="popLayout">
            {items.slice(0, shown).map((w) => (
              <motion.li
                key={`${w.title}-${w.cover}`}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card w={w} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {items.length === 0 && (
          <p className="mt-12 text-center text-mute">Nothing in this category yet. Try another filter.</p>
        )}

        {items.length > shown && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShown((s) => s + PAGE)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-2 px-6 text-[15px] text-paper transition-colors hover:bg-ink-3 active:scale-[0.97]"
            >
              Show more work
              <ArrowUpRight size={14} weight="bold" className="rotate-90" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
