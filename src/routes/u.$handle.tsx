import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { loadPortfolioByHandle, type Portfolio } from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/Logo";

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
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadPortfolioByHandle(handle).then((data) => {
      if (data) {
        setPortfolio(data.portfolio);
        setOwnerId(data.userId);
      }
      setHydrated(true);
    });
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

  const theme = portfolio.theme ?? "terminal";
  const themedPageClass = theme === "terminal"
    ? "bg-background"
    : theme === "vercel"
      ? "bg-white text-zinc-950"
      : theme === "vercelDark"
        ? "bg-[#000000] text-zinc-50"
        : theme === "material"
          ? "bg-[linear-gradient(135deg,#fbf7ff_0%,#fff7ed_48%,#effdf7_100%)] text-[#1f1b24]"
          : theme === "editorial"
            ? "bg-[#f8fafc] text-slate-950"
            : "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.28),transparent_34%),linear-gradient(135deg,#111111,#171717_55%,#0f172a)] text-white";
  const themedHeaderClass = theme === "terminal"
    ? "border-border"
    : theme === "vercel"
      ? "border-zinc-200 bg-white/90"
      : theme === "vercelDark"
        ? "border-zinc-800 bg-[#000000]/90"
        : theme === "material"
          ? "border-[#e7dff5] bg-[#fbf7ff]/90"
          : theme === "editorial"
            ? "border-slate-300 bg-[#f8fafc]/90"
            : "border-white/10 bg-[#111111]/90";
  const themedLinkClass = theme === "terminal"
    ? "hover:text-neon"
    : theme === "vercelDark"
      ? "hover:text-white"
    : theme === "material"
      ? "hover:text-[#6750a4]"
      : theme === "studio"
        ? "hover:text-sky-300"
        : "hover:text-amber-700";

  return (
    <div className={`min-h-screen ${themedPageClass}`}>
      <header className={`border-b backdrop-blur ${themedHeaderClass}`}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-mono font-bold text-sm group leading-none">
            <Logo className="h-4 w-4 transition-opacity" />
            <span className="opacity-70 group-hover:opacity-100 transition-opacity leading-none">~/folio/{portfolio.handle}</span>
          </Link>
          {user && user.id === ownerId && (
            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-1 font-mono text-xs opacity-70 ${themedLinkClass}`}
            >
              <ArrowLeft className="h-3 w-3" /> edit
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <PortfolioRenderer portfolio={portfolio} framed={false} />
        <p className="mt-6 text-center font-mono text-xs opacity-70">
          <span className="text-neon">●</span> built with{" "}
          <Link to="/" className={`${themedLinkClass} underline`}>folio</Link> · ship yours in 60s
        </p>
      </main>
    </div>
  );
}
