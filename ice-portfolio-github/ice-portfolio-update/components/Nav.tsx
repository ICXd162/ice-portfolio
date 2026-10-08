"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { site } from "@/lib/work";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

// Floating pill navigation, centered. Collapses to a menu sheet below lg.
export function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav className="pointer-events-auto flex h-14 w-full max-w-[44rem] items-center justify-between gap-4 rounded-full border border-white/10 bg-ink/80 pr-2 pl-5 backdrop-blur-md">
        <a href="#top" className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
          {site.name}
        </a>
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-mute transition-colors hover:text-paper">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-full bg-accent px-4 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#ff5a3d] active:scale-[0.97] sm:inline-flex"
          >
            Book a project
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink lg:hidden"
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto absolute top-[4.5rem] w-[calc(100%-2rem)] max-w-[44rem] rounded-[var(--radius-card)] border border-white/10 bg-ink-2 p-3 lg:hidden"
          >
            <ul className="grid">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-lg text-paper hover:bg-ink-3"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
