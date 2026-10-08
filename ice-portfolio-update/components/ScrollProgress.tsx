"use client";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

// Thin accent bar along the top edge that fills as the page is read.
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent"
    />
  );
}
