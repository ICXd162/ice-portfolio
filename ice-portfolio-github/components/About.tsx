import { Reveal } from "./Reveal";
import { Media } from "./Media";
import { about } from "@/lib/work";

// Layout family: full-width editorial statement with inline portrait, followed by the page's only marquee.

export function About() {
  const genres = about.genres;
  const row = [...genres, ...genres];
  return (
    <section id="about" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <div className="max-w-[30ch] text-3xl leading-[1.25] font-medium tracking-tight md:text-[2.75rem] md:leading-[1.2]">
            {about.portrait && (
            <Media
              src={about.portrait}
              alt="Portrait of Pongphisut Kaewnil"
              sizes="96px"
              className="mr-4 inline-block aspect-square w-16 align-middle md:w-24"
            />
            )}
            {about.statement}
          </div>
          <p lang="th" className="mt-6 font-[family-name:var(--font-thai-stack)] text-lg text-mute">
            {about.thaiName}
          </p>
        </Reveal>
      </div>

      {genres.length > 0 && (
      <div className="mt-20 overflow-hidden border-y border-line py-6" aria-label="Genres I edit">
        <ul className="marquee-track flex w-max gap-14 pr-14">
          {row.map((g, i) => (
            <li
              key={`${g}-${i}`}
              aria-hidden={i >= genres.length}
              className="text-2xl whitespace-nowrap text-mute md:text-4xl"
            >
              {g}
            </li>
          ))}
        </ul>
      </div>
      )}
    </section>
  );
}
