"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { Plus } from "@phosphor-icons/react";
import { SectionHead } from "./SectionHead";
import { faq } from "@/lib/work";

// Layout family: accordion. Hidden until questions are added in the admin.
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  if (!faq.items.length) return null;
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[52rem] px-4 md:px-8">
        <SectionHead heading={faq.heading} />
        <ul className="mt-12 grid gap-3">
          {faq.items.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.question} className="rounded-[var(--radius-card)] bg-ink-2">
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[17px] font-medium"
                >
                  {f.question}
                  <Plus size={18} weight="bold" className={`shrink-0 text-accent transition-transform duration-200 ${on ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] px-6 pb-6 text-[15px] leading-relaxed text-mute">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
