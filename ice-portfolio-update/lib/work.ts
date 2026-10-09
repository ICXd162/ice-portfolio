// Content comes from /content/*.json, which the admin panel (/admin) edits.
// Sections whose list is empty in the admin are hidden on the page.
import siteData from "@/content/site.json";
import videosData from "@/content/videos.json";
import designsData from "@/content/designs.json";
import processData from "@/content/process.json";
import servicesData from "@/content/services.json";
import statsData from "@/content/stats.json";
import testimonialsData from "@/content/testimonials.json";
import pricingData from "@/content/pricing.json";
import faqData from "@/content/faq.json";
import contactData from "@/content/contact.json";

const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v.filter(Boolean) as T[]) : []);
const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Accepts youtube.com/watch?v=, youtu.be/, /shorts/, /embed/, /live/ links or a bare id. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/) ?? url.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** Thai numbers like 081-824-2182 become tel:+66818242182. */
export const telHref = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return `tel:${d.startsWith("0") ? `+66${d.slice(1)}` : `+${d}`}`;
};

export const SECTION_IDS = ["about", "video", "design", "process", "stats", "services", "testimonials", "pricing", "contact", "faq"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Section order and visibility from the admin; any section missing from the list is appended, visible. */
const SECTION_LABELS: Record<string, SectionId> = {
  "เกี่ยวกับฉัน": "about",
  "งานวิดีโอ": "video",
  "งานกราฟิก": "design",
  "ขั้นตอนการทำงาน": "process",
  "ตัวเลขผลงาน": "stats",
  "บริการ": "services",
  "รีวิวลูกค้า": "testimonials",
  "แพ็กเกจราคา": "pricing",
  "ติดต่อ": "contact",
  "คำถามที่พบบ่อย": "faq",
};

function sectionOrder(raw: unknown): SectionId[] {
  const rows = list<{ section?: string; visible?: boolean }>(raw);
  const seen = new Set<string>();
  const out: SectionId[] = [];
  for (const r of rows) {
    const label = text(r.section);
    const id = (SECTION_LABELS[label] ?? label.toLowerCase()) as SectionId;
    if (!(SECTION_IDS as readonly string[]).includes(id) || seen.has(id)) continue;
    seen.add(id);
    if (r.visible !== false) out.push(id);
  }
  for (const id of SECTION_IDS) if (!seen.has(id)) out.push(id);
  return out;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
export const theme = {
  accent: HEX.test(text((siteData as { accent?: string }).accent)) ? text((siteData as { accent?: string }).accent) : "#ff3f1e",
  sections: sectionOrder((siteData as { sections?: unknown }).sections),
};

export type Client = { name: string; logo: string };
export const site = {
  name: text(siteData.name),
  headline: text(siteData.headline),
  subtext: text(siteData.subtext),
  heroImage: text(siteData.heroImage),
  heroSlides: list<{ image: string; link?: string }>((siteData as { heroSlides?: unknown }).heroSlides)
    .map((x) => ({ image: text(x.image), link: text(x.link) }))
    .filter((x) => x.image),
  clientsLabel: text(siteData.clientsLabel),
  clients: list<Client>(siteData.clients).filter((c) => c.logo),
  aboutLabel: text(siteData.aboutLabel),
  about: text(siteData.about),
  thaiName: text(siteData.thaiName),
  showreelImage: text(siteData.showreelImage),
  showreelUrl: text(siteData.showreelUrl),
};

export type VideoType = "Short form" | "Long form" | "Motion graphics";
export const VIDEO_TYPES: VideoType[] = ["Short form", "Long form", "Motion graphics"];
export type Video = { title: string; client: string; type: VideoType; videoUrl: string; youtube: string | null; cover: string; featured: boolean };
export const videos = {
  heading: text(videosData.heading),
  intro: text(videosData.intro),
  items: list<Record<string, unknown>>(videosData.items)
    .map((v) => {
      const id = youtubeId(text(v.videoUrl));
      const type = (VIDEO_TYPES as string[]).includes(text(v.type)) ? (text(v.type) as VideoType) : "Long form";
      return {
        title: text(v.title),
        client: text(v.client),
        type,
        videoUrl: text(v.videoUrl),
        youtube: id,
        cover: text(v.cover) || (id ? ytThumb(id) : ""),
        featured: v.featured === true,
      } as Video;
    })
    .filter((v) => v.cover),
};

export const DESIGN_TYPES = ["Banner", "Thumbnail", "Social post", "Poster & print", "Other"] as const;
export const DESIGN_FRAMES = {
  original: null,
  square: "1 / 1",
  portrait: "4 / 5",
  landscape: "16 / 9",
  banner: "3 / 1",
} as const;
export type DesignFrame = keyof typeof DESIGN_FRAMES;
export type Design = { title: string; client: string; type: string; image: string; link: string; frame: DesignFrame };
export const designs = {
  heading: text(designsData.heading),
  intro: text(designsData.intro),
  items: list<Record<string, unknown>>(designsData.items)
    .map((d) => ({
      title: text(d.title),
      client: text(d.client),
      type: text(d.type) || "Other",
      image: text(d.image),
      link: text(d.link),
      frame: (text(d.frame) in DESIGN_FRAMES ? text(d.frame) : "original") as DesignFrame,
    }))
    .filter((d) => d.image) as Design[],
};

export type Step = { title: string; body: string; image?: string };
export const workflow = {
  heading: text(processData.heading),
  intro: text(processData.intro),
  steps: list<Step>(processData.steps).filter((s) => s.title),
};

export type ServiceCategory = "video" | "design";
export type Service = { title: string; body: string; image?: string; category: ServiceCategory };
const sd = servicesData as { videoLabel?: string; designLabel?: string };
export const services = {
  heading: text(servicesData.heading),
  intro: text(servicesData.intro),
  videoLabel: text(sd.videoLabel) || "Video",
  designLabel: text(sd.designLabel) || "Graphic design",
  items: list<Record<string, unknown>>(servicesData.items)
    .map((s) => ({
      title: text(s.title),
      body: text(s.body),
      image: text(s.image),
      category: (text(s.category) === "design" ? "design" : "video") as ServiceCategory,
    }))
    .filter((s) => s.title) as Service[],
  beforeImage: text(servicesData.beforeImage),
  afterImage: text(servicesData.afterImage),
  beforeAfterTitle: text(servicesData.beforeAfterTitle),
};

export type Stat = { value: number; suffix?: string; label: string };
export const stats = {
  heading: text(statsData.heading),
  items: list<Stat>(statsData.items).filter((s) => s.label && Number.isFinite(Number(s.value))),
};

export type Testimonial = { quote: string; name: string; role?: string; photo?: string };
export const testimonials = {
  heading: text(testimonialsData.heading),
  items: list<Testimonial>(testimonialsData.items).filter((t) => t.quote && t.name),
};

export type Plan = {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
};
export const pricing = {
  heading: text(pricingData.heading),
  intro: text(pricingData.intro),
  plans: list<Plan>(pricingData.plans)
    .filter((p) => p.name && p.price)
    .map((p) => ({ ...p, features: list<string>(p.features) })),
};

export type Faq = { question: string; answer: string };
export const faq = {
  heading: text(faqData.heading),
  items: list<Faq>(faqData.items).filter((f) => f.question && f.answer),
};

export const contact = {
  heading: text(contactData.heading),
  intro: text(contactData.intro),
  email: text(contactData.email),
  phone: text(contactData.phone),
  line: text(contactData.line),
  instagram: text(contactData.instagram),
  facebook: text(contactData.facebook),
};
