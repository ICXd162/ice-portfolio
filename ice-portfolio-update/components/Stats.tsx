"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { Reveal } from "./Reveal";
import { stats } from "@/lib/work";

// Counts up once when scrolled into view; numbers come only from the admin panel.
function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce || !inView) {
      if (reduce) el.textContent = `${value}${suffix ?? ""}`;
      return;
    }
    const c = animate(0, value, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix ?? ""}`),
    });
    return () => c.stop();
  }, [inView, reduce, value, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

// Layout family: numeric band (hidden until numbers are added in the admin).
export function Stats() {
  if (!stats.items.length) return null;
  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {stats.heading && (
          <Reveal>
            <h2 className="text-center text-sm text-mute">{stats.heading}</h2>
          </Reveal>
        )}
        <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.items.map((s, i) => (
            <Reveal key={s.label} delay={Math.min(i, 4) * 0.06} className="text-center">
              <dd className="text-5xl font-medium tracking-[-0.04em] text-paper md:text-6xl">
                <Counter value={Number(s.value)} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-mute">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
