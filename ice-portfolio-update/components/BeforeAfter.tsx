"use client";
import { useState } from "react";
import { parseCrop, cropStyle } from "@/lib/crop";

// Drag (or use arrow keys on) the handle to compare the two frames.
export function BeforeAfter({ before, after, title }: { before: string; after: string; title: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="rounded-[var(--radius-card)] bg-ink-2 p-3">
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-media)] select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={parseCrop(after).url} style={cropStyle(parseCrop(after))} alt={`${title}: after`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={parseCrop(before).url} style={cropStyle(parseCrop(before))} alt={`${title}: before`} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent" />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper">Before</span>
        <span className="absolute top-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper">After</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="px-1 pt-4 pb-1 text-[17px] font-medium text-paper">{title}</figcaption>
    </figure>
  );
}
