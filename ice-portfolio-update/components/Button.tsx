import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

// One label per intent across the page:
//   contact   -> "Book a project"
//   portfolio -> "View work"
type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "light" | "dark";
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
};

const styles = {
  accent: "bg-accent text-white hover:bg-[#ff5a3d]",
  light: "bg-paper text-ink hover:bg-white",
  dark: "bg-ink-3 text-paper hover:bg-[#2c2c2c]",
};

export function Button({ href, children, variant = "accent", size = "md", className = "", external }: Props) {
  const sz = size === "md" ? "h-12 pl-6 pr-2 text-[15px]" : "h-10 pl-4 pr-1.5 text-sm";
  const dot = size === "md" ? "h-8 w-8" : "h-7 w-7";
  const dotStyle =
    variant === "accent" ? "bg-white/20 text-white" : variant === "light" ? "bg-ink text-paper" : "bg-paper text-ink";
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-3 rounded-full font-medium whitespace-nowrap transition-[transform,background-color] duration-160 active:scale-[0.97] ${sz} ${styles[variant]} ${className}`}
    >
      {children}
      <span className={`flex items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-45 motion-reduce:transition-none ${dot} ${dotStyle}`}>
        <ArrowUpRight size={14} weight="bold" />
      </span>
    </a>
  );
}

/** Small rounded label above a section heading (used sparingly). */
export function Kicker({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] ${
        tone === "dark" ? "bg-ink-3 text-mute" : "bg-paper-2 text-mute-dark"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </span>
  );
}
