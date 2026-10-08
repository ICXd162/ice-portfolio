"use client";
import { motion, useReducedMotion } from "motion/react";
import { Media } from "./Media";
import { Button } from "./Button";
import { site } from "@/lib/work";

const ease = [0.16, 1, 0.3, 1] as const;

// Full-bleed warm gradient hero: copy left, portrait center, two work tiles right,
// optional client logo strip along the bottom.
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(110% 80% at 72% 18%, #ff5a2e 0%, #e2391b 22%, #8f1e0c 48%, #2a0c06 72%, #101010 100%)",
      }}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 pt-28 pb-10 md:px-8 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-6 lg:pt-32 lg:pb-8">
        <div className="flex flex-col justify-center lg:col-span-5 lg:pb-24">
          <motion.p {...rise(0)} className="text-2xl font-medium tracking-[-0.03em] text-[#ffb19f] uppercase md:text-[2.6rem] md:leading-none">
            {site.name}
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="mt-4 max-w-[16ch] text-[2.6rem] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-white md:text-6xl"
          >
            {site.headline}
          </motion.h1>
          {site.subtext && (
            <motion.p {...rise(0.16)} className="mt-5 max-w-[40ch] text-lg leading-relaxed text-white/75">
              {site.subtext}
            </motion.p>
          )}
          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-3">
            <Button href="#contact" variant="accent" className="ring-1 ring-white/25">
              Book a project
            </Button>
            <Button href="#work" variant="light">
              View work
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-5 gap-3 lg:col-span-7 lg:grid-cols-7 lg:gap-4">
          {site.heroImage && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.1, ease }}
              className="col-span-3 lg:col-span-4"
            >
              <Media
                src={site.heroImage}
                alt={`Portrait of ${site.name}`}
                sizes="(min-width: 1024px) 34vw, 60vw"
                priority
                className="aspect-[4/5] h-full w-full rounded-[var(--radius-card)] lg:aspect-auto lg:min-h-[34rem]"
              />
            </motion.div>
          )}
          <div className="col-span-2 grid grid-rows-2 gap-3 lg:col-span-3 lg:gap-4">
            {site.heroTiles.map((src, i) => (
              <motion.div
                key={src}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease }}
              >
                <Media
                  src={src}
                  alt=""
                  sizes="(min-width: 1024px) 24vw, 40vw"
                  priority
                  className="h-full min-h-32 w-full rounded-[var(--radius-card)]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {site.clients.length > 0 && (
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 pb-8 md:px-8">
          {site.clientsLabel && (
            <p className="hidden max-w-[11rem] shrink-0 text-sm leading-snug text-white/80 md:block">{site.clientsLabel}</p>
          )}
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="marquee-track flex w-max items-center gap-14 pr-14" aria-label={site.clientsLabel || "Clients"}>
              {[...site.clients, ...site.clients].map((c, i) => (
                <li key={`${c.logo}-${i}`} aria-hidden={i >= site.clients.length}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt={c.name} className="h-8 w-auto max-w-[9rem] object-contain opacity-90 brightness-0 invert" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
