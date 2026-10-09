"use client";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

// Heading whose words rise out of a mask, one after another, when it scrolls into view.
export function SplitHeading({
  text,
  className = "",
  as = "h2",
}: {
  text: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "h2" ? motion.h2 : motion.h3;
  const words = text.split(/\s+/).filter(Boolean);
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className="inline-block"
            variants={{ hidden: { transform: "translateY(105%)" }, show: { transform: "translateY(0%)" } }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
