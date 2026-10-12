"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { Play, ArrowUpRight, ArrowDown } from "@phosphor-icons/react";
import { Media } from "./Media";
import { SectionHead } from "./SectionHead";
import { Lightbox } from "./Lightbox";
import { videos, VIDEO_TYPES, type Video, type VideoType } from "@/lib/work";

// Layout family: tabbed grid. Each type gets the frame it was made for:
//   Short form -> 9:16 cards filtered by group, featured clips first
//   Long form / Motion graphics -> 16:9 cards, two across
// Videos hosted on the site and YouTube links play in a pop-up player; other links open in a new tab.
const PAGE: Record<VideoType, number> = { "Short form": 10, "Long form": 6, "Motion graphics": 6 };
const ALL = "All";

function VideoCard({ v, onPlay }: { v: Video; onPlay: (v: Video) => void }) {
  const vertical = v.type === "Short form";
  const inPage = Boolean(v.youtube || v.file);
  const preview = useRef<HTMLVideoElement>(null);
  // Muted preview on hover (mouse only). The file only starts loading once someone points at the card.
  const [hover, setHover] = useState(false);

  const inner = (
    <>
      <div className={`relative overflow-hidden rounded-[var(--radius-media)] bg-ink-3 ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        <Media
          src={v.cover}
          alt={v.title}
          sizes={vertical ? "(min-width: 1024px) 18vw, 45vw" : "(min-width: 768px) 46vw, 100vw"}
          className="h-full w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {v.file && hover && (
          <video
            ref={preview}
            src={v.file}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden
            onPlaying={(e) => (e.currentTarget.style.opacity = "1")}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200"
          />
        )}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {(inPage || v.videoUrl) && (
          <span
            aria-hidden
            className={`absolute text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-[color,transform] duration-200 ease-[var(--ease-out)] group-hover:scale-110 group-hover:text-white motion-reduce:transition-none ${
              vertical ? "bottom-3 left-3" : "bottom-4 left-4"
            }`}
          >
            {inPage ? <Play size={vertical ? 22 : 28} weight="fill" /> : <ArrowUpRight size={vertical ? 22 : 28} weight="bold" />}
          </span>
        )}
      </div>
      <div className="px-1 pt-3">
        <h3 lang="th" className={`line-clamp-2 leading-snug font-medium text-paper ${vertical ? "text-[15px]" : "text-[17px]"}`}>
          {v.title}
        </h3>
        {v.client && <p className="mt-1 text-sm text-mute">{v.client}</p>}
      </div>
    </>
  );
  const hoverProps = v.file
    ? {
        onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHover(true),
        onPointerLeave: () => setHover(false),
      }
    : {};
  if (inPage)
    return (
      <button onClick={() => onPlay(v)} {...hoverProps} className="group block w-full text-left" aria-label={`Play ${v.title}`}>
        {inner}
      </button>
    );
  if (v.videoUrl)
    return (
      <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`Watch ${v.title} (opens in a new tab)`}>
        {inner}
      </a>
    );
  return <div className="group">{inner}</div>;
}

const reveal = (reduce: boolean | null, i: number) =>
  ({
    initial: reduce ? false : { opacity: 0, transform: "translateY(20px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay: (i % 5) * 0.05, ease: EASE_OUT },
  }) as const;

export function VideoWork() {
  const reduce = useReducedMotion();
  const types = VIDEO_TYPES.filter((t) => videos.items.some((v) => v.type === t));
  const [tab, setTab] = useState<VideoType>(types[0] ?? "Short form");
  const [group, setGroup] = useState(ALL);
  const [shown, setShown] = useState(PAGE[tab]);
  const [playing, setPlaying] = useState<Video | null>(null);

  const vertical = tab === "Short form";
  const tabItems = useMemo(() => videos.items.filter((v) => v.type === tab), [tab]);
  // Short form: clips marked "featured" (ไฮไลต์) lead the grid; there is no separate row.
  const rest = useMemo(
    () => (vertical ? [...tabItems.filter((v) => v.featured), ...tabItems.filter((v) => !v.featured)] : tabItems),
    [vertical, tabItems],
  );
  const groups = useMemo(() => {
    const seen: string[] = [];
    for (const v of rest) if (v.group && !/^highlights?$/i.test(v.group) && !seen.includes(v.group)) seen.push(v.group);
    return seen;
  }, [rest]);
  const items = group === ALL ? rest : rest.filter((v) => v.group === group);
  const playable = items.filter((v) => v.youtube || v.file);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!playing) return;
      const i = playable.indexOf(playing);
      const next = playable[(i + dir + playable.length) % playable.length];
      if (next) setPlaying(next);
    },
    [playing, playable],
  );
  const close = useCallback(() => setPlaying(null), []);
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  if (!types.length) return null;
  const grid = vertical
    ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5"
    : "grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2";

  return (
    <section id="video" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SectionHead heading={videos.heading} intro={videos.intro}>
          {types.length > 1 && (
            <div role="tablist" aria-label="Video type" className="no-scrollbar mt-8 flex max-w-full gap-1 overflow-x-auto rounded-full bg-ink-2 p-1">
              {types.map((t) => {
                const on = t === tab;
                const count = videos.items.filter((v) => v.type === t).length;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={on}
                    aria-controls="video-panel"
                    onClick={() => {
                      setTab(t);
                      setGroup(ALL);
                      setShown(PAGE[t]);
                    }}
                    className={`relative h-11 shrink-0 rounded-full px-3.5 text-[13px] whitespace-nowrap sm:px-5 sm:text-sm transition-colors ${on ? "text-ink" : "text-mute hover:text-paper"}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="video-tab"
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                    <span className="relative">
                      {t} <span className={`hidden tabular-nums sm:inline ${on ? "text-mute-dark" : "text-mute/70"}`}>{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </SectionHead>

        <div id="video-panel" role="tabpanel" className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {groups.length > 1 && (
                <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                  {[ALL, ...groups].map((g) => {
                    const on = g === group;
                    const count = g === ALL ? rest.length : rest.filter((v) => v.group === g).length;
                    return (
                      <button
                        key={g}
                        aria-pressed={on}
                        onClick={() => {
                          setGroup(g);
                          setShown(PAGE[tab]);
                        }}
                        className={`h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors ${
                          on ? "bg-paper text-ink" : "bg-ink-2 text-mute hover:text-paper"
                        }`}
                      >
                        {g} <span className={`tabular-nums ${on ? "text-mute-dark" : "text-mute/70"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <ul className={grid}>
                {items.slice(0, shown).map((v, i) => (
                  <motion.li
                    key={`${group}-${v.cover}-${i}`}
                    className={!vertical && v.featured ? "md:col-span-2" : undefined}
                    {...reveal(reduce, i)}
                  >
                    <VideoCard v={v} onPlay={setPlaying} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {items.length > shown && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setShown((s) => s + PAGE[tab])}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-2 px-6 text-[15px] text-paper transition-colors hover:bg-ink-3 active:scale-[0.97]"
              >
                Show more <span className="tabular-nums text-mute">{items.length - shown}</span>
                <ArrowDown size={14} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={Boolean(playing)}
        onClose={close}
        onPrev={playable.length > 1 ? prev : undefined}
        onNext={playable.length > 1 ? next : undefined}
        label={playing ? `Playing ${playing.title}` : "Video player"}
        caption={
          playing && (
            <div>
              <p lang="th" className="truncate text-[17px] font-medium">{playing.title}</p>
              {(playing.client || playing.group) && <p className="text-sm text-mute">{playing.client || playing.group}</p>}
            </div>
          )
        }
      >
        {playing && (playing.file || playing.youtube) && (
          <div
            className={
              playing.type === "Short form"
                ? "aspect-[9/16] h-[min(78dvh,calc((100vw-2rem)*16/9))]"
                : "aspect-video w-[min(92vw,calc(78dvh*16/9),1280px)]"
            }
          >
            {playing.file ? (
              <video
                key={playing.file}
                src={playing.file}
                poster={playing.cover}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="h-full w-full rounded-[var(--radius-media)] bg-black object-contain"
              />
            ) : (
              <iframe
                key={playing.youtube}
                src={`https://www.youtube-nocookie.com/embed/${playing.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={playing.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full rounded-[var(--radius-media)] bg-black"
              />
            )}
          </div>
        )}
      </Lightbox>
    </section>
  );
}
