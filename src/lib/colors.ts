import { PortfolioThemeId } from "./portfolio";

export type SectionColor = { key: string; label: string; css: string };

export const SECTION_COLOR_GROUPS: Record<PortfolioThemeId, SectionColor[]> = {
  terminal: [
    { key: "neon", label: "neon", css: "var(--neon)" },
    { key: "cyan", label: "cyan", css: "var(--cyan)" },
    { key: "magenta", label: "magenta", css: "var(--magenta)" },
    { key: "amber", label: "amber", css: "var(--amber)" },
    { key: "indigo", label: "indigo", css: "var(--indigo)" },
    { key: "rose", label: "rose", css: "var(--rose)" },
  ],
  vercel: [
    { key: "develop", label: "develop", css: "#171717" },
    { key: "preview", label: "preview", css: "#de1d8d" },
    { key: "ship", label: "ship", css: "#ff5b4f" },
    { key: "console", label: "console", css: "#0070f3" },
    { key: "purply", label: "purply", css: "#7928ca" },
    { key: "pinky", label: "pinky", css: "#eb367f" },
  ],
  vercelDark: [
    { key: "developDark", label: "develop", css: "#fafafa" },
    { key: "preview", label: "preview", css: "#de1d8d" },
    { key: "ship", label: "ship", css: "#ff5b4f" },
    { key: "console", label: "console", css: "#0070f3" },
    { key: "purply", label: "purply", css: "#7928ca" },
    { key: "pinky", label: "pinky", css: "#eb367f" },
  ],
  material: [
    { key: "lavender", label: "lavender", css: "oklch(0.62 0.17 305)" },
    { key: "blossom", label: "blossom", css: "oklch(0.74 0.16 350)" },
    { key: "seafoam", label: "seafoam", css: "oklch(0.78 0.13 170)" },
    { key: "daySky", label: "day sky", css: "oklch(0.73 0.12 235)" },
    { key: "sunset", label: "sunset", css: "oklch(0.76 0.16 45)" },
    { key: "marigold", label: "marigold", css: "oklch(0.82 0.15 90)" },
  ],
  editorial: [
    { key: "charcoal", label: "charcoal", css: "oklch(0.24 0.03 255)" },
    { key: "ochre", label: "ochre", css: "oklch(0.58 0.13 75)" },
    { key: "brick", label: "brick", css: "oklch(0.50 0.15 32)" },
    { key: "forest", label: "forest", css: "oklch(0.42 0.10 155)" },
    { key: "navy", label: "navy", css: "oklch(0.36 0.10 255)" },
    { key: "plum", label: "plum", css: "oklch(0.42 0.12 320)" },
  ],
  studio: [
    { key: "hotPink", label: "hot pink", css: "oklch(0.69 0.25 358)" },
    { key: "electricBlue", label: "electric blue", css: "oklch(0.72 0.18 235)" },
    { key: "acid", label: "acid", css: "oklch(0.86 0.22 125)" },
    { key: "tangerine", label: "tangerine", css: "oklch(0.74 0.20 50)" },
    { key: "ultraviolet", label: "ultraviolet", css: "oklch(0.66 0.24 300)" },
    { key: "laserAqua", label: "laser aqua", css: "oklch(0.82 0.15 190)" },
  ],
};

const LEGACY_SECTION_COLORS: SectionColor[] = [
  { key: "emerald", label: "emerald", css: "oklch(0.72 0.20 155)" },
  { key: "lime", label: "lime", css: "oklch(0.84 0.20 125)" },
  { key: "sky", label: "sky", css: "oklch(0.72 0.17 235)" },
  { key: "blue", label: "blue", css: "oklch(0.62 0.22 255)" },
  { key: "purple", label: "purple", css: "oklch(0.64 0.23 305)" },
  { key: "pink", label: "pink", css: "oklch(0.72 0.24 350)" },
  { key: "coral", label: "coral", css: "oklch(0.72 0.20 35)" },
  { key: "orange", label: "orange", css: "oklch(0.76 0.19 55)" },
  { key: "gold", label: "gold", css: "oklch(0.82 0.16 95)" },
  { key: "mint", label: "mint", css: "oklch(0.82 0.14 170)" },
  { key: "teal", label: "teal", css: "oklch(0.70 0.15 190)" },
  { key: "slate", label: "slate", css: "oklch(0.55 0.05 255)" },
];

export const SECTION_COLORS = [...Object.values(SECTION_COLOR_GROUPS).flat(), ...LEGACY_SECTION_COLORS];

/** Resolves the CSS var string for a colour key. */
export function colorToCss(key: string): string {
  return SECTION_COLORS.find((c) => c.key === key)?.css ?? "var(--neon)";
}
