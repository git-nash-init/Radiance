import type { ElementType, ReactNode } from "react";

/** Headline split into masked lines for the "lines" reveal. Pass one string per line. */
export function Lines({ as: Tag = "h2", lines, className = "", delay }: { as?: ElementType; lines: ReactNode[]; className?: string; delay?: number }) {
  return (
    <Tag className={className} data-reveal="lines" data-delay={delay}>
      {lines.map((l, i) => (
        <span key={i} className="line block overflow-hidden pb-[0.08em]">
          <span className="block">{l}</span>
        </span>
      ))}
    </Tag>
  );
}
