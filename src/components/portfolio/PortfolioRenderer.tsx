import { Github, Twitter, Linkedin, Globe, ExternalLink, Award, Briefcase, BookOpen, FolderGit2, Link2, Mail, CircleHelp, LayoutTemplate } from "lucide-react";
import type { Portfolio, SectionId } from "@/lib/portfolio";

/** Maps a sectionColor key to its CSS variable string */
const COLOR_KEY_TO_CSS: Record<string, string> = {
  neon:    "var(--neon)",
  cyan:    "var(--cyan)",
  magenta: "var(--magenta)",
  amber:   "var(--amber)",
  indigo:  "var(--indigo)",
  rose:    "var(--rose)",
};

/** Default accent CSS var per built-in section */
const DEFAULT_ACCENT_CSS: Record<string, string> = {
  profile:      "var(--neon)",
  bio:          "var(--rose)",
  socials:      "var(--cyan)",
  projects:     "var(--neon)",
  blogs:        "var(--magenta)",
  experience:   "var(--indigo)",
  achievements: "var(--amber)",
};

/** Resolve the live accent CSS var for a section, honouring user overrides */
function resolveAccent(id: string, sectionColors: Record<string, string>): string {
  const key = sectionColors?.[id];
  if (key && COLOR_KEY_TO_CSS[key]) return COLOR_KEY_TO_CSS[key];
  return DEFAULT_ACCENT_CSS[id] ?? "var(--color-neon)";
}

const socialIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("github")) return Github;
  if (l.includes("twitter") || l === "x") return Twitter;
  if (l.includes("linkedin")) return Linkedin;
  if (l.includes("mail") || l.includes("email")) return Mail;
  if (l.includes("site") || l.includes("web") || l.includes("blog")) return Globe;
  return Link2;
};

function initials(name: string) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";
}

function Section({ id, portfolio }: { id: SectionId; portfolio: Portfolio }) {
  const accentCss = resolveAccent(id, portfolio.sectionColors ?? {});
  switch (id) {
    case "profile":
      return <ProfileBlock p={portfolio} accentCss={accentCss} />;
    case "bio":
      return portfolio.bio ? (
        <Block icon={CircleHelp} label="about" accentCss={accentCss}>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-2xl">
            {portfolio.bio}
          </p>
        </Block>
      ) : null;
    case "socials":
      return portfolio.socials?.length ? <SocialsBlock p={portfolio} accentCss={accentCss} /> : null;
    case "projects":
      return portfolio.projects?.length ? (
        <Block icon={FolderGit2} label="projects" accentCss={accentCss}>
          {portfolio.projects.map((pr) => (
            <Item
              key={pr.id}
              title={pr.name}
              meta={pr.tech}
              desc={pr.description}
              url={pr.url}
            />
          ))}
        </Block>
      ) : null;
    case "blogs":
      return portfolio.blogs?.length ? (
        <Block icon={BookOpen} label="writing" accentCss={accentCss}>
          {portfolio.blogs.map((b) => (
            <Item key={b.id} title={b.title} meta={b.meta} url={b.url} />
          ))}
        </Block>
      ) : null;
    case "experience":
      return portfolio.experience?.length ? (
        <Block icon={Briefcase} label="experience" accentCss={accentCss}>
          {portfolio.experience.map((e) => {
            const isCurrent = e.isCurrent ?? true;
            const period = e.startDate 
              ? `${e.startDate} — ${isCurrent ? "Present" : (e.endDate || "...")}`
              : e.period || "";
            return (
              <Item key={e.id} title={`${e.role} — ${e.company}`} meta={period} desc={e.description} />
            );
          })}
        </Block>
      ) : null;
    case "achievements":
      return portfolio.achievements?.length ? (
        <Block icon={Award} label="achievements" accentCss={accentCss}>
          {portfolio.achievements.map((a) => (
            <Item key={a.id} title={a.title} meta={a.meta} />
          ))}
        </Block>
      ) : null;
    default: {
      // Handle custom sections (id starts with "custom:")
      if (id.startsWith("custom:")) {
        const section = (portfolio.customSections ?? []).find((s) => s.id === id);
        if (!section || !section.items.length) return null;
        return (
          <Block icon={LayoutTemplate} label={section.title || "custom"} accentCss={accentCss}>
            {section.items.map((item) => (
              <Item
                key={item.id}
                title={item.title}
                meta={item.subheading}
                desc={item.description}
                url={item.link}
              />
            ))}
          </Block>
        );
      }
      return null;
    }
  }
}

export function PortfolioRenderer({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  if (!portfolio) return null;

  const visibleOrder = (portfolio.order || []).filter((id) => portfolio.enabled?.[id]);
  const profileFirst = visibleOrder[0] === "profile";
  
  const profile = profileFirst ? <Section id="profile" portfolio={portfolio} /> : null;
  const rest = visibleOrder
    .filter((id) => !(profileFirst && id === "profile"))
    .map((id) => <Section key={id} id={id} portfolio={portfolio} />);

  const inner = (
    <div className="p-6 md:p-10">
      {profile}
      {rest.length > 0 && (
        <div className={`${profileFirst ? "mt-10" : ""} grid grid-cols-1 gap-px bg-border border border-border`}>
          {rest}
        </div>
      )}
    </div>
  );

  if (!framed) return inner;

  return (
    <div className="border border-border bg-card shadow-brutal flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary shrink-0 z-10">
        <span className="h-3 w-3 bg-destructive" />
        <span className="h-3 w-3 bg-amber" />
        <span className="h-3 w-3 bg-neon" />
        <div className="ml-3 flex-1 max-w-md mx-auto border border-border bg-background px-3 py-0.5 text-xs font-mono text-muted-foreground text-center truncate">
          <span className="text-neon">https://</span>folio.dev/u/<span className="text-magenta">{portfolio.handle || "you"}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {inner}
      </div>
    </div>
  );
}

function ProfileBlock({ p, accentCss }: { p: Portfolio; accentCss?: string }) {
  const showHandle = p.showHandle ?? true;
  const accent = accentCss ?? "var(--neon)";
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {p.avatarUrl ? (
        <img
          src={p.avatarUrl}
          alt={p.fullName}
          className="h-24 w-24 object-cover shrink-0"
          style={{ border: `2px solid ${accent}`, boxShadow: `6px 6px 0 0 ${accent}` }}
        />
      ) : (
        <div
          className="h-24 w-24 bg-background flex items-center justify-center font-mono text-2xl font-bold shrink-0"
          style={{ border: `2px solid ${accent}`, color: accent, boxShadow: `6px 6px 0 0 ${accent}` }}
        >
          {initials(p.fullName)}
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-mono text-2xl font-bold break-words">
          {p.fullName || "your_name"}
          <span className="animate-blink" style={{ color: accent }}>_</span>
        </h3>
        {(showHandle || p.tagline) && (
          <p className="font-mono text-xs mt-1 break-words" style={{ color: accent }}>
            {showHandle && <span>@{p.handle || "you"}</span>}
            {showHandle && p.tagline && <span> · </span>}
            {p.tagline && <span>{p.tagline}</span>}
          </p>
        )}
      </div>
    </div>
  );
}


function SocialsBlock({ p, accentCss }: { p: Portfolio; accentCss?: string }) {
  const accent = accentCss ?? "var(--color-cyan)";
  return (
    <Block icon={Link2} label="socials" accentCss={accent}>
      <div className="flex flex-wrap gap-3">
        {p.socials?.map((s) => {
          const Icon = socialIcon(s.label);
          return (
            <a
              key={s.id}
              href={s.url || "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-2 border border-border bg-background hover:bg-secondary/50 transition-colors px-3 py-2"
              style={{ ['--hover-accent' as string]: accent }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" style={{ color: undefined }} />
              <span className="font-mono text-xs font-medium whitespace-nowrap">{s.label || "link"}</span>
            </a>
          );
        })}
      </div>
    </Block>
  );
}

function Block({
  icon: Icon,
  label,
  accentCss,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accentCss: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-border">
        {/* Wrap icon in a span so we can apply the dynamic accent colour */}
        <span style={{ color: accentCss }} className="flex items-center shrink-0">
          <Icon className="h-4 w-4" />
        </span>
        <span
          className="font-mono text-xs font-bold uppercase tracking-widest"
          style={{ color: accentCss }}
        >
          {">"}  {label}
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ title, meta, desc, url }: { title: string; meta?: string; desc?: string; url?: string }) {
  const Wrapper = url
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={url} target="_blank" rel="noreferrer noopener" className="group flex items-start justify-between gap-3 p-2 -mx-2 hover:bg-secondary/50 transition-colors">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="group flex items-start justify-between gap-3 p-2 -mx-2 hover:bg-secondary/50 transition-colors">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="min-w-0">
        <p className="font-mono text-sm font-medium break-words">{title}</p>
        {meta && <p className="text-xs font-mono text-muted-foreground mt-0.5">{meta}</p>}
        {desc && <p className="text-xs text-muted-foreground mt-1 break-words whitespace-pre-line">{desc}</p>}
      </div>
      {url && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-neon transition-colors mt-1 shrink-0" />}
    </Wrapper>
  );
}
