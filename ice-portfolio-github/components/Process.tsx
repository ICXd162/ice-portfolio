"use client";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

// Layout family: horizontal timeline. The line draws left to right to show sequence.
const steps = [
  { verb: "Brief", body: "Send footage, references and target platform. You get a timeline and a fixed quote." },
  { verb: "Rough cut", body: "A first pass on structure and pacing, so we agree on the story before polish." },
  { verb: "Polish", body: "Color, sound, captions and motion graphics, added once the cut is locked." },
  { verb: "Deliver", body: "Final files exported for each platform, with agreed revisions included." },
];

export function Process() {
  const reduce = useReducedMotion();
  return (
    <section id="process" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
            How a project runs.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute top-0 left-0 hidden h-px w-full bg-line md:block" />
          <motion.div
            className="absolute top-0 left-0 hidden h-px w-full origin-left bg-accent md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <ol className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.verb} as="li" delay={0.15 + i * 0.12} className="border-l border-line pl-5 md:border-l-0 md:pt-8 md:pl-0">
                <h3 className="text-2xl font-medium tracking-tight">{s.verb}</h3>
                <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-mute">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
