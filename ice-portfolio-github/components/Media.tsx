"use client";
import { memo } from "react";
import Image from "next/image";
import { useState } from "react";
import { ImageBroken } from "@phosphor-icons/react";

// Image with layout-shaped loading skeleton, fade-in, and an inline error state.
function MediaImpl({
  src,
  alt,
  sizes,
  priority,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return (
    <div className={`relative overflow-hidden bg-ink-3 ${className}`}>
      {state === "loading" && (
        <div aria-hidden className="absolute inset-0 animate-pulse bg-ink-3 motion-reduce:animate-none" />
      )}
      {state === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-mute">
          <ImageBroken size={22} weight="regular" />
          <span className="text-xs">Preview unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={`object-cover transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}

export const Media = memo(MediaImpl);
