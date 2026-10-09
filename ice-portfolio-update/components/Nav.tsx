"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { site } from "@/lib/work";

const links = [
  { href: "#about", label: "About" },
  { href: "#video", label: "Video" },
  { href: "#design", label: "Graphic design" },
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

// Top-right pill (name + menu button) that opens a menu card, as in the reference.
export function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed top-4 right-4 z-40 md:top-6 md:right-[max(2rem,calc((100vw-1680px)/2+4.5rem))]">
      <nav className="flex h-14 items-center gap-4 rounded-full bg-[#1b0703]/75 pr-1.5 pl-5 backdrop-blur-md">
        <a href="#top" className="text-[17px] font-bold tracking-[-0.03em] whitespace-nowrap text-white">
          {site.name}
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition-transform active:scale-95"
        >
          {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={reduce ? false : { opacity: 0, transform: "translateY(-8px) scale(0.98)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(-8px) scale(0.98)" }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="absolute top-16 right-0 w-[min(20rem,calc(100vw-2rem))] origin-top-right rounded-[var(--radius-card)] bg-ink-2 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <ul className="grid">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg text-paper hover:bg-ink-3">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex h-12 items-center justify-between rounded-full bg-accent pr-2 pl-5 text-[15px] font-medium text-white"
            >
              Book a project
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
