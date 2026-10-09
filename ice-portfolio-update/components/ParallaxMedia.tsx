"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { Media } from "./Media";

// Image that drifts slightly inside its frame while the frame scrolls past,
// giving each card a sense of depth.
export function ParallaxMedia({
  src,
  alt,
  sizes,
  className = "",
  strength = 8,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const transform = useMotionTemplate`translateY(${y}) scale(${1 + (strength * 2.4) / 100})`;
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={reduce ? undefined : { transform }} className="absolute inset-0">
        <Media src={src} alt={alt} sizes={sizes} className="h-full w-full" />
      </motion.div>
    </div>
  );
}
