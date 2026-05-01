import { Github, Twitter, Linkedin, Globe, ExternalLink, Award, Briefcase, BookOpen, FolderGit2 } from "lucide-react";
import avatar from "@/assets/avatar-sample.jpg";

export function PortfolioPreview() {
  return (
    <section id="preview" className="relative py-24 border-b border-border">
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-xs text-muted-foreground mb-3">
            <span className="text-amber">/**</span> preview <span className="text-amber">*/</span>
          </p>
          <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-neon">render</span>(&lt;You/&gt;)
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            <span className="text-amber">// </span> what shows up at folio.dev/u/alex
          </p>
        </div>

        {/* Browser/IDE chrome */}
        <div className="border border-border bg-card shadow-brutal">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary">
            <span className="h-3 w-3 bg-destructive" />
            <span className="h-3 w-3 bg-amber" />
            <span className="h-3 w-3 bg-neon" />
            <div className="ml-3 flex-1 max-w-md mx-auto border border-border bg-background px-3 py-0.5 text-xs font-mono text-muted-foreground text-center">
              <span className="text-neon">https://</span>folio.dev/u/<span className="text-magenta">alex</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">200 OK · 12ms</span>
          </div>

          <div className="p-6 md:p-10">
            {/* Profile */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Alex Rivera"
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-40 w-40 object-cover border-2 border-neon shadow-brutal"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-2xl font-bold">
                  Alex Rivera<span className="animate-blink text-neon">_</span>
                </h3>
                <p className="font-mono text-xs text-cyan mt-1">
                  @alex · Staff Engineer @Vercel
                </p>
                <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed">
                  loves to build dev tools. write about typescript, edge runtimes,
                  and the art of shipping fast. currently exploring the world of AI 
                  and its applications in web development.
                </p>
                <div className="flex gap-2 mt-4">
                  {[Github, Twitter, Linkedin, Globe].map((Icon, i) => (
                    <a key={i} href="#" className="h-9 w-9 inline-flex items-center justify-center border border-border hover:border-neon hover:text-neon transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections grid */}
            <div className="mt-10 grid grid-cols-1 gap-px bg-border border border-border">
              <SectionCard icon={FolderGit2} label="projects" accent="text-neon">
                <Item title="next-edge-cache" meta="typescript · 2.4k ★" desc="zero-config edge cache for next.js" />
                <Item title="folio" meta="react · 890 ★" desc="the portfolio builder you're looking at" />
              </SectionCard>

              <SectionCard icon={BookOpen} label="writing" accent="text-magenta">
                <Item title="why edge functions changed my stack" meta="12 min · 18k reads" />
                <Item title="a field guide to typescript generics" meta="8 min · 9.2k reads" />
              </SectionCard>

              <SectionCard icon={Briefcase} label="experience" accent="text-cyan">
                <Item title="vercel — staff engineer" meta="2023 → present" />
                <Item title="stripe — senior engineer" meta="2019 → 2023" />
              </SectionCard>

              <SectionCard icon={Award} label="achievements" accent="text-amber">
                <Item title="github star, 2024" meta="open source recognition" />
                <Item title="speaker @ jsconf eu" meta="berlin, 2023" />
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionCard({
  icon: Icon,
  label,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-border">
        <Icon className={`h-4 w-4 ${accent}`} />
        <span className={`font-mono text-xs font-bold uppercase tracking-widest ${accent}`}>
          {">"} {label}
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ title, meta, desc }: { title: string; meta: string; desc?: string }) {
  return (
    <div className="group flex items-start justify-between gap-3 p-2 -mx-2 hover:bg-secondary/50 transition-colors">
      <div className="min-w-0">
        <p className="font-mono text-sm font-medium truncate">{title}</p>
        <p className="text-xs font-mono text-muted-foreground mt-0.5">{meta}</p>
        {desc && <p className="text-xs text-muted-foreground mt-1">{desc}</p>}
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-neon transition-colors mt-1 shrink-0" />
    </div>
  );
}
