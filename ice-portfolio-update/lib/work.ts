// Content comes from /content/*.json, which the admin panel (/admin) edits.
// Sections whose list is empty in the admin are hidden on the page.
import siteData from "@/content/site.json";
import worksData from "@/content/works.json";
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

export type Work = {
  title: string;
  category: string;
  tags: string[];
  cover: string;
  orientation: "landscape" | "portrait";
  videoUrl: string;
};
export const works = {
  heading: text(worksData.heading),
  intro: text(worksData.intro),
  items: list<Partial<Work>>(worksData.items)
    .map((w) => {
      const id = youtubeId(w.videoUrl);
      return {
        title: text(w.title),
        category: text(w.category) || "Other",
        tags: list<string>(w.tags).map(text).filter(Boolean),
        cover: text(w.cover) || (id ? ytThumb(id) : ""),
        orientation: w.orientation === "portrait" ? "portrait" : "landscape",
        videoUrl: text(w.videoUrl),
      } as Work;
    })
    .filter((w) => w.cover),
};
export const workCategories = Array.from(new Set(works.items.map((w) => w.category)));

export type Step = { title: string; body: string; image?: string };
export const workflow = {
  heading: text(processData.heading),
  intro: text(processData.intro),
  steps: list<Step>(processData.steps).filter((s) => s.title),
};

export type Service = { title: string; body: string; image?: string };
export const services = {
  heading: text(servicesData.heading),
  intro: text(servicesData.intro),
  items: list<Service>(servicesData.items).filter((s) => s.title),
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
