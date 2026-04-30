import { Blocks, MoveVertical, Globe2, Terminal, Eye, Rocket } from "lucide-react";

const features = [
  { icon: Blocks, key: "modular", title: "modular sections", desc: "bio · projects · blogs · experience · achievements · socials. toggle what matters.", color: "neon" },
  { icon: MoveVertical, key: "reorder", title: "drag to reorder", desc: "lead with blogs. or projects. or just a killer bio. your story, your stack order.", color: "magenta" },
  { icon: Globe2, key: "handle", title: "your own handle", desc: "folio.dev/u/yourname. instant. shareable. yours.", color: "cyan" },
  { icon: Terminal, key: "engineer", title: "made for engineers", desc: "mono everything. github + rss imports. syntax-aware project cards.", color: "amber" },
  { icon: Eye, key: "preview", title: "live preview", desc: "wysiwyg. every keystroke renders exactly what visitors will see.", color: "violet" },
  { icon: Rocket, key: "ship", title: "ship instantly", desc: "no deploys. no dns. save → live worldwide on the edge.", color: "neon" },
];

const colorMap: Record<string, { text: string; border: string; shadow: string }> = {
  neon: { text: "text-neon", border: "hover:border-neon", shadow: "hover:shadow-brutal" },
  magenta: { text: "text-magenta", border: "hover:border-magenta", shadow: "hover:shadow-brutal-magenta" },
  cyan: { text: "text-cyan", border: "hover:border-cyan", shadow: "hover:shadow-brutal-cyan" },
  amber: { text: "text-amber", border: "hover:border-amber", shadow: "hover:shadow-brutal-amber" },
  violet: { text: "text-violet", border: "hover:border-magenta", shadow: "hover:shadow-brutal-magenta" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div
                key={f.key}
                className={`group relative bg-card p-7 transition-all duration-200 ${c.border} ${c.shadow} hover:z-10 hover:-translate-x-0.5 hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between mb-5">
                  <f.icon className={`h-6 w-6 ${c.text}`} />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                </div>
                <h3 className="font-mono text-base font-bold mb-2">
                  <span className={c.text}>{">"}</span> {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
