import { ArrowRight, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section id="install" className="py-24 border-b border-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="border border-neon bg-card shadow-brutal">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 bg-secondary">
            <span className="h-2.5 w-2.5 bg-destructive" />
            <span className="h-2.5 w-2.5 bg-amber" />
            <span className="h-2.5 w-2.5 bg-neon" />
            <span className="ml-2 text-[10px] font-mono text-muted-foreground">install.sh</span>
          </div>
          <div className="p-8 md:p-14 text-center">
            <p className="font-mono text-xs text-muted-foreground mb-6">
              <span className="text-amber">// </span> your handle is waiting
            </p>
            <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="text-muted-foreground">$</span> get{" "}
              <span className="text-neon">folio</span>
              <br />
              {/* <span className="text-magenta">→</span> ship in 60s<span className="animate-blink text-neon">_</span> */}
            </h2>
            <p className="mt-6 text-sm text-muted-foreground max-w-md mx-auto">
              spin up a portfolio that makes recruiters stop scrolling.
              free forever. no credit card. no catch.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center font-mono text-sm">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-neon text-background font-bold hover:shadow-glow-neon transition-shadow">
                claim your folio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
