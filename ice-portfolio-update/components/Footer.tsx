import { site, contact } from "@/lib/work";

export function Footer() {
  const social = [
    { label: "Instagram", href: contact.instagram },
    { label: "Facebook", href: contact.facebook },
  ].filter((s) => s.href);
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 pb-10 md:px-8">
        <p className="text-[clamp(3rem,11vw,9rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-ink-3" aria-hidden>
          {site.name}
        </p>
        <div className="mt-10 flex flex-col gap-4 text-sm text-mute md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 {site.name}</p>
          <ul className="flex gap-6">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="hover:text-paper">
                Back to top
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
