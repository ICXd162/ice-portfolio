// Crop settings travel with the image path as a URL fragment, e.g.
//   /uploads/photo.jpg#x=40&y=25&z=1.3
// x / y: focal point in percent (0-100), z: zoom (1 = fit the frame).
// The admin's crop tool writes this; plain paths keep the default framing.
export type Crop = { url: string; has: boolean; x: number; y: number; z: number };

export function parseCrop(src: string | undefined | null): Crop {
  const raw = src ?? "";
  const i = raw.indexOf("#");
  if (i < 0) return { url: raw, has: false, x: 50, y: 50, z: 1 };
  const url = raw.slice(0, i);
  const p = new URLSearchParams(raw.slice(i + 1));
  const num = (k: string, d: number, min: number, max: number) => {
    const v = Number(p.get(k));
    return Number.isFinite(v) && p.has(k) ? Math.min(max, Math.max(min, v)) : d;
  };
  const x = num("x", 50, 0, 100);
  const y = num("y", 50, 0, 100);
  const z = num("z", 1, 1, 4);
  return { url, has: p.has("x") || p.has("y") || p.has("z"), x, y, z };
}

/** Inline style for an object-cover image that honours the crop. */
export function cropStyle(c: Crop): React.CSSProperties | undefined {
  if (!c.has) return undefined;
  return {
    objectPosition: `${c.x}% ${c.y}%`,
    transform: c.z !== 1 ? `scale(${c.z})` : undefined,
    transformOrigin: `${c.x}% ${c.y}%`,
  };
}
