"use client";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "./Button";
import { site } from "@/lib/work";

const ease = [0.16, 1, 0.3, 1] as const;

// Matches the reference hero:
//   portrait fills the middle and fades into a warm gradient,
//   copy + two CTAs sit left over it,
//   a column of square work tiles drifts upward on the right,
//   client logos drift left along the bottom-left.
// Every list here is edited in the admin (หน้าแรก).
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };

  // ~120px/s upward like the reference: one 392px tile + gap every ~3.4s.
  const slides = site.heroSlides;
  const slideDur = `${Math.max(slides.length, 1) * 3.4}s`;
  // ~30px/s leftward: one ~170px logo slot every ~5.7s.
  const logoDur = `${Math.max(site.clients.length, 1) * 5.7}s`;

  return (
    <section
      id="top"
      className="relative isolate min-h-[100dvh] overflow-hidden lg:min-h-[760px]"
      style={{
        background:
          "radial-gradient(90% 85% at 55% 30%, #ff5a2e 0%, #e8401f 28%, #b42a12 52%, #6e1709 76%, #3a0d06 100%)",
      }}
    >
      {/* Portrait */}
      {site.heroImage && (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="portrait-blend pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] sm:inset-x-[8%] lg:inset-x-auto lg:left-[24%] lg:h-full lg:w-[52%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.heroImage}
            alt={`Portrait of ${site.name}`}
            fetchPriority="high"
            className="h-full w-full object-cover object-top"
          />
        </motion.div>
      )}
      {/* Darken the bottom so logos stay readable over any photo. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#2a0904]/70 to-transparent" />

      <div className="mx-auto flex min-h-[100dvh] max-w-[1680px] flex-col px-4 pt-28 pb-8 md:px-8 xl:px-[4.5rem] lg:min-h-[760px] lg:h-[100dvh] lg:justify-center lg:pt-0 lg:pb-0">
        {/* Copy */}
        <div className="relative z-10 max-w-[36rem] lg:pr-8">
          <motion.p
            {...rise(0)}
            className="text-[1.9rem] leading-none font-medium tracking-[-0.04em] text-[#fc826c] uppercase md:text-[2.625rem]"
          >
            {site.name}
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="mt-5 max-w-[13ch] text-[2.6rem] leading-[1.15] font-bold tracking-[-0.04em] text-balance text-white md:text-[3.5rem] md:leading-[1.4]"
          >
            {site.headline}
          </motion.h1>
          {site.subtext && (
            <motion.p {...rise(0.14)} className="mt-4 max-w-[38ch] text-lg leading-relaxed text-white/80">
              {site.subtext}
            </motion.p>
          )}
          <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap gap-3">
            <Button href="#contact" variant="accent" className="ring-1 ring-white/20">
              Book a project
            </Button>
            <Button href="#work" variant="light">
              View work
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Work slideshow, drifting upward */}
      {slides.length > 0 && (
        <div
          className="marquee-pause fade-y absolute top-[52%] right-4 bottom-24 w-[34vw] overflow-hidden sm:top-[46%] lg:top-0 lg:bottom-0 lg:w-[clamp(220px,27vw,392px)] lg:right-[max(2rem,calc((100vw-1680px)/2+4.5rem))]"
          aria-label="Selected work"
        >
          <ul className="marquee-up flex flex-col gap-3 lg:gap-5" style={{ ["--marquee-dur" as string]: slideDur }}>
            {[...slides, ...slides].map((s, i) => {
              const dup = i >= slides.length;
              const img = (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={dup ? "" : `Work sample ${i + 1}`} loading={i < 3 ? "eager" : "lazy"} className="aspect-square w-full object-cover" />
              );
              return (
                <li key={`${s.image}-${i}`} aria-hidden={dup}>
                  {s.link ? (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" tabIndex={dup ? -1 : undefined} className="block transition-opacity hover:opacity-85">
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Client logos, drifting left */}
      {site.clients.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-[1680px] items-center gap-6 px-4 pb-6 md:px-8 lg:pb-10 xl:px-[4.5rem]">
            {site.clientsLabel && (
              <p className="hidden max-w-[10rem] shrink-0 text-sm leading-snug font-medium text-white md:block">{site.clientsLabel}</p>
            )}
            <div className="fade-x min-w-0 flex-1 overflow-hidden lg:max-w-[calc(100%-clamp(220px,27vw,392px)-15rem)]">
              <ul
                className="marquee-track flex w-max items-center gap-10 pr-10 lg:gap-14 lg:pr-14"
                style={{ ["--marquee-dur" as string]: logoDur }}
                aria-label={site.clientsLabel || "Clients"}
              >
                {[...site.clients, ...site.clients, ...site.clients, ...site.clients].map((c, i) => (
                  <li key={`${c.logo}-${i}`} aria-hidden={i >= site.clients.length} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logo} alt={i < site.clients.length ? c.name : ""} className="h-7 w-auto max-w-[8rem] object-contain brightness-0 invert lg:h-9 lg:max-w-[9rem]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
