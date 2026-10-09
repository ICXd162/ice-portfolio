"use client";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, ArrowUpRight, ArrowDown } from "@phosphor-icons/react";
import { Media } from "./Media";
import { SectionHead } from "./SectionHead";
import { Lightbox } from "./Lightbox";
import { videos, VIDEO_TYPES, type Video, type VideoType } from "@/lib/work";

// Layout family: tabbed grid. Each type gets the frame it was made for:
//   Short form -> 9:16 cards, four across
//   Long form / Motion graphics -> 16:9 cards, two across
// YouTube links play in a pop-up player; other links open in a new tab.
const PAGE: Record<VideoType, number> = { "Short form": 8, "Long form": 6, "Motion graphics": 6 };

function VideoCard({ v, onPlay }: { v: Video; onPlay: (v: Video) => void }) {
  const vertical = v.type === "Short form";
  const playable = Boolean(v.youtube || v.videoUrl);
  const inner = (
    <>
      <div className={`relative overflow-hidden rounded-[var(--radius-media)] bg-ink-3 ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        <Media
          src={v.cover}
          alt={v.title}
          sizes={vertical ? "(min-width: 1024px) 22vw, 45vw" : "(min-width: 768px) 46vw, 100vw"}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {playable && (
          <span
            aria-hidden
            className={`absolute flex items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none ${
              vertical ? "bottom-3 left-3 h-10 w-10" : "bottom-4 left-4 h-12 w-12"
            }`}
          >
            {v.youtube ? <Play size={vertical ? 14 : 18} weight="fill" /> : <ArrowUpRight size={vertical ? 14 : 18} weight="bold" />}
          </span>
        )}
      </div>
      <div className="px-1 pt-3">
        <h3 lang="th" className={`leading-snug font-medium text-paper ${vertical ? "text-[15px]" : "text-[17px]"}`}>
          {v.title}
        </h3>
        {v.client && <p className="mt-1 text-sm text-mute">{v.client}</p>}
      </div>
    </>
  );
  if (v.youtube)
    return (
      <button onClick={() => onPlay(v)} className="group block w-full text-left" aria-label={`Play ${v.title}`}>
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

export function VideoWork() {
  const reduce = useReducedMotion();
  const types = VIDEO_TYPES.filter((t) => videos.items.some((v) => v.type === t));
  const [tab, setTab] = useState<VideoType>(types[0] ?? "Short form");
  const [shown, setShown] = useState(PAGE[tab]);
  const [playing, setPlaying] = useState<Video | null>(null);
  const items = useMemo(() => videos.items.filter((v) => v.type === tab), [tab]);
  const youtubeItems = items.filter((v) => v.youtube);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!playing) return;
      const i = youtubeItems.indexOf(playing);
      const next = youtubeItems[(i + dir + youtubeItems.length) % youtubeItems.length];
      if (next) setPlaying(next);
    },
    [playing, youtubeItems],
  );
  const close = useCallback(() => setPlaying(null), []);
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  if (!types.length) return null;
  const vertical = tab === "Short form";

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
                      setShown(PAGE[t]);
                    }}
                    className={`relative h-11 shrink-0 rounded-full px-3.5 text-[13px] whitespace-nowrap sm:px-5 sm:text-sm transition-colors ${on ? "text-ink" : "text-mute hover:text-paper"}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="video-tab"
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
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
            <motion.ul
              key={tab}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={
                vertical
                  ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5"
                  : "grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2"
              }
            >
              {items.slice(0, shown).map((v, i) => (
                <motion.li
                  key={`${v.cover}-${i}`}
                  className={v.featured ? (vertical ? "col-span-2 row-span-2" : "md:col-span-2") : undefined}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoCard v={v} onPlay={setPlaying} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {items.length > shown && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setShown((s) => s + PAGE[tab])}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-2 px-6 text-[15px] text-paper transition-colors hover:bg-ink-3 active:scale-[0.97]"
              >
                Show more {tab.toLowerCase()}
                <ArrowDown size={14} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={Boolean(playing)}
        onClose={close}
        onPrev={youtubeItems.length > 1 ? prev : undefined}
        onNext={youtubeItems.length > 1 ? next : undefined}
        label={playing ? `Playing ${playing.title}` : "Video player"}
        caption={
          playing && (
            <div>
              <p lang="th" className="truncate text-[17px] font-medium">{playing.title}</p>
              {playing.client && <p className="text-sm text-mute">{playing.client}</p>}
            </div>
          )
        }
      >
        {playing?.youtube && (
          <div
            className={
              playing.type === "Short form"
                ? "aspect-[9/16] h-[min(78dvh,calc((100vw-2rem)*16/9))]"
                : "aspect-video w-[min(92vw,calc(78dvh*16/9),1280px)]"
            }
          >
            <iframe
              key={playing.youtube}
              src={`https://www.youtube-nocookie.com/embed/${playing.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full rounded-[var(--radius-media)] bg-black"
            />
          </div>
        )}
      </Lightbox>
    </section>
  );
}
