import "server-only";
import fs from "node:fs";
import path from "node:path";
import sizeOf from "image-size";

// Build-time image sizes so the masonry grid reserves space (no layout shift).
// Local uploads are measured from disk; Picsum URLs carry their size in the path.
export function imageDims(srcWithCrop: string): { w: number; h: number } | null {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let src = srcWithCrop.split("#")[0];
  if (base && src.startsWith(base + "/")) src = src.slice(base.length);
  try {
    if (src.startsWith("/")) {
      const file = path.join(process.cwd(), "public", decodeURIComponent(src));
      const d = sizeOf(fs.readFileSync(file));
      if (d.width && d.height) return { w: d.width, h: d.height };
    }
    const p = src.match(/picsum\.photos\/seed\/[^/]+\/(\d+)\/(\d+)/);
    if (p) return { w: +p[1], h: +p[2] };
  } catch {
    // Unknown size: the image renders at its natural height instead.
  }
  return null;
}
