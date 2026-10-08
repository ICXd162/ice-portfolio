import { Media } from "./Media";
import { Reveal } from "./Reveal";
import { MaybeLink } from "./MaybeLink";
import { motionWork, type MotionItem } from "@/lib/work";

// Layout family: asymmetric bento on a 6-column grid.
// Items are laid out in groups of up to 4 so any count fills the grid with no empty cells:
//   4 -> lead (4x2) + two stacked (2x1) + wide band (6)
//   3 -> lead + two stacked
//   2 -> two halves
//   1 -> one wide band
type Cell = { span: string; ratio: string; sizes: string };

const LEAD: Cell = { span: "md:col-span-4 md:row-span-2", ratio: "aspect-video md:aspect-auto md:absolute md:inset-0", sizes: "(min-width: 768px) 66vw, 100vw" };
const SIDE: Cell = { span: "md:col-span-2", ratio: "aspect-video", sizes: "(min-width: 768px) 33vw, 100vw" };
const HALF: Cell = { span: "md:col-span-3", ratio: "aspect-video", sizes: "(min-width: 768px) 50vw, 100vw" };
const WIDE: Cell = { span: "md:col-span-6", ratio: "aspect-video md:aspect-[21/8]", sizes: "100vw" };

const shapes: Record<number, Cell[]> = {
  4: [LEAD, SIDE, SIDE, WIDE],
  3: [LEAD, SIDE, SIDE],
  2: [HALF, HALF],
  1: [WIDE],
};

function layout(items: MotionItem[]) {
  const out: { item: MotionItem; cell: Cell }[] = [];
  for (let i = 0; i < items.length; i += 4) {
    const group = items.slice(i, i + 4);
    group.forEach((item, j) => out.push({ item, cell: shapes[group.length][j] }));
  }
  return out;
}

export function MotionBento() {
  const cells = layout(motionWork.items);
  if (!cells.length) return null;
  return (
    <section id="motion" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 className="max-w-[16ch] text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
            {motionWork.heading}
          </h2>
          {motionWork.intro && (
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mute">{motionWork.intro}</p>
          )}
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {cells.map(({ item, cell }, i) => (
            <Reveal key={`${item.image}-${i}`} delay={(i % 4) * 0.06} className={`flex flex-col ${cell.span}`} as="figure">
              <MaybeLink href={item.videoUrl} label={`Watch ${item.title}`} className="group relative flex-1 overflow-hidden">
                <Media
                  src={item.image}
                  alt={item.title}
                  sizes={cell.sizes}
                  className={`w-full ${cell.ratio}`}
                  imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                />
              </MaybeLink>
              <figcaption className="mt-3 text-sm text-mute">{item.title}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
