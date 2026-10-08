import {
  FilmSlate,
  DeviceMobile,
  Sparkle,
  ImageSquare,
  Broadcast,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

// Layout family: sticky heading column + scrolling stack.
const services = [
  {
    icon: DeviceMobile,
    title: "Short form editing",
    body: "Reels, TikTok and Shorts. Hook-first structure, animated captions, music and sound effects mixed for phone speakers.",
  },
  {
    icon: FilmSlate,
    title: "Long form editing",
    body: "YouTube episodes, travel series and home tours. Story structure, color grading, sound clean-up and chapter-ready pacing.",
  },
  {
    icon: Sparkle,
    title: "Motion graphics",
    body: "Animated titles, maps, lower thirds and explainer sequences built in After Effects to match your brand.",
  },
  {
    icon: ImageSquare,
    title: "Banners and thumbnails",
    body: "Campaign banners, social posts and YouTube thumbnails designed to read clearly at small sizes.",
  },
  {
    icon: Broadcast,
    title: "Shooting and live production",
    body: "On-location filming and live stream production when a project needs footage, not just the edit.",
  },
];

export function Services() {
  return (
    <section id="services" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="max-w-[14ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
                One editor from raw footage to final file.
              </h2>
            </Reveal>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:col-span-7">
          {services.map((s, i) => (
            <Reveal key={s.title} as="li" delay={(i % 2) * 0.08}>
              <s.icon size={28} weight="light" className="text-accent" />
              <h3 className="mt-5 text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-mute">{s.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
