import { Play } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { ParallaxMedia } from "./ParallaxMedia";
import { Button, Kicker } from "./Button";
import { WordReveal } from "./WordReveal";
import { SplitHeading } from "./SplitHeading";
import { site } from "@/lib/work";

// The page's single light color block: label left, statement right, showreel below.
export function About() {
  if (!site.about) return null;
  return (
    <section id="about" className="relative z-10 -mt-8 scroll-mt-20 rounded-t-[32px] bg-paper text-ink shadow-[0_-30px_80px_rgba(0,0,0,0.35)] lg:rounded-t-[48px]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Kicker tone="light">Hey, quick intro</Kicker>
          <SplitHeading text={site.aboutLabel} className="mt-4 text-4xl font-medium tracking-[-0.04em] text-accent md:text-[2.75rem]" />
          {site.thaiName && (
            <p lang="th" className="mt-3 font-[family-name:var(--font-thai-stack)] text-lg text-mute-dark">
              {site.thaiName}
            </p>
          )}
        </Reveal>
        <div className="lg:col-span-8">
          <WordReveal
            text={site.about}
            className="max-w-[34ch] text-[1.75rem] leading-[1.3] font-medium tracking-[-0.025em] text-ink md:text-[2.4rem] md:leading-[1.25]"
          />
          <Reveal className="mt-10">
            <Button href="#contact" variant="accent">
              Book a project
            </Button>
          </Reveal>

          {site.showreelImage && (
            <Reveal className="mt-14">
              <a
                href={site.showreelUrl || "#video"}
                target={site.showreelUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-[var(--radius-card)]"
                aria-label={site.showreelUrl ? "Watch showreel" : "Go to featured work"}
              >
                <ParallaxMedia src={site.showreelImage} alt="Showreel frame" sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video w-full" strength={10} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_40px_rgba(255,63,30,0.45)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                    <Play size={28} weight="fill" />
                  </span>
                </span>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
