export type BuiltInSectionId =
  | "profile"
  | "bio"
  | "socials"
  | "projects"
  | "blogs"
  | "experience"
  | "achievements";

// SectionId is widened to string to accommodate dynamic custom section IDs ("custom:<uid>")
export type SectionId = BuiltInSectionId | string;

export type CustomSectionTemplate = "simple" | "linkCards" | "timeline" | "gallery" | "stats" | "textBox";

export const CUSTOM_SECTION_TEMPLATES: Array<{
  id: CustomSectionTemplate;
  label: string;
  desc: string;
}> = [
  { id: "simple", label: "simple list", desc: "title, meta, description, link" },
  { id: "linkCards", label: "link cards", desc: "featured links with context" },
  { id: "timeline", label: "timeline", desc: "dated milestones and events" },
  { id: "gallery", label: "gallery", desc: "image-led work or media" },
  { id: "stats", label: "stats", desc: "numbers, labels, and notes" },
  { id: "textBox", label: "text box", desc: "multi-line text block" },
];

export function isCustomSectionTemplate(value: unknown): value is CustomSectionTemplate {
  return CUSTOM_SECTION_TEMPLATES.some((template) => template.id === value);
}

export function getCustomSectionTemplateMeta(template: CustomSectionTemplate) {
  return CUSTOM_SECTION_TEMPLATES.find((item) => item.id === template) ?? CUSTOM_SECTION_TEMPLATES[0];
}

export type CustomSectionItem = {
  id: string;
  title: string;
  subheading?: string;
  meta?: string;
  link?: string;
  description?: string;
  date?: string;
  imageUrl?: string;
  value?: string;
};

export type CustomSection = {
  id: string; // matches the SectionId "custom:<uid>"
  title: string; // user-defined section title
  template: CustomSectionTemplate;
  items: CustomSectionItem[];
};

export type PortfolioThemeId = "terminal" | "vercel" | "vercelDark" | "material" | "editorial" | "studio";

export const PORTFOLIO_THEMES: Array<{
  id: PortfolioThemeId;
  label: string;
  desc: string;
}> = [
  { id: "terminal", label: "terminal developer", desc: "mono, sharp, command-line focused" },
  { id: "vercel", label: "vercel light", desc: "clean, monochrome, product-builder feel" },
  { id: "vercelDark", label: "vercel dark", desc: "same minimal system, tuned for dark mode" },
  { id: "material", label: "material you", desc: "colorful cards with soft adaptive surfaces" },
  { id: "editorial", label: "editorial resume", desc: "polished writing-first professional page" },
  { id: "studio", label: "creative studio", desc: "bold portfolio grid with punchy accents" },
];

export function isPortfolioThemeId(value: unknown): value is PortfolioThemeId {
  return PORTFOLIO_THEMES.some((theme) => theme.id === value);
}

export type Social = {
  id: string;
  label: string; // github, x, linkedin, website, etc.
  url: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  tech?: string;
};

export type Blog = {
  id: string;
  title: string;
  url: string;
  meta?: string; // "12 min · 18k reads"
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  period?: string; // Keep for legacy, but we'll prefer dates
  description?: string;
};

export type Achievement = {
  id: string;
  title: string;
  meta?: string;
};

export type Portfolio = {
  theme: PortfolioThemeId;
  handle: string;
  showHandle: boolean;
  fullName: string;
  avatarUrl: string;
  tagline: string;
  bio: string;
  enabled: Record<string, boolean>;
  order: SectionId[];
  socials: Social[];
  projects: Project[];
  blogs: Blog[];
  experience: Experience[];
  achievements: Achievement[];
  customSections: CustomSection[];
  /** per-section accent color key, e.g. "neon" | "cyan" | … */
  sectionColors: Record<string, string>;
};

export const BUILT_IN_SECTIONS: BuiltInSectionId[] = [
  "profile",
  "bio",
  "socials",
  "projects",
  "blogs",
  "experience",
  "achievements",
];

/** @deprecated use BUILT_IN_SECTIONS */
export const ALL_SECTIONS = BUILT_IN_SECTIONS;

export const SECTION_META: Record<BuiltInSectionId, { label: string; desc: string; accent: string }> = {
  profile: { label: "profile", desc: "name · avatar · tag", accent: "text-neon" },
  bio: { label: "bio", desc: "about you · in your words", accent: "text-rose" },
  socials: { label: "socials", desc: "github · x · etc", accent: "text-cyan" },
  projects: { label: "projects", desc: "what you've built", accent: "text-neon" },
  blogs: { label: "blogs", desc: "what you've written", accent: "text-magenta" },
  experience: { label: "experience", desc: "where you've worked", accent: "text-indigo" },
  achievements: { label: "achievements", desc: "talks · awards · milestones", accent: "text-amber" },
};

/** Returns metadata for any section ID, falling back gracefully for custom sections. */
export function getSectionMeta(id: SectionId, customSections: CustomSection[]): { label: string; desc: string; accent: string } {
  if (id in SECTION_META) return SECTION_META[id as BuiltInSectionId];
  const custom = customSections.find((s) => s.id === id);
  const templateMeta = getCustomSectionTemplateMeta(custom?.template ?? "simple");
  return {
    label: custom?.title || "custom",
    desc: `${custom?.items.length ?? 0} item${(custom?.items.length ?? 0) !== 1 ? "s" : ""} · ${templateMeta.label}`,
    accent: "text-magenta",
  };
}

const STORAGE_KEY = "folio:portfolio";

function normalizeCustomItem(item: Partial<CustomSectionItem>): CustomSectionItem {
  const meta = item.meta ?? item.subheading ?? "";
  return {
    ...item,
    id: item.id || uid(),
    title: item.title ?? "",
    subheading: item.subheading ?? meta,
    meta,
    link: item.link ?? "",
    description: item.description ?? "",
  };
}

function normalizeCustomSection(section: Partial<CustomSection>): CustomSection {
  return {
    id: section.id || `custom:${uid()}`,
    title: section.title ?? "",
    template: isCustomSectionTemplate(section.template) ? section.template : "simple",
    items: (section.items ?? []).map(normalizeCustomItem),
  };
}

export const defaultPortfolio = (): Portfolio => ({
  theme: "terminal",
  handle: "you",
  showHandle: true,
  fullName: "Your Name",
  avatarUrl: "",
  tagline: "engineer · builder · writer",
  bio: "",
  enabled: {
    profile: true,
    bio: true,
    socials: true,
    projects: true,
    blogs: true,
    experience: false,
    achievements: false,
  },
  sectionColors: {},
  order: ["profile", "bio", "socials", "projects", "blogs", "experience", "achievements"],
  socials: [
    { id: "s1", label: "github", url: "https://github.com/" },
  ],
  projects: [
    {
      id: "p1",
      name: "my-first-project",
      description: "a short, punchy line about what it does and why it's cool.",
      url: "https://github.com/",
      tech: "typescript · react",
    },
  ],
  blogs: [],
  experience: [],
  achievements: [],
  customSections: [],
});

export function loadPortfolio(): Portfolio {
  if (typeof window === "undefined") return defaultPortfolio();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPortfolio();
    const parsed = JSON.parse(raw) as Partial<Portfolio>;
    const base = defaultPortfolio();
    let order = parsed.order && parsed.order.length ? parsed.order : base.order;
    // Migrate: inject "bio" after "profile" if missing from saved order
    if (!order.includes("bio")) {
      const profileIdx = order.indexOf("profile");
      order = [
        ...order.slice(0, profileIdx + 1),
        "bio",
        ...order.slice(profileIdx + 1),
      ];
    }
    // Merge defensively against schema drift
    const customSections: CustomSection[] = (parsed.customSections ?? []).map(normalizeCustomSection);
    // Ensure any custom section IDs present in customSections are represented in order / enabled
    const customIds = customSections.map((s) => s.id);
    const mergedOrder = [
      ...order.filter((id) => !id.startsWith("custom:")),
      ...customIds.filter((id) => order.includes(id)),
      ...customIds.filter((id) => !order.includes(id)), // newly added
    ];
    const customEnabled: Record<string, boolean> = {};
    for (const id of customIds) {
      customEnabled[id] = parsed.enabled?.[id] ?? true;
    }
    return {
      ...base,
      ...parsed,
      theme: isPortfolioThemeId(parsed.theme) ? parsed.theme : base.theme,
      handle: parsed.handle || base.handle, // Fallback to "you" if empty
      enabled: { ...base.enabled, ...(parsed.enabled ?? {}), ...customEnabled },
      sectionColors: parsed.sectionColors ?? {},
      order: mergedOrder,
      socials: parsed.socials ?? [],
      projects: parsed.projects ?? [],
      blogs: parsed.blogs ?? [],
      experience: parsed.experience ?? [],
      achievements: parsed.achievements ?? [],
      customSections,
    };
  } catch {
    return defaultPortfolio();
  }
}

export function savePortfolio(p: Portfolio) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    if (p.handle) localStorage.setItem("folio:handle", p.handle);
  } catch {
    // ignore quota / privacy errors
  }
}

export function loadPortfolioByHandle(handle: string): Portfolio | null {
  const p = loadPortfolio();
  if (p.handle.toLowerCase() === handle.toLowerCase()) return p;
  return null;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
