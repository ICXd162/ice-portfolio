import Link from "next/link";
import { Button } from "./Button";

const links = [
  { href: "#short-form", label: "Short form" },
  { href: "#long-form", label: "Long form" },
  { href: "#motion", label: "Motion" },
  { href: "#stills", label: "Stills" },
  { href: "#about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="#top" className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
          Ice Pongphisut
        </Link>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm whitespace-nowrap text-mute transition-colors hover:text-paper"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Button href="#contact" className="h-10 px-4 text-sm">
          Book a project
        </Button>
      </nav>
    </header>
  );
}
