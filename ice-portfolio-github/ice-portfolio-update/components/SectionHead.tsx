import { Reveal } from "./Reveal";

// Centered section header: heading + optional intro, stacked (no split header).
export function SectionHead({
  heading,
  intro,
  tone = "dark",
  children,
}: {
  heading: string;
  intro?: string;
  tone?: "dark" | "light";
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
      <h2
        className={`text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance md:text-[2.75rem] ${
          tone === "dark" ? "text-paper" : "text-ink"
        }`}
      >
        {heading}
      </h2>
      {intro && (
        <p className={`mt-4 max-w-[52ch] text-base leading-relaxed ${tone === "dark" ? "text-mute" : "text-mute-dark"}`}>
          {intro}
        </p>
      )}
      {children}
    </Reveal>
  );
}
