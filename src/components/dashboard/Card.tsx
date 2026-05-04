import type { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  shadowCss?: string;
  children: ReactNode;
}

export function Card({
  title,
  subtitle,
  shadowCss,
  children,
}: CardProps) {
  return (
    <section
      className="border border-border bg-background p-5 transition-all duration-300"
      style={{ boxShadow: `6px 6px 0 0 ${shadowCss || "var(--neon)"}` }}
    >
      <div className="flex flex-col gap-1 mb-5">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
          <span className="text-neon">●</span> {title}
        </h3>
        {subtitle && <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
