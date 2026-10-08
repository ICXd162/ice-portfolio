"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "@phosphor-icons/react";
import { Media } from "./Media";
import { Reveal } from "./Reveal";
import { longForm, youtubeId, ytThumb, ytUrl } from "@/lib/work";

const videos = longForm.videos.map((v) => {
  const id = youtubeId(v.youtubeUrl);
  return {
    ...v,
    href: id ? ytUrl(id) : v.youtubeUrl,
    thumb: v.thumbnail || (id ? ytThumb(id) : ""),
  };
});

// Layout family: interactive index list driving a large preview frame.
export function LongForm() {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const featured = videos[Math.min(idx, videos.length - 1)];
  if (!featured) return null;

  return (
    <section id="long-form" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 className="max-w-[20ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
            {longForm.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-video"
              aria-label={`Watch on YouTube: ${featured.title}`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={featured.href}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Media
                    src={featured.thumb}
                    alt={featured.title}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="h-full w-full"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-110 group-active:scale-95 motion-reduce:transition-none">
                <Play size={22} weight="fill" />
              </span>
            </a>
          </Reveal>

          <ul className="divide-y divide-line self-center lg:col-span-5">
            {videos.map((item, i) => {
              const on = i === idx;
              return (
                <li key={`${item.href}-${i}`}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setIdx(i)}
                    onFocus={() => setIdx(i)}
                    className="group flex items-start justify-between gap-6 py-6"
                  >
                    <div>
                      <p
                        lang="th"
                        className={`font-[family-name:var(--font-thai-stack)] text-lg leading-snug transition-colors md:text-xl ${
                          on ? "text-paper" : "text-mute group-hover:text-paper"
                        }`}
                      >
                        {item.title}
                      </p>
                      {item.subtitle && <p className="mt-1.5 text-sm text-mute">{item.subtitle}</p>}
                    </div>
                    <ArrowUpRight
                      size={20}
                      className={`mt-1 shrink-0 transition-all duration-300 ${
                        on ? "text-accent" : "text-mute"
                      } group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
