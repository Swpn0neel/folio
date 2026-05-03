import { Blocks, MoveVertical, Globe2, Terminal, Eye, Rocket } from "lucide-react";

const features = [
  { icon: Blocks, key: "modular", title: "modular sections", desc: "bio · projects · blogs · experience · achievements · socials. toggle what matters.", color: "neon" },
  { icon: MoveVertical, key: "reorder", title: "drag to reorder", desc: "lead with blogs. or projects. or just a killer bio. your story, your stack order.", color: "magenta" },
  { icon: Globe2, key: "handle", title: "your own handle", desc: "fo1io.vercel.app/u/yourname. instant. shareable. yours.", color: "cyan" },
  { icon: Terminal, key: "engineer", title: "made for engineers", desc: "mono everything. github + rss imports. syntax-aware project cards.", color: "amber" },
  { icon: Eye, key: "preview", title: "live preview", desc: "wysiwyg. every keystroke renders exactly what visitors will see.", color: "violet" },
  { icon: Rocket, key: "ship", title: "ship instantly", desc: "no deploys. no dns. save → live worldwide on the edge.", color: "neon" },
];

const colorMap: Record<string, { text: string; border: string; accent: string }> = {
  neon: { text: "text-neon", border: "hover:border-neon", accent: "var(--neon)" },
  magenta: { text: "text-magenta", border: "hover:border-magenta", accent: "var(--magenta)" },
  cyan: { text: "text-cyan", border: "hover:border-cyan", accent: "var(--cyan)" },
  amber: { text: "text-amber", border: "hover:border-amber", accent: "var(--amber)" },
  violet: { text: "text-violet", border: "hover:border-violet", accent: "var(--violet)" },
};

export function Features() {
  return (
    <section id="features" className="relative py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-xs text-muted-foreground mb-3">
            <span className="text-amber">/**</span> features <span className="text-amber">*/</span>
          </p>
          <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-neon">const</span> features ={">"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border overflow-hidden">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div
                key={f.key}
                style={{ "--tile-accent": c.accent } as React.CSSProperties}
                className={`group relative bg-card p-8 transition-all duration-300 ${c.border} hover:z-10 hover-feature-shadow cursor-pointer`}
              >
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-2 right-2 w-full h-[1px] bg-[var(--tile-accent)]" />
                  <div className="absolute top-2 right-2 w-[1px] h-full bg-[var(--tile-accent)]" />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className={`p-2 border border-transparent group-hover:border-[var(--tile-accent)] transition-colors duration-300`}>
                    <f.icon className={`h-6 w-6 ${c.text} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                </div>

                <h3 className="font-mono text-base font-bold mb-3 flex items-center gap-2">
                  <span className={c.text}>{">"}</span>
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                  {f.desc}
                </p>

                {/* Bottom decorative bar */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--tile-accent)] transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
