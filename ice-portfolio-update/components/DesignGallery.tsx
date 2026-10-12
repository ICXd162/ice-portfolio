"use client";
import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { MagnifyingGlassPlus, ArrowUpRight, Images } from "@phosphor-icons/react";
import { Media } from "./Media";
import { SectionHead } from "./SectionHead";
import { Lightbox } from "./Lightbox";
import { DESIGN_FRAMES, type Design } from "@/lib/work";
import { parseCrop } from "@/lib/crop";

type Item = Design & { dims: { w: number; h: number } | null };

// Layout family: filterable masonry. Every piece keeps its real proportions
// (wide banners, square posts, tall posters), and opens full size in a viewer.
export function DesignGallery({ heading, intro, items }: { heading: string; intro: string; items: Item[] }) {
  const reduce = useReducedMotion();
  const types = useMemo(() => Array.from(new Set(items.map((d) => d.type))), [items]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const shown = useMemo(() => (filter === "All" ? items : items.filter((d) => d.type === filter)), [filter, items]);

  // A project with an "images" list opens as its own slideshow; single pieces step through the gallery.
  const current = open !== null ? shown[open] : null;
  const pages = current ? (current.images.length ? current.images : [current.image]) : [];
  const isProject = pages.length > 1;
  const count = isProject ? pages.length : shown.length;
  const index = isProject ? page : (open ?? 0);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => {
    if (isProject) setPage((p) => (p - 1 + pages.length) % pages.length);
    else setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
  }, [isProject, pages.length, shown.length]);
  const next = useCallback(() => {
    if (isProject) setPage((p) => (p + 1) % pages.length);
    else setOpen((i) => (i === null ? i : (i + 1) % shown.length));
  }, [isProject, pages.length, shown.length]);
  const openAt = (i: number) => { setPage(0); setOpen(i); };

  return (
    <section id="design" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={heading} intro={intro}>
          {types.length > 1 && (
            <div role="group" aria-label="Filter by type" className="no-scrollbar mt-8 flex max-w-full gap-2 overflow-x-auto">
              {["All", ...types].map((t) => {
                const on = t === filter;
                return (
                  <button
                    key={t}
                    aria-pressed={on}
                    onClick={() => setFilter(t)}
                    className={`h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors ${
                      on ? "bg-paper text-ink" : "bg-ink-2 text-mute hover:text-paper"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </SectionHead>

        <ul className="mt-12 columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
          {shown.map((d, i) => (
            <motion.li
              key={`${filter}-${d.image}-${i}`}
              initial={reduce ? false : { opacity: 0, transform: "translateY(20px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.05, ease: EASE_OUT }}
              className="mb-3 break-inside-avoid md:mb-4"
            >
              <button
                onClick={() => openAt(i)}
                className="group relative block w-full overflow-hidden rounded-[var(--radius-media)] bg-ink-2 text-left"
                aria-label={`View ${d.title} full size`}
              >
                {DESIGN_FRAMES[d.frame] || d.dims ? (
                  <div style={{ aspectRatio: DESIGN_FRAMES[d.frame] ?? `${d.dims!.w} / ${d.dims!.h}` }}>
                    <Media
                      src={d.image}
                      alt={d.title}
                      sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 48vw"
                      className="h-full w-full"
                      imgClassName="transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={parseCrop(d.image).url} alt={d.title} loading="lazy" className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
                )}
                {d.images.length > 1 && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur-sm">
                    <Images size={13} weight="fill" /> {d.images.length}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="min-w-0">
                    <span lang="th" className="block truncate text-sm font-medium text-white">{d.title}</span>
                    <span className="block truncate text-xs text-white/70">{d.type}{d.client ? ` · ${d.client}` : ""}</span>
                  </span>
                  <MagnifyingGlassPlus size={18} className="shrink-0 text-white" />
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <Lightbox
        open={current !== null}
        onClose={close}
        onPrev={count > 1 ? prev : undefined}
        onNext={count > 1 ? next : undefined}
        label={current ? current.title : "Image viewer"}
        caption={
          current && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p lang="th" className="text-[17px] font-medium">{current.title}</p>
              <p className="text-sm text-mute">
                {current.type}
                {current.client ? ` · ${current.client}` : ""}
                <span className="ml-3 tabular-nums">
                  {index + 1} of {count}
                </span>
              </p>
              {current.link && (
                <a href={current.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                  Open project <ArrowUpRight size={12} weight="bold" />
                </a>
              )}
            </div>
          )
        }
      >
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={pages[page] ?? current.image} src={parseCrop(isProject ? pages[page] : current.image).url} alt={current.title} className="max-h-[80dvh] max-w-[min(92vw,1400px)] rounded-[var(--radius-media)] object-contain" />
        )}
        {isProject && (
          // Warm the next page so stepping through a project feels instant.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pages[(page + 1) % pages.length]} alt="" aria-hidden className="hidden" />
        )}
      </Lightbox>
    </section>
  );
}
