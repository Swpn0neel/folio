import { Palette } from "lucide-react";
import { PORTFOLIO_THEMES, type PortfolioThemeId } from "@/lib/portfolio";

interface ThemePickerProps {
  value: PortfolioThemeId;
  onChange: (value: PortfolioThemeId) => void;
}

export function ThemePicker({
  value,
  onChange,
}: ThemePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PORTFOLIO_THEMES.map((theme) => {
        const active = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`group text-left border px-3 py-3 bg-background transition-colors ${
              active ? "border-neon shadow-brutal" : "border-border hover:border-cyan"
            }`}
            aria-pressed={active}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                <Palette className="mr-1.5 inline h-3.5 w-3.5 text-cyan" />
                {theme.label}
              </span>
              <span className={`h-2 w-2 shrink-0 ${active ? "bg-neon" : "bg-muted"}`} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{theme.desc}</p>
            <ThemeSwatches id={theme.id} />
          </button>
        );
      })}
    </div>
  );
}

function ThemeSwatches({ id }: { id: PortfolioThemeId }) {
  const swatches: Record<PortfolioThemeId, string[]> = {
    terminal: ["var(--neon)", "var(--magenta)", "var(--cyan)"],
    vercel: ["#000000", "#fafafa", "#a1a1aa"],
    vercelDark: ["#000000", "#27272a", "#f4f4f5"],
    material: ["#6750a4", "#ffb1c8", "#8bd8bd"],
    editorial: ["#111827", "#d97706", "#f8fafc"],
    studio: ["#111111", "#f43f5e", "#38bdf8"],
  };

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {swatches[id].map((color) => (
        <span
          key={color}
          className="h-2.5 w-8 border border-border"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}
