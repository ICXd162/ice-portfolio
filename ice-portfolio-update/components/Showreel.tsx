"use client";
import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { ParallaxMedia } from "./ParallaxMedia";
import { youtubeId } from "@/lib/work";

const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/**
 * The About section's featured clip.
 * - A video file (.mp4): plays a muted looping preview while on screen; clicking plays it
 *   in place with sound and controls.
 * - A YouTube link: clicking swaps the cover for the embedded player.
 * - Anything else: the cover links out (or to #video when empty).
 */
export function Showreel({ image, url }: { image: string; url: string }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const preview = useRef<HTMLVideoElement>(null);
  const isFile = VIDEO_FILE.test(url);
  const yt = isFile ? null : youtubeId(url);

  // Preview only runs while the frame is visible, so it doesn't download or decode off screen.
  useEffect(() => {
    const v = preview.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, playing]);

  const frame = "relative block aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-ink";
  const playBadge = (
    <span className="absolute inset-0 flex items-center justify-center">
      <Play
        size={72}
        weight="fill"
        className="text-white/70 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-[color,transform] duration-200 ease-[var(--ease-out)] group-hover:scale-110 group-hover:text-white group-active:scale-95 motion-reduce:transition-none"
      />
    </span>
  );

  if (playing && isFile) {
    return <video src={url} poster={image || undefined} controls autoPlay playsInline className={`${frame} object-contain`} />;
  }
  if (playing && yt) {
    return (
      <div className={frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Showreel"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (isFile || yt) {
    return (
      <button type="button" onClick={() => setPlaying(true)} className={`group ${frame} cursor-pointer`} aria-label="Play showreel">
        {isFile ? (
          <video
            ref={preview}
            src={url}
            poster={image || undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <ParallaxMedia src={image} alt="Showreel frame" sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video w-full" strength={10} />
        )}
        <span className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
        {playBadge}
      </button>
    );
  }

  return (
    <a
      href={url || "#video"}
      target={url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`group ${frame}`}
      aria-label={url ? "Watch showreel" : "Go to featured work"}
    >
      <ParallaxMedia src={image} alt="Showreel frame" sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video w-full" strength={10} />
      {playBadge}
    </a>
  );
}
