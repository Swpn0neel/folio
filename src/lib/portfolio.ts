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

export type CustomSectionItem = {
  id: string;
  title: string;
  subheading?: string;
  link?: string;
  description?: string;
};

export type CustomSection = {
  id: string; // matches the SectionId "custom:<uid>"
  title: string; // user-defined section title
  items: CustomSectionItem[];
};

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
  profile: { label: "profile", desc: "name · avatar · tagline", accent: "text-neon" },
  bio: { label: "bio", desc: "about you · in your words", accent: "text-rose" },
  socials: { label: "socials", desc: "github · x · linkedin · site", accent: "text-cyan" },
  projects: { label: "projects", desc: "what you've built", accent: "text-neon" },
  blogs: { label: "blogs", desc: "what you've written", accent: "text-magenta" },
  experience: { label: "experience", desc: "where you've worked", accent: "text-indigo" },
  achievements: { label: "achievements", desc: "talks · awards · milestones", accent: "text-amber" },
};

/** Returns metadata for any section ID, falling back gracefully for custom sections. */
export function getSectionMeta(id: SectionId, customSections: CustomSection[]): { label: string; desc: string; accent: string } {
  if (id in SECTION_META) return SECTION_META[id as BuiltInSectionId];
  const custom = customSections.find((s) => s.id === id);
  return {
    label: custom?.title || "custom",
    desc: `${custom?.items.length ?? 0} item${(custom?.items.length ?? 0) !== 1 ? "s" : ""} · custom section`,
    accent: "text-magenta",
  };
}

const STORAGE_KEY = "folio:portfolio";

export const defaultPortfolio = (): Portfolio => ({
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
    const customSections: CustomSection[] = parsed.customSections ?? [];
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
