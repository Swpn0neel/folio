import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Hacker",
    price: "Free",
    desc: "Everything you need to ship a great portfolio.",
    features: ["folio.vercel.app/u/handle", "All sections unlocked", "Drag-to-reorder", "Unlimited updates"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$6",
    suffix: "/mo",
    desc: "Bring your own domain and stand out from the rest.",
    features: ["Custom domain", "Remove Folio badge", "Analytics", "Priority support", "Early access to themes"],
    cta: "Go Pro",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">// pricing</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Free to start. <span className="text-gradient">Cheap to grow.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 border ${
                t.featured
                  ? "border-transparent bg-gradient-hero text-white shadow-glow"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {t.featured && (
                <span className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-wider bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                  Most loved
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <p className={`mt-1 text-sm ${t.featured ? "text-white/80" : "text-muted-foreground"}`}>{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                {t.suffix && <span className={t.featured ? "text-white/80" : "text-muted-foreground"}>{t.suffix}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 ${t.featured ? "text-white" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full rounded-full ${
                  t.featured
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {t.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
