"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { EASE_OUT } from "@/lib/motion";
import { parseCrop } from "@/lib/crop";
import type { Design } from "@/lib/work";

/**
 * A project's overview page: every piece in a masonry grid at its real proportions.
 * Clicking a piece hands its index to onPick (the gallery opens it large in the Lightbox).
 * Esc or the back button closes it, unless the Lightbox on top is open (it handles Esc itself).
 */
export function ProjectSheet({
  project,
  onClose,
  onPick,
  viewerOpen,
}: {
  project: Design | null;
  onClose: () => void;
  onPick: (index: number) => void;
  viewerOpen: boolean;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => setMounted(true), []);

  const open = project !== null;
  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    backRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      returnTo.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open || viewerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, viewerOpen, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.title}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(24px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(16px)" }}
          transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink"
        >
          <header className="sticky top-0 z-10 border-b border-line bg-ink/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-4 md:px-8">
              <button
                ref={backRef}
                onClick={onClose}
                aria-label="Back to all projects"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-150 ease-[var(--ease-out)] active:scale-95"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div className="min-w-0">
                <h3 lang="th" className="truncate text-lg font-medium text-paper md:text-xl">{project.title}</h3>
                <p className="truncate text-sm text-mute">
                  {project.type}
                  {project.client ? ` · ${project.client}` : ""}
                  <span className="ml-3 tabular-nums">{project.images.length} pieces</span>
                </p>
              </div>
            </div>
          </header>

          <ul className="mx-auto max-w-[1400px] columns-2 gap-3 px-4 py-6 md:columns-3 md:gap-4 md:px-8 md:py-10 xl:columns-4">
            {project.images.map((src, i) => (
              <li key={src} className="mb-3 break-inside-avoid md:mb-4">
                <button
                  onClick={() => onPick(i)}
                  className="group relative block w-full overflow-hidden rounded-[var(--radius-media)] bg-ink-2"
                  aria-label={`View piece ${i + 1} of ${project.images.length} full size`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={parseCrop(src).url}
                    alt=""
                    loading={i < 8 ? "eager" : "lazy"}
                    decoding="async"
                    className="block h-auto w-full transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/25 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <MagnifyingGlassPlus size={28} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
