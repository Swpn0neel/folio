import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-mono font-bold group leading-none">
          <Logo className="h-5 w-5 group-hover:text-neon transition-colors" />
          <span className="text-foreground">~/folio</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-muted-foreground">
          <a href="#features" className="hover:text-neon transition-colors leading-none">./features</a>
          <a href="#preview" className="hover:text-neon transition-colors leading-none">./preview</a>
          <a href="#sections" className="hover:text-neon transition-colors leading-none">./sections</a>
          <a href="#install" className="hover:text-neon transition-colors leading-none">/.claim</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex h-8 px-3 text-xs font-mono items-center border border-border hover:border-neon hover:text-neon transition-colors">
            login
          </Link>
          <Link to="/signup" className="h-8 px-3 text-xs font-mono font-bold inline-flex items-center bg-neon text-background hover:shadow-glow-neon transition-shadow">
            signup
          </Link>
        </div>
      </nav>
    </header>
  );
}
