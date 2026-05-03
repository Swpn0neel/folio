import { ArrowRight, Github } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function Hero() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  
  // Typewriter effect
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["engineers", "developers", "coders", "creators", "builders"];
  const speed = isDeleting ? 50 : 150;

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting;
      
      setText(prev => 
        shouldDelete 
          ? currentWord.substring(0, prev.length - 1)
          : currentWord.substring(0, prev.length + 1)
      );

      if (!shouldDelete && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (shouldDelete && text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  const claim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
    navigate({ 
      to: "/signup",
      search: clean ? { handle: clean } : undefined 
    });
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-background/40 to-background" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-neon/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-magenta/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 pt-20 pb-28">
        {/* Status line */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-10">
          <span className="inline-flex items-center gap-2 border border-border px-2 py-1">
            <span className="h-1.5 w-1.5 bg-neon shadow-glow-neon" />
            <span>build:passing</span>
          </span>
          {/* <span className="hidden sm:inline">v1.0.0-beta</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">MIT</span> */}
        </div>

        <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          <span className="text-muted-foreground">$</span> portfolio<span className="text-magenta">.</span>build<span className="text-cyan">()</span>
          <br />
          <span className="text-2xl sm:text-4xl md:text-5xl mt-2 block text-muted-foreground">
            <span>{"> "}</span><span className="sm:invisible max-sm:hidden">{"-"}</span>for {text}<span className="animate-blink text-neon">_</span>
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          <span className="text-amber">{"::"} </span>
          A brutalist portfolio builder for devs who'd rather ship than design.
          Toggle sections, reorder them, and also get a public link at{" "}
          <span className="text-neon">fo1io.vercel.app/u/&lt;you&gt;</span>.
        </p>

        {/* Terminal handle input */}
        <form onSubmit={claim} className="mt-10 max-w-xl border border-border bg-card shadow-brutal">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 bg-secondary">
            <span className="h-2.5 w-2.5 bg-destructive" />
            <span className="h-2.5 w-2.5 bg-amber" />
            <span className="h-2.5 w-2.5 bg-neon" />
            <span className="ml-2 text-[10px] font-mono text-muted-foreground">claim — bash</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-muted-foreground">
              <span className="text-neon">user@folio</span>:<span className="text-cyan">~</span>$ claim --handle
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-magenta shrink-0">fo1io.vercel.app/u/</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="yourhandle"
                className="flex-1 bg-transparent outline-none border-b border-dashed border-border focus:border-neon text-foreground placeholder:text-muted-foreground/40 py-1 min-w-0"
              />
              <button type="submit" className="inline-flex items-center gap-1 px-3 py-1.5 bg-neon text-background font-bold text-xs hover:shadow-glow-neon transition-shadow">
                exec <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-muted-foreground">
            <span className="text-neon">●</span> 100% free  
            <span className="mx-2">·</span>
            no credit card  
            <span className="mx-2">·</span>
            ready in &lt;60s
          </span>
        </div>
      </div>
    </section>
  );
}
