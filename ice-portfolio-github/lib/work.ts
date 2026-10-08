// Content comes from /content/*.json, which the admin panel (/admin) edits.
// Change wording, images and order in the admin panel rather than in code.
import hero from "@/content/hero.json";
import shortFormData from "@/content/short-form.json";
import longFormData from "@/content/long-form.json";
import motionData from "@/content/motion.json";
import stillsData from "@/content/stills.json";
import aboutData from "@/content/about.json";
import contactData from "@/content/contact.json";

export type ShortItem = { image: string; videoUrl?: string };
export type ShortCategory = { label: string; items: ShortItem[] };
export type LongItem = { title: string; subtitle?: string; youtubeUrl: string; thumbnail?: string };
export type MotionItem = { title: string; image: string; videoUrl?: string };
export type StillItem = { image: string; alt: string; link?: string };

const clean = <T,>(list: T[] | undefined | null): T[] => (Array.isArray(list) ? list.filter(Boolean) : []);

export const heroContent = hero;

export const shortForm = {
  heading: shortFormData.heading,
  intro: shortFormData.intro,
  categories: clean<ShortCategory>(shortFormData.categories)
    .map((c) => ({ ...c, items: clean<ShortItem>(c.items).filter((i) => i.image) }))
    .filter((c) => c.items.length > 0),
};

export const longForm = {
  heading: longFormData.heading,
  videos: clean<LongItem>(longFormData.videos).filter((v) => youtubeId(v.youtubeUrl) || v.thumbnail),
};

export const motionWork = {
  heading: motionData.heading,
  intro: motionData.intro,
  items: clean<MotionItem>(motionData.items).filter((m) => m.image),
};

export const stills = {
  heading: stillsData.heading,
  intro: stillsData.intro,
  items: clean<StillItem>(stillsData.items).filter((s) => s.image),
};

export const about = { ...aboutData, genres: clean<string>(aboutData.genres) };
export const contact = contactData;

/** Accepts youtube.com/watch?v=, youtu.be/, /shorts/, /embed/ links or a bare 11-character id. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/) ?? url.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const ytUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Thai phone numbers like 081-824-2182 become tel:+66818242182. */
export const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.startsWith("0") ? `+66${digits.slice(1)}` : `+${digits}`}`;
};
