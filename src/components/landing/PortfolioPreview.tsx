"use client";

import { useState } from "react";
import { Palette, Sparkles } from "lucide-react";
import avatar from "@/assets/avatar-sample.jpg";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { PORTFOLIO_THEMES, type Portfolio, type PortfolioThemeId } from "@/lib/portfolio";

const MOCK_PORTFOLIO: Omit<Portfolio, "theme"> = {
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
      template: "stats",
      items: [
        { id: "i1", title: "frontend", value: "18", meta: "production launches", subheading: "production launches", description: "react · next.js · tailwind" },
        { id: "i2", title: "backend", value: "9", meta: "core services", subheading: "core services", description: "node.js · go · postgres" },
      ],
    },
  ],
};

export function PortfolioPreview() {
  const [theme, setTheme] = useState<PortfolioThemeId>("terminal");

  const previewPortfolio: Portfolio = {
    ...(MOCK_PORTFOLIO as Portfolio),
    theme,
  };

  return (
    <section id="preview" className="relative py-24 border-b border-border">
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header Section */}
        <div className="max-w-2xl mb-8">
          <p className="font-mono text-xs text-muted-foreground mb-3">
            <span className="text-amber">/**</span> preview <span className="text-amber">*/</span>
          </p>
          <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-neon">render</span>(&lt;You/&gt;)
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            <span className="text-amber">// </span> what shows up at folio.vercel.app/u/alex
          </p>
        </div>

        {/* Theme Selector Row */}
        <div className="w-full mb-8 overflow-hidden">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
            <Palette className="h-3.5 w-3.5 text-magenta" />
            <span>select_theme()</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
            {PORTFOLIO_THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative px-4 py-2 font-mono text-xs transition-all duration-300 border group overflow-hidden shrink-0 ${
                    isActive
                      ? "border-neon text-neon bg-neon/10 shadow-[0_0_15px_rgba(var(--color-neon),0.2)]"
                      : "border-border bg-background text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-neon/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && <Sparkles className="h-3 w-3" />}
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="h-[750px] w-full transition-all duration-500 ease-in-out">
          <PortfolioRenderer portfolio={previewPortfolio} framed={true} />
        </div>
      </div>
    </section>
  );
}
