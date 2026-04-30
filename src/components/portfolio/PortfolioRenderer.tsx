import { Github, Twitter, Linkedin, Globe, ExternalLink, Award, Briefcase, BookOpen, FolderGit2, Link2, Mail } from "lucide-react";
import type { Portfolio, SectionId } from "@/lib/portfolio";

const socialIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("github")) return Github;
  if (l.includes("twitter") || l === "x") return Twitter;
  if (l.includes("linkedin")) return Linkedin;
  if (l.includes("mail") || l.includes("email")) return Mail;
  if (l.includes("site") || l.includes("web") || l.includes("blog")) return Globe;
  return Link2;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

export function PortfolioRenderer({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  const visibleOrder = portfolio.order.filter((id) => portfolio.enabled[id]);

  const Section = ({ id }: { id: SectionId }) => {
    switch (id) {
      case "profile":
        return <ProfileBlock p={portfolio} />;
      case "socials":
        return portfolio.socials.length ? <SocialsBlock p={portfolio} /> : null;
      case "projects":
        return portfolio.projects.length ? (
          <Block icon={FolderGit2} label="projects" accent="text-neon">
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
        return portfolio.blogs.length ? (
          <Block icon={BookOpen} label="writing" accent="text-magenta">
            {portfolio.blogs.map((b) => (
              <Item key={b.id} title={b.title} meta={b.meta} url={b.url} />
            ))}
          </Block>
        ) : null;
      case "experience":
        return portfolio.experience.length ? (
          <Block icon={Briefcase} label="experience" accent="text-cyan">
            {portfolio.experience.map((e) => (
              <Item key={e.id} title={`${e.role} — ${e.company}`} meta={e.period} desc={e.description} />
            ))}
          </Block>
        ) : null;
      case "achievements":
        return portfolio.achievements.length ? (
          <Block icon={Award} label="achievements" accent="text-amber">
            {portfolio.achievements.map((a) => (
              <Item key={a.id} title={a.title} meta={a.meta} />
            ))}
          </Block>
        ) : null;
    }
  };

  const profileFirst = visibleOrder[0] === "profile";
  const profile = profileFirst ? <Section id="profile" /> : null;
  const rest = visibleOrder
    .filter((id) => !(profileFirst && id === "profile"))
    .map((id) => <Section key={id} id={id} />);

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
    <div className="border border-border bg-card shadow-brutal">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary">
        <span className="h-3 w-3 bg-destructive" />
        <span className="h-3 w-3 bg-amber" />
        <span className="h-3 w-3 bg-neon" />
        <div className="ml-3 flex-1 max-w-md mx-auto border border-border bg-background px-3 py-0.5 text-xs font-mono text-muted-foreground text-center truncate">
          <span className="text-neon">https://</span>folio.dev/u/<span className="text-magenta">{portfolio.handle || "you"}</span>
        </div>
      </div>
      {inner}
    </div>
  );
}

function ProfileBlock({ p }: { p: Portfolio }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      {p.avatarUrl ? (
        <img
          src={p.avatarUrl}
          alt={p.fullName}
          className="h-24 w-24 object-cover border-2 border-neon shadow-brutal"
        />
      ) : (
        <div className="h-24 w-24 border-2 border-neon shadow-brutal bg-background flex items-center justify-center font-mono text-2xl font-bold text-neon">
          {initials(p.fullName)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-mono text-2xl font-bold break-words">
          {p.fullName || "your_name"}
          <span className="animate-blink text-neon">_</span>
        </h3>
        {p.tagline && (
          <p className="font-mono text-xs text-cyan mt-1 break-words">
            @{p.handle || "you"} · {p.tagline}
          </p>
        )}
        {p.bio && (
          <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed whitespace-pre-line">
            {p.bio}
          </p>
        )}
      </div>
    </div>
  );
}

function SocialsBlock({ p }: { p: Portfolio }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {p.socials.map((s) => {
        const Icon = socialIcon(s.label);
        return (
          <a
            key={s.id}
            href={s.url || "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-border hover:border-neon hover:text-neon px-3 py-1.5 font-mono text-xs transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            {s.label || "link"}
          </a>
        );
      })}
    </div>
  );
}

function Block({
  icon: Icon,
  label,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-border">
        <Icon className={`h-4 w-4 ${accent}`} />
        <span className={`font-mono text-xs font-bold uppercase tracking-widest ${accent}`}>
          {">"} {label}
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
        {meta && <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{meta}</p>}
        {desc && <p className="text-xs text-muted-foreground mt-1 break-words">{desc}</p>}
      </div>
      {url && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-neon transition-colors mt-1 shrink-0" />}
    </Wrapper>
  );
}
