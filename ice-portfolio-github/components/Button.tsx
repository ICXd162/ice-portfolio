import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

// One CTA label per intent across the page:
//   contact   -> "Book a project"
//   portfolio -> "See the work"
type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "inline-flex items-center gap-2 whitespace-nowrap px-5 h-12 text-[15px] font-medium transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-ink hover:bg-paper"
      : "border border-line text-paper hover:border-paper";
  return (
    <Link href={href} className={`${base} ${styles} group ${className}`}>
      {children}
      <ArrowUpRight
        size={16}
        weight="bold"
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
