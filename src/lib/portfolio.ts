export type SectionId =
  | "profile"
  | "socials"
  | "projects"
  | "blogs"
  | "experience"
  | "achievements";

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
  period: string; // "2023 — Present"
  description?: string;
};

export type Achievement = {
  id: string;
  title: string;
  meta?: string;
};

export type Portfolio = {
  handle: string;
  fullName: string;
  avatarUrl: string;
  tagline: string;
  bio: string;
  enabled: Record<SectionId, boolean>;
  order: SectionId[];
  socials: Social[];
  projects: Project[];
  blogs: Blog[];
  experience: Experience[];
  achievements: Achievement[];
};

export const ALL_SECTIONS: SectionId[] = [
  "profile",
  "socials",
  "projects",
  "blogs",
  "experience",
  "achievements",
];

export const SECTION_META: Record<SectionId, { label: string; desc: string; accent: string }> = {
  profile: { label: "profile", desc: "name · avatar · bio", accent: "text-neon" },
  socials: { label: "socials", desc: "github · x · linkedin · site", accent: "text-cyan" },
  projects: { label: "projects", desc: "what you've built", accent: "text-neon" },
  blogs: { label: "blogs", desc: "what you've written", accent: "text-magenta" },
  experience: { label: "experience", desc: "where you've worked", accent: "text-cyan" },
  achievements: { label: "achievements", desc: "talks · awards · milestones", accent: "text-amber" },
};

const STORAGE_KEY = "folio:portfolio";

export const defaultPortfolio = (): Portfolio => ({
  handle: "you",
  fullName: "Your Name",
  avatarUrl: "",
  tagline: "engineer · builder · writer",
  bio: "// write a short, sharp bio. what do you build, what do you care about?",
  enabled: {
    profile: true,
    socials: true,
    projects: true,
    blogs: true,
    experience: false,
    achievements: false,
  },
  order: ["profile", "socials", "projects", "blogs", "experience", "achievements"],
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
});

export function loadPortfolio(): Portfolio {
  if (typeof window === "undefined") return defaultPortfolio();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPortfolio();
    const parsed = JSON.parse(raw) as Partial<Portfolio>;
    const base = defaultPortfolio();
    // Merge defensively against schema drift
    return {
      ...base,
      ...parsed,
      enabled: { ...base.enabled, ...(parsed.enabled ?? {}) },
      order: parsed.order && parsed.order.length ? parsed.order : base.order,
      socials: parsed.socials ?? [],
      projects: parsed.projects ?? [],
      blogs: parsed.blogs ?? [],
      experience: parsed.experience ?? [],
      achievements: parsed.achievements ?? [],
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
