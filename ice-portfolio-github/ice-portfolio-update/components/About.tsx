import { Play } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { Media } from "./Media";
import { Button, Kicker } from "./Button";
import { WordReveal } from "./WordReveal";
import { site } from "@/lib/work";

// The page's single light color block: label left, statement right, showreel below.
export function About() {
  if (!site.about) return null;
  return (
    <section id="about" className="scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Kicker tone="light">Hey, quick intro</Kicker>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-accent md:text-[2.75rem]">{site.aboutLabel}</h2>
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
                href={site.showreelUrl || "#work"}
                target={site.showreelUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-[var(--radius-card)]"
                aria-label={site.showreelUrl ? "Watch showreel" : "Go to featured work"}
              >
                <Media
                  src={site.showreelImage}
                  alt="Showreel frame"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="aspect-video w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
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
