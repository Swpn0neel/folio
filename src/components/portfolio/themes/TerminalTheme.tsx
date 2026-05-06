import { ExternalLink, Award, Briefcase, BookOpen, FolderGit2, Link2, Mail, Fingerprint, LayoutTemplate, ArrowUpRight } from "lucide-react";
import { getSocialIcon as socialIcon } from "@/lib/social-icons";
import { resolveAccent } from "@/lib/colors";
import { initials } from "@/utils/text";
import { FormatText } from "@/components/FormatText";
import type { CustomSection, CustomSectionItem, Portfolio, SectionId } from "@/lib/portfolio";

export function TerminalTheme({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  const visibleOrder = (portfolio.order || []).filter((id) => portfolio.enabled?.[id]);
  const profileFirst = visibleOrder[0] === "profile";
  
  const profile = profileFirst ? <Section id="profile" portfolio={portfolio} /> : null;
  const rest = visibleOrder
    .filter((id) => !(profileFirst && id === "profile"))
    .map((id) => <Section key={id} id={id} portfolio={portfolio} />);

  const inner = (
    <>
      {profile}
      {rest.length > 0 && (
        <div className={`${profileFirst ? "mt-10" : ""} grid grid-cols-1 gap-px bg-border border border-border`}>
          {rest}
        </div>
      )}
    </>
  );

  if (!framed) return inner;

  return (
    <div className="rounded-xl border border-border bg-card shadow-brutal flex flex-col h-full overflow-hidden">
      <div className="relative flex items-center h-10 px-4 border-b border-border bg-secondary shrink-0 z-10">
        <div className="flex items-center gap-2 shrink-0">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[180px] sm:max-w-md px-3 text-xs font-mono text-muted-foreground text-center truncate">
          fo1io.vercel.app/u/{portfolio.handle || "you"}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6 md:p-10">
          {inner}
        </div>
      </div>
    </div>
  );
}

function Section({ id, portfolio }: { id: SectionId; portfolio: Portfolio }) {
  const accentCss = resolveAccent(id, portfolio.sectionColors ?? {}, "terminal");
  switch (id) {
    case "profile":
      return <ProfileBlock p={portfolio} accentCss={accentCss} />;
    case "bio":
      return portfolio.bio ? (
        <Block icon={Fingerprint} label="about" accentCss={accentCss}>
          <FormatText text={portfolio.bio} className="text-lg text-muted-foreground leading-relaxed" />
        </Block>
      ) : null;
    case "socials":
      return portfolio.socials?.length ? <SocialsBlock p={portfolio} accentCss={accentCss} /> : null;
    case "projects":
      return portfolio.projects?.length ? (
        <Block icon={FolderGit2} label="projects" accentCss={accentCss}>
          <div className="grid grid-cols-1 items-stretch md:grid-cols-2 gap-4">
            {portfolio.projects.map((pr) => (
              <Item
                key={pr.id}
                title={pr.name}
                meta={pr.tech}
                desc={pr.description}
                url={pr.url}
                className="h-full"
                card={true}
              />
            ))}
          </div>
        </Block>
      ) : null;
    case "blogs":
      return portfolio.blogs?.length ? (
        <Block icon={BookOpen} label="writing" accentCss={accentCss}>
          <div className="flex flex-col gap-4">
            {portfolio.blogs.map((b) => (
              <Item key={b.id} title={b.title} meta={b.meta} desc={b.description} url={b.url} bare={true} />
            ))}
          </div>
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
            <Item key={a.id} title={a.title} meta={a.meta} desc={a.description} />
          ))}
        </Block>
      ) : null;
    default: {
      if (id.startsWith("custom:")) {
        const section = (portfolio.customSections ?? []).find((s) => s.id === id);
        if (!section || !section.items.length) return null;
        return (
          <Block icon={LayoutTemplate} label={section.title || "custom"} accentCss={accentCss}>
            <CustomSectionItems section={section} accentCss={accentCss} />
          </Block>
        );
      }
      return null;
    }
  }
}

// Internal Terminal Theme Components
function Block({ icon: Icon, label, children, accentCss }: { icon: any; label: string; children: React.ReactNode; accentCss: string }) {
  return (
    <div className="bg-card p-6 border-b border-border last:border-b-0" style={{ ["--section-accent" as string]: accentCss }}>
      <div className="flex items-center gap-2 mb-6">
        <Icon className="h-4 w-4" style={{ color: accentCss }} />
        <span className="font-mono text-sm opacity-70" style={{ color: accentCss }}>{">"}</span>
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest" style={{ color: accentCss }}>{label}</h2>
      </div>
      {children}
    </div>
  );
}

function ProfileBlock({ p, accentCss }: { p: Portfolio; accentCss: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-10" style={{ ["--section-accent" as string]: accentCss }}>
      {p.avatarUrl ? (
        <img src={p.avatarUrl} alt={p.fullName} className="h-32 w-32 rounded-none border-2 object-cover" style={{ borderColor: accentCss, boxShadow: `8px 8px 0 ${accentCss}` }} />
      ) : (
        <div className="h-32 w-32 flex items-center justify-center text-4xl font-bold border-2" style={{ borderColor: accentCss, color: accentCss, boxShadow: `8px 8px 0 ${accentCss}` }}>
          {initials(p.fullName)}
        </div>
      )}
      <div className="flex-1">
        {(p.showHandle ?? true) && <p className="font-mono text-sm mb-2" style={{ color: accentCss }}>@{p.handle || "you"}</p>}
        <h1 className="text-2xl md:text-4xl font-bold mb-1.5 wrap-break-words leading-none tracking-tight">
          {p.fullName}<span className="animate-pulse" style={{ color: accentCss }}>_</span>
        </h1>
        {p.tagline && <p className="text-sm md:text-base font-mono leading-relaxed max-w-2xl opacity-90" style={{ color: accentCss }}>{p.tagline}</p>}
      </div>
    </div>
  );
}

function SocialsBlock({ p, accentCss }: { p: Portfolio; accentCss: string }) {
  return (
    <Block icon={Link2} label="socials" accentCss={accentCss}>
      <div className="flex flex-wrap gap-3">
        {p.socials.map((s) => {
          const Icon = socialIcon(s.label);
          return (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 px-3 py-1.5 border border-border hover:border-(--section-accent) transition-all font-mono text-sm bg-background group">
              <Icon className="h-4 w-4 group-hover:text-(--section-accent) transition-colors" />
              <span>{s.label}</span>
            </a>
          );
        })}
      </div>
    </Block>
  );
}

function Item({ title, meta, desc, url, bare = false, card = false, className = "" }: { title: string; meta?: string; desc?: string; url?: string; bare?: boolean; card?: boolean; className?: string }) {
  const inner = (
    <div className={`group ${className.includes("h-full") ? "h-full" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-mono font-bold text-lg leading-tight wrap-break-words group-hover:text-(--section-accent) transition-colors">{title}</h3>
          {meta && <p className="font-mono text-sm text-muted-foreground mt-1">{meta}</p>}
        </div>
        {url && (
          <ArrowUpRight className="h-4 w-4 mt-1 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all shrink-0" />
        )}
      </div>
      {desc && <FormatText text={desc} className="mt-3 text-base text-muted-foreground leading-relaxed wrap-break-words" />}
    </div>
  );

  if (bare) {
    if (!url) return <div className={`py-4 border-b border-border/50 last:border-b-0 ${className}`}>{inner}</div>;
    return (
      <a href={url} target="_blank" rel="noreferrer noopener" className={`block py-4 border-b border-border/50 last:border-b-0 transition-colors group ${className}`}>
        {inner}
      </a>
    );
  }

  if (url || card) {
    const cardClass = `block p-4 border border-border transition-colors bg-background group ${className} ${url ? "hover:bg-secondary/50" : ""}`;
    if (url) {
      return (
        <a href={url} target="_blank" rel="noreferrer noopener" className={cardClass}>
          {inner}
        </a>
      );
    }
    return <div className={cardClass}>{inner}</div>;
  }

  return <div className={`py-4 border-b border-border/50 last:border-b-0 ${className}`}>{inner}</div>;
}

function CustomSectionItems({ section, accentCss }: { section: CustomSection; accentCss: string }) {
  const template = section.template ?? "simple";

  if (template === "linkCards") {
    return (
      <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 gap-3">
        {section.items.map((item) => (
          <LinkedCard key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  if (template === "timeline") {
    return (
      <div className="relative flex flex-col gap-3">
        {section.items.map((item) => (
          <TimelineItem key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  if (template === "gallery") {
    return (
      <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 gap-3">
        {section.items.map((item) => (
          <GalleryItem key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  if (template === "stats") {
    return (
      <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 gap-3">
        {section.items.map((item) => (
          <StatItem key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  if (template === "textBox") {
    return (
      <div className="flex flex-col gap-4">
        {section.items.map((item) => (
          <FormatText key={item.id} text={item.description || ""} className="text-base text-muted-foreground leading-relaxed" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {section.items.map((item) => (
        <Item
          key={item.id}
          title={item.title}
          meta={item.meta ?? item.subheading}
          desc={item.description}
          url={item.link}
          bare={true}
        />
      ))}
    </div>
  );
}

function LinkedCard({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const Wrapper = item.link
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={item.link} target="_blank" rel="noreferrer noopener" className="group flex h-full flex-col border border-border bg-background p-3 hover:bg-secondary/50 transition-colors">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="group flex h-full flex-col border border-border bg-background p-3 hover:bg-secondary/50 transition-colors">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-lg font-bold wrap-break-words group-hover:text-(--section-accent) transition-colors">{item.title || "untitled link"}</p>
            {(item.meta ?? item.subheading) && (
              <p className="text-sm font-mono text-muted-foreground mt-0.5">{item.meta ?? item.subheading}</p>
            )}
          </div>
          {item.link && (
            <ArrowUpRight className="h-4 w-4 mt-1 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all shrink-0" />
          )}
        </div>
        {item.description && <FormatText text={item.description} className="mt-2 flex-1 wrap-break-words text-base text-muted-foreground" />}
      </div>
    </Wrapper>
  );
}

function TimelineItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const Wrapper = item.link
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={item.link} target="_blank" rel="noreferrer noopener" className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 p-2 -mx-2 hover:bg-secondary/50 transition-colors group">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 p-2 -mx-2 group">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <p className="font-mono text-sm text-muted-foreground pt-0.5 wrap-break-words">
        {item.date || item.meta || item.subheading || "now"}
      </p>
      <div className="relative min-w-0 border-l border-border pl-4">
        <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 bg-card border" style={{ borderColor: accentCss }} />
        <Item title={item.title || "untitled event"} desc={item.description} url={item.link} bare={true} />
      </div>
    </Wrapper>
  );
}

function GalleryItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const inner = (
    <>
      {item.imageUrl && (
        <div className="aspect-video w-full overflow-hidden border-b border-border">
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-all duration-500" />
        </div>
      )}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono font-bold text-lg wrap-break-words flex-1 group-hover:text-(--section-accent) transition-colors">{item.title || "untitled item"}</p>
          {item.link && <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all" />}
        </div>
        {item.description && <FormatText text={item.description} className="mt-2 flex-1 wrap-break-words text-base text-muted-foreground" />}
      </div>
    </>
  );

  if (item.link) {
    return (
      <a href={item.link} target="_blank" rel="noreferrer noopener" className="group flex flex-col border border-border bg-background hover:bg-secondary/50 transition-colors h-full">
        {inner}
      </a>
    );
  }

  return (
    <div className="group flex flex-col border border-border bg-background transition-colors h-full">
      {inner}
    </div>
  );
}

function StatItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const Wrapper = item.link
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={item.link} target="_blank" rel="noreferrer noopener" className="group border border-border bg-background p-4 flex flex-col h-full hover:bg-secondary/50 transition-colors">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="border border-border bg-background p-4 flex flex-col h-full group">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="flex justify-between items-start gap-2">
        <p className="text-5xl font-black mb-1 leading-none transition-colors" style={{ color: accentCss }}>{item.value || "0"}</p>
        {item.link && (
          <ArrowUpRight className="h-4 w-4 mt-1 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all shrink-0" />
        )}
      </div>
      <p className="font-mono text-base font-bold uppercase tracking-widest group-hover:text-(--section-accent) transition-colors">{item.title || "metric"}</p>
      {(item.meta ?? item.subheading) && (
        <p className="text-sm font-mono text-muted-foreground mt-1">{item.meta ?? item.subheading}</p>
      )}
      {item.description && <FormatText text={item.description} className="mt-3 flex-1 wrap-break-words text-base text-muted-foreground" />}
    </Wrapper>
  );
}
