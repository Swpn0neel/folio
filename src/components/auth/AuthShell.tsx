import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { TerminalSquare } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold">
            <span>~/folio</span>
            <span className="text-neon animate-blink">_</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid opacity-50" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-magenta/10 blur-3xl" />

        <div className="w-full max-w-md">
          <div className="border border-border bg-card shadow-brutal">
            <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 bg-secondary">
              <span className="h-2.5 w-2.5 bg-destructive" />
              <span className="h-2.5 w-2.5 bg-amber" />
              <span className="h-2.5 w-2.5 bg-neon" />
              <span className="ml-2 text-[10px] font-mono text-muted-foreground">{title}.sh</span>
            </div>
            <div className="p-7">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-amber">// </span>
                {subtitle}
              </p>
              <h1 className="mt-2 font-mono text-2xl font-bold">
                <span className="text-muted-foreground">$ </span>
                <span className="text-neon">{title}</span>
                <span className="animate-blink text-neon">_</span>
              </h1>
              <div className="mt-6">{children}</div>
            </div>
            <div className="border-t border-border px-7 py-4 bg-secondary/40 font-mono text-xs text-muted-foreground">
              {footer}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
