import avatar from "@/assets/avatar-sample.jpg";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import type { Portfolio } from "@/lib/portfolio";

const MOCK_PORTFOLIO: Portfolio = {
  handle: "alex",
  showHandle: true,
  fullName: "Alex Rivera",
  avatarUrl: avatar,
  tagline: "Staff Engineer @Vercel",
  bio: "loves to build dev tools. write about typescript, edge runtimes, and the art of shipping fast.\n\ncurrently exploring the world of AI and its applications in web development.",
  enabled: {
    profile: true,
    bio: true,
    socials: true,
    projects: true,
    blogs: true,
    experience: true,
    achievements: true,
    "custom:stack": true,
  },
  order: ["profile", "bio", "socials", "projects", "blogs", "experience", "achievements", "custom:stack"],
  sectionColors: {
    bio: "rose",
    socials: "cyan",
    blogs: "magenta",
    experience: "indigo",
    achievements: "amber",
  },
  socials: [
    { id: "s1", label: "github", url: "#" },
    { id: "s2", label: "twitter", url: "#" },
    { id: "s3", label: "linkedin", url: "#" },
    { id: "s4", label: "website", url: "#" },
  ],
  projects: [
    { id: "p1", name: "next-edge-cache", tech: "typescript · 2.4k ★", description: "zero-config edge cache for next.js" },
    { id: "p2", name: "folio", tech: "react · 890 ★", description: "the portfolio builder you're looking at" },
  ],
  blogs: [
    { id: "b1", title: "why edge functions changed my stack", meta: "12 min · 18k reads", url: "#" },
    { id: "b2", title: "a field guide to typescript generics", meta: "8 min · 9.2k reads", url: "#" },
  ],
  experience: [
    { id: "e1", role: "Staff Engineer", company: "Vercel", startDate: "2023", isCurrent: true, description: "Leading edge infrastructure and DX initiatives." },
    { id: "e2", role: "Senior Engineer", company: "Stripe", startDate: "2019", endDate: "2023", isCurrent: false, description: "Built core payment APIs and developer tools." },
  ],
  achievements: [
    { id: "a1", title: "github star, 2024", meta: "open source recognition" },
    { id: "a2", title: "speaker @ jsconf eu", meta: "berlin, 2023" },
  ],
  customSections: [
    {
      id: "custom:stack",
      title: "tech stack",
      items: [
        { id: "i1", title: "frontend", subheading: "react · next.js · tailwind" },
        { id: "i2", title: "backend", subheading: "node.js · go · postgres" },
      ],
    },
  ],
};

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
          <div className="relative flex items-center h-10 px-4 border-b border-border bg-secondary shrink-0 z-10">
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-3 w-3 bg-destructive" />
              <span className="h-3 w-3 bg-amber" />
              <span className="h-3 w-3 bg-neon" />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[180px] sm:max-w-md border border-border bg-background px-3 py-0.5 text-xs font-mono text-muted-foreground text-center truncate">
              <span className="text-neon">https://</span>folio.dev/u/<span className="text-magenta">alex</span>
            </div>
            <div className="ml-auto shrink-0 hidden sm:block">
              <span className="text-[10px] font-mono text-muted-foreground">200 OK · 12ms</span>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto scrollbar-hide bg-background/50">
            <PortfolioRenderer portfolio={MOCK_PORTFOLIO} framed={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

