import { TerminalSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-neon" />
          <span>~/folio</span>
          <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <p className="text-muted-foreground">
          // made for builders, by builders
        </p>
      </div>
    </footer>
  );
}
