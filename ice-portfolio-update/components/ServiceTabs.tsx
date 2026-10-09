"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { ParallaxMedia } from "./ParallaxMedia";
import type { Service, ServiceCategory } from "@/lib/work";

const INTERVAL_S = 10;

// Cards on a 6-column grid. First two cards are wide, the rest share a row,
// so any count from 1 to 5+ fills the grid without gaps.
function spanFor(i: number, n: number) {
  if (n === 1) return "md:col-span-6";
  if (i < 2) return "md:col-span-3";
  const rest = n - 2;
  const pos = i - 2;
  const lastRow = rest % 3;
  const inLast = pos >= rest - lastRow;
  if (lastRow === 1 && inLast) return "md:col-span-6";
  if (lastRow === 2 && inLast) return "md:col-span-3";
  return "md:col-span-2";
}

type Group = { id: ServiceCategory; label: string; items: Service[] };

export function ServiceTabs({ groups }: { groups: Group[] }) {
  const reduce = useReducedMotion();
  // Only advance while the tab bar itself is on screen, so cards never swap under someone reading further down.
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { amount: 1 });
  const [index, setIndex] = useState(0);
  // Bumped on every switch so the progress bar restarts even when the same tab is re-selected.
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  if (!groups.length) return null;
  const current = groups[Math.min(index, groups.length - 1)];
  const auto = groups.length > 1;
  // The reader is looking at a card or using the keyboard here: hold the slide.
  const paused = !inView || hovered || focused;

  const go = (i: number) => {
    setIndex(i);
    setCycle((c) => c + 1);
  };

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
    >
      {auto && (
        <div ref={barRef} className="mt-8 flex justify-center">
          <div role="tablist" aria-label="Service type" className="flex gap-1 rounded-full bg-ink-2 p-1">
            {groups.map((g, i) => {
              const on = i === index;
              return (
                <button
                  key={g.id}
                  role="tab"
                  id={`svc-tab-${g.id}`}
                  aria-selected={on}
                  aria-controls="svc-panel"
                  onClick={() => go(i)}
                  className={`relative h-11 overflow-hidden rounded-full px-5 text-sm whitespace-nowrap transition-colors ${on ? "text-ink" : "text-mute hover:text-paper"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="svc-tab"
                      className="absolute inset-0 rounded-full bg-paper"
                      transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  {on && (
                    <span
                      key={cycle}
                      aria-hidden
                      data-paused={paused}
                      onAnimationEnd={() => go((index + 1) % groups.length)}
                      className="tab-progress absolute inset-x-4 bottom-1.5 h-[2px] rounded-full bg-accent"
                      style={{ ["--tab-dur" as string]: `${INTERVAL_S}s` }}
                    />
                  )}
                  <span className="relative">
                    {g.label} <span className={`tabular-nums ${on ? "text-mute-dark" : "text-mute/70"}`}>{g.items.length}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${current.id}`} className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={current.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5"
          >
            {current.items.map((s, i) => (
              <motion.li
                key={s.title}
                initial={reduce ? false : { opacity: 0, transform: "translateY(16px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05, ease: EASE_OUT }}
                className={`flex flex-col rounded-[var(--radius-card)] bg-ink-2 p-3 ${spanFor(i, current.items.length)}`}
              >
                {s.image && (
                  <ParallaxMedia
                    src={s.image}
                    alt=""
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={`w-full rounded-[var(--radius-media)] ${i < 2 ? "aspect-[16/9]" : "aspect-[16/10]"}`}
                  />
                )}
                <div className="px-3 pt-5 pb-3">
                  <h3 className="text-xl font-medium tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-mute">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
