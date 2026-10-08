"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "./Button";
import { site } from "@/lib/work";

const ease = [0.16, 1, 0.3, 1] as const;

// Layers, back to front:
//   0  warm gradient (section background)
//   10 work slideshow drifting upward, sitting BEHIND the portrait
//   20 portrait, fading into the gradient at its edges
//   30 bottom shade so logos stay readable
//   40 copy, CTAs and client logos
// On scroll, each layer moves at its own speed (parallax) and the copy fades out.
// Every list here is edited in the admin (หน้าแรก).
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // The hero is pinned on large screens, so measure page scroll over the first ~viewport height.
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (v) => {
    const h = ref.current?.offsetHeight || 900;
    return Math.min(Math.max(v / h, 0), 1);
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const slidesY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const logosY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const p = (v: unknown) => (reduce ? undefined : v);

  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };

  // ~120px/s upward like the reference: one tile + gap every ~3.4s.
  const slides = site.heroSlides;
  const slideDur = `${Math.max(slides.length, 1) * 3.4}s`;
  // ~30px/s leftward: one ~170px logo slot every ~5.7s.
  const logoDur = `${Math.max(site.clients.length, 1) * 5.7}s`;

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate min-h-[100dvh] overflow-hidden lg:min-h-[760px]"
      style={{
        background:
          "radial-gradient(90% 85% at 55% 30%, #ff5a2e 0%, #e8401f 28%, #b42a12 52%, #6e1709 76%, #3a0d06 100%)",
      }}
    >
      {/* Work slideshow, behind the portrait */}
      {slides.length > 0 && (
        <motion.div
          style={{ y: p(slidesY) as never }}
          className="marquee-pause fade-y absolute top-[40%] right-3 bottom-20 z-10 w-[42vw] overflow-hidden sm:right-[8%] sm:w-[34vw] lg:top-0 lg:bottom-0 lg:right-[clamp(2rem,11vw,13rem)] lg:w-[clamp(220px,24vw,380px)]"
          aria-label="Selected work"
        >
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="marquee-up flex flex-col gap-3 lg:gap-5"
            style={{ ["--marquee-dur" as string]: slideDur }}
          >
            {[...slides, ...slides].map((s, i) => {
              const dup = i >= slides.length;
              const img = (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={dup ? "" : `Work sample ${i + 1}`} loading="eager" decoding="async" className="aspect-square w-full object-cover" />
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
          </motion.ul>
        </motion.div>
      )}

      {/* Portrait, in front of the slideshow */}
      {site.heroImage && (
        <motion.div
          style={{ y: p(portraitY) as never, scale: p(portraitScale) as never }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[64%] origin-bottom sm:inset-x-[4%] lg:inset-x-auto lg:left-[20%] lg:h-full lg:w-[58%]"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease }}
            className="portrait-blend h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.heroImage} alt={`Portrait of ${site.name}`} fetchPriority="high" className="h-full w-full object-cover object-top" />
          </motion.div>
        </motion.div>
      )}

      {/* Bottom shade so logos stay readable over any photo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/3 bg-gradient-to-t from-[#2a0904]/75 to-transparent" />

      <div className="pointer-events-none relative z-40 mx-auto flex min-h-[100dvh] max-w-[1680px] flex-col px-4 pt-28 pb-8 md:px-8 lg:h-[100dvh] lg:min-h-[760px] lg:justify-center lg:pt-0 lg:pb-0 xl:px-[4.5rem]">
        <motion.div style={{ y: p(copyY) as never, opacity: p(copyOpacity) as never }} className="pointer-events-auto max-w-[36rem] lg:pr-8">
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
        </motion.div>
      </div>

      {/* Client logos, drifting left */}
      {site.clients.length > 0 && (
        <motion.div style={{ y: p(logosY) as never }} className="absolute inset-x-0 bottom-0 z-40">
          <div className="mx-auto flex max-w-[1680px] items-center gap-6 px-4 pb-6 md:px-8 lg:pb-10 xl:px-[4.5rem]">
            {site.clientsLabel && (
              <p className="hidden max-w-[10rem] shrink-0 text-sm leading-snug font-medium text-white md:block">{site.clientsLabel}</p>
            )}
            <div className="fade-x min-w-0 flex-1 overflow-hidden lg:max-w-[52%]">
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
        </motion.div>
      )}
    </section>
  );
}
