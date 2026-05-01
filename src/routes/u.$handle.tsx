import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, TerminalSquare } from "lucide-react";
import { loadPortfolioByHandle, type Portfolio } from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";

export const Route = createFileRoute("/u/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.handle} — folio` },
      { name: "description", content: `${params.handle}'s folio portfolio.` },
    ],
  }),
  component: PublicPortfolio,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center font-mono">
        <p className="text-magenta">404</p>
        <p className="mt-2 text-muted-foreground">// no portfolio at that handle (yet)</p>
        <Link to="/dashboard" className="mt-6 inline-block text-neon hover:underline">
          ./dashboard
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <p className="font-mono text-destructive">err: {error.message}</p>
    </div>
  ),
});

function PublicPortfolio() {
  const { handle } = Route.useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPortfolio(loadPortfolioByHandle(handle));
    setHydrated(true);
  }, [handle]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-xs text-muted-foreground">loading<span className="animate-blink">_</span></p>
      </div>
    );
  }

  if (!portfolio) {
    throw notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm">
            <TerminalSquare className="h-4 w-4 text-neon" />
            <span>~/folio</span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-neon"
          >
            <ArrowLeft className="h-3 w-3" /> edit
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <PortfolioRenderer portfolio={portfolio} framed={false} />
        <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
          <span className="text-neon">●</span> built with{" "}
          <Link to="/" className="hover:text-neon underline">folio</Link> · ship yours in 60s
        </p>
      </main>
    </div>
  );
}
