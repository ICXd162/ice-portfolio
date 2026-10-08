// Wraps work in an outbound link only when a video or project URL was added in the admin.
export function MaybeLink({
  href,
  label,
  children,
  className = "",
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`block ${className}`}>
      {children}
    </a>
  );
}
