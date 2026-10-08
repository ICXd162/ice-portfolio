"use client";
import { motion, useReducedMotion } from "motion/react";
import { Media } from "./Media";
import { Button } from "./Button";
import { heroContent } from "@/lib/work";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        };
  const wipe = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { clipPath: "inset(0 0 100% 0)" },
          animate: { clipPath: "inset(0 0 0% 0)" },
          transition: { duration: 1.1, delay, ease },
        };

  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 pt-14 pb-24 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-32"
    >
      <div className="lg:col-span-6">
        <motion.h1
          {...fade(0.05)}
          className="max-w-[12ch] text-5xl leading-[1.02] font-semibold tracking-tighter text-balance md:text-6xl lg:text-[3.5rem] xl:text-7xl"
        >
          {heroContent.headline}{" "}
          {heroContent.headlineAccent && <span className="text-accent">{heroContent.headlineAccent}</span>}
        </motion.h1>
        <motion.p {...fade(0.18)} className="mt-6 max-w-[42ch] text-lg leading-relaxed text-mute">
          {heroContent.subtext}
        </motion.p>
        <motion.div {...fade(0.3)} className="mt-10 flex flex-wrap gap-3">
          <Button href="#contact">Book a project</Button>
          <Button href="#short-form" variant="ghost">
            See the work
          </Button>
        </motion.div>
      </div>

      {/* Two formats, one frame: 16:9 long form with a 9:16 short overlapping it. */}
      <div className="relative lg:col-span-6">
        <motion.div {...wipe(0.15)}>
          <Media
            src={heroContent.wideImage}
            alt="Featured motion graphics frame"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="aspect-video w-full"
          />
        </motion.div>
        {heroContent.tallImage && (
          <motion.div
            {...wipe(0.4)}
            className="absolute -bottom-10 -left-8 hidden w-[26%] border-4 border-ink lg:block"
          >
            <Media
              src={heroContent.tallImage}
              alt="Featured vertical short"
              sizes="200px"
              priority
              className="aspect-[9/16] w-full"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
