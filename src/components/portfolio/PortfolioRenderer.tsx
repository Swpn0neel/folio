import { Github, Twitter, Linkedin, Globe, ExternalLink, Award, Briefcase, BookOpen, FolderGit2, Link2, Mail, Fingerprint, LayoutTemplate } from "lucide-react";
import type { CustomSection, CustomSectionItem, Portfolio, PortfolioThemeId, SectionId } from "@/lib/portfolio";

/** Maps a sectionColor key to its CSS variable string */
const COLOR_KEY_TO_CSS: Record<string, string> = {
  neon:    "var(--neon)",
  cyan:    "var(--cyan)",
  magenta: "var(--magenta)",
  amber:   "var(--amber)",
  indigo:  "var(--indigo)",
  rose:    "var(--rose)",
  graphite: "oklch(0.22 0.02 255)",
  zinc: "oklch(0.50 0.02 255)",
  vercelBlue: "oklch(0.56 0.19 255)",
  vercelGreen: "oklch(0.58 0.14 155)",
  vercelViolet: "oklch(0.58 0.17 292)",
  vercelRed: "oklch(0.58 0.18 25)",
  darkSilver: "oklch(0.84 0.03 255)",
  darkBlue: "oklch(0.72 0.16 245)",
  darkMint: "oklch(0.78 0.14 165)",
  darkViolet: "oklch(0.74 0.18 300)",
  darkAmber: "oklch(0.82 0.15 85)",
  darkRose: "oklch(0.72 0.19 20)",
  lavender: "oklch(0.62 0.17 305)",
  blossom: "oklch(0.74 0.16 350)",
  seafoam: "oklch(0.78 0.13 170)",
  daySky: "oklch(0.73 0.12 235)",
  sunset: "oklch(0.76 0.16 45)",
  marigold: "oklch(0.82 0.15 90)",
  charcoal: "oklch(0.24 0.03 255)",
  ochre: "oklch(0.58 0.13 75)",
  brick: "oklch(0.50 0.15 32)",
  forest: "oklch(0.42 0.10 155)",
  navy: "oklch(0.36 0.10 255)",
  plum: "oklch(0.42 0.12 320)",
  hotPink: "oklch(0.69 0.25 358)",
  electricBlue: "oklch(0.72 0.18 235)",
  acid: "oklch(0.86 0.22 125)",
  tangerine: "oklch(0.74 0.20 50)",
  ultraviolet: "oklch(0.66 0.24 300)",
  laserAqua: "oklch(0.82 0.15 190)",
  emerald: "oklch(0.72 0.20 155)",
  lime: "oklch(0.84 0.20 125)",
  sky: "oklch(0.72 0.17 235)",
  blue: "oklch(0.62 0.22 255)",
  purple: "oklch(0.64 0.23 305)",
  pink: "oklch(0.72 0.24 350)",
  coral: "oklch(0.72 0.20 35)",
  orange: "oklch(0.76 0.19 55)",
  gold: "oklch(0.82 0.16 95)",
  mint: "oklch(0.82 0.14 170)",
  teal: "oklch(0.70 0.15 190)",
  slate: "oklch(0.55 0.05 255)",
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
        <Block icon={Fingerprint} label="about" accentCss={accentCss}>
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
            <CustomSectionItems section={section} accentCss={accentCss} />
          </Block>
        );
      }
      return null;
    }
  }
}

export function PortfolioRenderer({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  if (!portfolio) return null;

  const theme = portfolio.theme ?? "terminal";
  if (theme !== "terminal") {
    return <ThemedPortfolioRenderer portfolio={portfolio} framed={framed} theme={theme} />;
  }

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
    <div className="relative flex items-center h-10 px-4 border-b border-border bg-secondary shrink-0 z-10">
      <div className="flex items-center gap-2 shrink-0">
        <span className="h-3 w-3 bg-destructive" />
        <span className="h-3 w-3 bg-amber" />
        <span className="h-3 w-3 bg-neon" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[180px] sm:max-w-md border border-border bg-background px-3 py-0.5 text-xs font-mono text-muted-foreground text-center truncate">
        <span className="text-neon">https://</span>folio.dev/u/<span className="text-magenta">{portfolio.handle || "you"}</span>
      </div>
    </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {inner}
      </div>
    </div>
  );
}

function CustomSectionItems({
  section,
  accentCss,
}: {
  section: CustomSection;
  accentCss: string;
}) {
  const template = section.template ?? "simple";

  if (template === "linkCards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.items.map((item) => (
          <GalleryItem key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  if (template === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.items.map((item) => (
          <StatItem key={item.id} item={item} accentCss={accentCss} />
        ))}
      </div>
    );
  }

  return (
    <>
      {section.items.map((item) => (
        <Item
          key={item.id}
          title={item.title}
          meta={item.meta ?? item.subheading}
          desc={item.description}
          url={item.link}
        />
      ))}
    </>
  );
}

type ThemeView = {
  id: Exclude<PortfolioThemeId, "terminal">;
  shell: string;
  frame: string;
  frameBar: string;
  page: string;
  header: string;
  avatar: string;
  title: string;
  eyebrow: string;
  muted: string;
  sectionGrid: string;
  section: string;
  sectionTitle: string;
  item: string;
  simpleItem: string;
  timelineItem: string;
  link: string;
  badge: string;
  customCard: string;
  galleryImage: string;
  accent: string;
};

const THEME_VIEW: Record<Exclude<PortfolioThemeId, "terminal">, ThemeView> = {
  vercel: {
    id: "vercel",
    shell: "bg-white text-zinc-950",
    frame: "border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]",
    frameBar: "border-b border-zinc-200 bg-zinc-50 text-zinc-500",
    page: "bg-white px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-5 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-full border border-zinc-200 shadow-sm",
    title: "font-sans text-3xl md:text-5xl font-semibold tracking-normal text-zinc-950",
    eyebrow: "text-xs font-medium uppercase tracking-widest text-zinc-500",
    muted: "text-zinc-600",
    sectionGrid: "mt-8 grid grid-cols-1 gap-6",
    section: "border-b border-zinc-200 pb-6 last:border-b-0",
    sectionTitle: "font-sans text-sm font-semibold uppercase tracking-widest text-zinc-950",
    item: "rounded-md border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-zinc-950 hover:text-black",
    badge: "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700",
    customCard: "rounded-md border border-zinc-200 bg-zinc-50 p-4",
    galleryImage: "rounded-md",
    accent: "#050505",
  },
  vercelDark: {
    id: "vercelDark",
    shell: "bg-[#050505] text-zinc-50",
    frame: "border border-zinc-800 bg-[#050505] shadow-[0_24px_70px_rgba(0,0,0,0.45)]",
    frameBar: "border-b border-zinc-800 bg-[#0a0a0a] text-zinc-500",
    page: "bg-[#050505] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-5 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-full border border-zinc-800 shadow-sm",
    title: "font-sans text-3xl md:text-5xl font-semibold tracking-normal text-zinc-50",
    eyebrow: "text-xs font-medium uppercase tracking-widest text-zinc-500",
    muted: "text-zinc-400",
    sectionGrid: "mt-8 grid grid-cols-1 gap-6",
    section: "border-b border-zinc-800 pb-6 last:border-b-0",
    sectionTitle: "font-sans text-sm font-semibold uppercase tracking-widest text-zinc-50",
    item: "rounded-md border border-zinc-800 bg-[#090909] p-4 transition-colors hover:bg-zinc-900",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-zinc-50 hover:text-white",
    badge: "rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-300",
    customCard: "rounded-md border border-zinc-800 bg-[#090909] p-4",
    galleryImage: "rounded-md",
    accent: "#fafafa",
  },
  material: {
    id: "material",
    shell: "bg-[#fbf7ff] text-[#1f1b24]",
    frame: "rounded-[28px] border border-[#e7dff5] bg-[#fbf7ff] shadow-[0_24px_70px_rgba(103,80,164,0.18)] overflow-hidden",
    frameBar: "border-b border-[#e7dff5] bg-[#f1e8ff] text-[#625b71]",
    page: "bg-[linear-gradient(135deg,#fbf7ff_0%,#fff7ed_48%,#effdf7_100%)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-5 sm:flex-row sm:items-center",
    avatar: "rounded-[24px] shadow-[0_10px_28px_rgba(103,80,164,0.22)]",
    title: "font-sans text-3xl md:text-5xl font-bold tracking-normal text-[#1f1b24]",
    eyebrow: "text-xs font-bold uppercase tracking-widest text-[#6750a4]",
    muted: "text-[#625b71]",
    sectionGrid: "mt-7 grid grid-cols-1 gap-4",
    section: "rounded-[24px] bg-white/76 p-5 shadow-[0_10px_30px_rgba(103,80,164,0.10)]",
    sectionTitle: "font-sans text-sm font-bold uppercase tracking-widest text-[#6750a4]",
    item: "rounded-[18px] border border-[#e7dff5] bg-[#fffbff] p-4 transition-transform hover:-translate-y-0.5",
    simpleItem: "rounded-[18px] bg-white/55 px-4 py-3",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-[#6750a4] hover:text-[#4f378b]",
    badge: "rounded-full bg-[#eaddff] px-3 py-1 text-xs font-semibold text-[#21005d]",
    customCard: "rounded-[18px] bg-[#fef7ff] p-4",
    galleryImage: "rounded-[16px]",
    accent: "#6750a4",
  },
  editorial: {
    id: "editorial",
    shell: "bg-[#f8fafc] text-slate-950",
    frame: "border border-slate-300 bg-[#f8fafc] shadow-[0_28px_80px_rgba(15,23,42,0.12)]",
    frameBar: "border-b border-slate-300 bg-[#f1f5f9] text-slate-500",
    page: "bg-[#f8fafc] px-6 py-8 md:px-12 md:py-12",
    header: "flex flex-col gap-5 border-b-2 border-slate-950 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-sm border border-slate-300 grayscale",
    title: "font-sans text-4xl md:text-6xl font-semibold tracking-normal leading-tight text-slate-950",
    eyebrow: "text-xs font-bold uppercase tracking-widest text-amber-700",
    muted: "text-slate-600",
    sectionGrid: "mt-9 grid grid-cols-1 gap-8",
    section: "grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]",
    sectionTitle: "font-sans text-xs font-bold uppercase tracking-widest text-slate-950",
    item: "border-t border-slate-300 py-4 first:border-t-0 first:pt-0",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-slate-950 underline decoration-amber-600/60 underline-offset-4 hover:decoration-amber-600",
    badge: "border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700",
    customCard: "border-t border-slate-300 py-4",
    galleryImage: "rounded-sm",
    accent: "#b45309",
  },
  studio: {
    id: "studio",
    shell: "bg-[#111111] text-white",
    frame: "border border-white/10 bg-[#111111] shadow-[0_28px_90px_rgba(244,63,94,0.18)]",
    frameBar: "border-b border-white/10 bg-[#18181b] text-zinc-400",
    page: "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.28),transparent_34%),linear-gradient(135deg,#111111,#171717_55%,#0f172a)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-5 sm:flex-row sm:items-center",
    avatar: "rounded-2xl border border-white/15 shadow-[10px_10px_0_#f43f5e]",
    title: "font-sans text-4xl md:text-6xl font-black tracking-normal leading-none text-white",
    eyebrow: "text-xs font-bold uppercase tracking-widest text-sky-300",
    muted: "text-zinc-300",
    sectionGrid: "mt-7 grid grid-cols-1 gap-4 md:grid-cols-2",
    section: "border border-white/10 bg-white/[0.06] p-5 backdrop-blur",
    sectionTitle: "font-sans text-sm font-black uppercase tracking-widest text-white",
    item: "border border-white/10 bg-black/20 p-4 transition-colors hover:border-rose-400/70",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-sky-300 hover:text-rose-300",
    badge: "border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-100",
    customCard: "border border-white/10 bg-black/20 p-4",
    galleryImage: "rounded-xl",
    accent: "#f43f5e",
  },
};

function ThemedPortfolioRenderer({
  portfolio,
  framed,
  theme,
}: {
  portfolio: Portfolio;
  framed: boolean;
  theme: Exclude<PortfolioThemeId, "terminal">;
}) {
  const view = THEME_VIEW[theme];
  const visibleOrder = (portfolio.order || []).filter((id) => portfolio.enabled?.[id]);
  const sections = visibleOrder.filter((id) => id !== "profile");
  const profileAccent = resolveAccent("profile", portfolio.sectionColors ?? {});
  const showProfile = visibleOrder.includes("profile");
  const page = framed ? (
    <div className={`${view.shell} min-h-full`}>
      <div className={view.page}>
        {showProfile && <ThemedProfile p={portfolio} view={view} accentCss={profileAccent} />}
        <div className={view.sectionGrid}>
          {sections.map((id) => (
            <ThemedSection key={id} id={id} portfolio={portfolio} view={view} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>
      {showProfile && <ThemedProfile p={portfolio} view={view} accentCss={profileAccent} />}
      <div className={view.sectionGrid}>
        {sections.map((id) => (
          <ThemedSection key={id} id={id} portfolio={portfolio} view={view} />
        ))}
      </div>
    </>
  );

  if (!framed) return page;

  return (
    <div className={`${view.frame} flex h-full flex-col overflow-hidden`}>
      <div className={`${view.frameBar} relative flex h-10 shrink-0 items-center px-4`}>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-full max-w-[180px] -translate-x-1/2 -translate-y-1/2 truncate px-3 text-center text-xs">
          folio.dev/u/{portfolio.handle || "you"}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">{page}</div>
    </div>
  );
}

function ThemedProfile({ p, view, accentCss }: { p: Portfolio; view: ThemeView; accentCss: string }) {
  const showHandle = p.showHandle ?? true;
  return (
    <section className={view.header} style={{ ["--profile-accent" as string]: accentCss }}>
      <ThemedAvatar p={p} view={view} accentCss={accentCss} />
      <div className="min-w-0">
        {showHandle && <p className={view.eyebrow} style={{ color: accentCss }}>@{p.handle || "you"}</p>}
        <h1 className={`${view.title} mt-3 break-words`}>{p.fullName || "Your Name"}<span style={{ color: accentCss }}>.</span></h1>
        {p.tagline && <p className={`${view.muted} mt-4 max-w-2xl text-base leading-relaxed`}>{p.tagline}</p>}
      </div>
    </section>
  );
}

function ThemedAvatar({ p, view, accentCss }: { p: Portfolio; view: ThemeView; accentCss: string }) {
  if (p.avatarUrl) {
    return (
      <img
        src={p.avatarUrl}
        alt={p.fullName}
        className={`${view.avatar} h-24 w-24 object-cover md:h-32 md:w-32`}
        style={{ borderColor: accentCss, boxShadow: view.id === "studio" ? `10px 10px 0 ${accentCss}` : undefined }}
      />
    );
  }

  return (
    <div
      className={`${view.avatar} flex h-24 w-24 items-center justify-center text-2xl font-bold md:h-32 md:w-32`}
      style={{
        color: accentCss,
        borderColor: accentCss,
        background: "color-mix(in oklch, currentColor 7%, transparent)",
        boxShadow: view.id === "studio" ? `10px 10px 0 ${accentCss}` : undefined,
      }}
    >
      {initials(p.fullName)}
    </div>
  );
}

function ThemedSection({ id, portfolio, view }: { id: SectionId; portfolio: Portfolio; view: ThemeView }) {
  const accentCss = resolveAccent(id, portfolio.sectionColors ?? {});
  const custom = id.startsWith("custom:")
    ? (portfolio.customSections ?? []).find((section) => section.id === id)
    : null;
  const studioWideCustom = view.id === "studio" && custom && ["linkCards", "gallery", "stats"].includes(custom.template ?? "simple");
  const label = custom?.title || (
    id === "bio" ? "about" :
    id === "socials" ? "links" :
    id === "projects" ? "projects" :
    id === "blogs" ? "writing" :
    id === "experience" ? "experience" :
    id === "achievements" ? "achievements" : id
  );
  const content = renderThemedSectionContent(id, portfolio, view, accentCss, custom ?? undefined);
  if (!content) return null;

  return (
    <section
      className={`${view.section} ${studioWideCustom ? "md:col-span-2" : ""}`}
      style={{ ["--section-accent" as string]: accentCss }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 shrink-0" style={{ background: accentCss }} />
        <h2 className={view.sectionTitle} style={{ color: accentCss }}>{label}</h2>
      </div>
      <div className="flex flex-col gap-3">{content}</div>
    </section>
  );
}

function renderThemedSectionContent(
  id: SectionId,
  portfolio: Portfolio,
  view: ThemeView,
  accentCss: string,
  custom?: CustomSection,
) {
  if (id === "bio") {
    return portfolio.bio ? <p className={`${view.muted} text-sm leading-relaxed whitespace-pre-line`}>{portfolio.bio}</p> : null;
  }
  if (id === "socials") {
    if (!portfolio.socials?.length) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {portfolio.socials.map((social) => {
          const Icon = socialIcon(social.label);
          return (
            <a key={social.id} href={social.url || "#"} target="_blank" rel="noreferrer noopener" className={`${view.badge} inline-flex items-center gap-2`} style={{ borderColor: accentCss }}>
              <Icon className="h-3.5 w-3.5" />
              {social.label || "link"}
            </a>
          );
        })}
      </div>
    );
  }
  if (id === "projects") {
    return portfolio.projects?.length
      ? portfolio.projects.map((project) => (
          <ThemedItem key={project.id} view={view} accentCss={accentCss} title={project.name} meta={project.tech} desc={project.description} url={project.url} />
        ))
      : null;
  }
  if (id === "blogs") {
    return portfolio.blogs?.length
      ? portfolio.blogs.map((blog) => (
          <ThemedItem key={blog.id} view={view} accentCss={accentCss} title={blog.title} meta={blog.meta} url={blog.url} />
        ))
      : null;
  }
  if (id === "experience") {
    return portfolio.experience?.length
      ? portfolio.experience.map((experience) => {
          const isCurrent = experience.isCurrent ?? true;
          const period = experience.startDate
            ? `${experience.startDate} - ${isCurrent ? "Present" : (experience.endDate || "...")}`
            : experience.period || "";
          return (
            <ThemedItem
              key={experience.id}
              view={view}
              accentCss={accentCss}
              title={`${experience.role} at ${experience.company}`}
              meta={period}
              desc={experience.description}
            />
          );
        })
      : null;
  }
  if (id === "achievements") {
    return portfolio.achievements?.length
      ? portfolio.achievements.map((achievement) => (
          <ThemedItem key={achievement.id} view={view} accentCss={accentCss} title={achievement.title} meta={achievement.meta} />
        ))
      : null;
  }
  if (custom?.items.length) {
    return <ThemedCustomItems section={custom} view={view} accentCss={accentCss} />;
  }
  return null;
}

function ThemedCustomItems({
  section,
  view,
  accentCss,
}: {
  section: CustomSection;
  view: ThemeView;
  accentCss: string;
}) {
  const template = section.template ?? "simple";

  if (template === "linkCards") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {section.items.map((item) => (
          <ThemedCustomItem key={item.id} item={item} view={view} accentCss={accentCss} template={template} />
        ))}
      </div>
    );
  }

  if (template === "gallery" || template === "stats") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {section.items.map((item) => (
          <ThemedCustomItem key={item.id} item={item} view={view} accentCss={accentCss} template={template} />
        ))}
      </div>
    );
  }

  return (
    <>
      {section.items.map((item) => (
        <ThemedCustomItem key={item.id} item={item} view={view} accentCss={accentCss} template={template} />
      ))}
    </>
  );
}

function ThemedCustomItem({
  item,
  view,
  accentCss,
  template,
}: {
  item: CustomSectionItem;
  view: ThemeView;
  accentCss: string;
  template: CustomSection["template"];
}) {
  if (template === "stats") {
    return (
      <a href={item.link || undefined} target={item.link ? "_blank" : undefined} rel={item.link ? "noreferrer noopener" : undefined} className={view.customCard} style={{ borderColor: accentCss }}>
        <p className="text-3xl font-bold" style={{ color: accentCss }}>{item.value || "0"}</p>
        <p className="mt-1 font-semibold">{item.title || "metric"}</p>
        {(item.meta ?? item.subheading) && <p className={`${view.muted} mt-1 text-xs`}>{item.meta ?? item.subheading}</p>}
        {item.description && <p className={`${view.muted} mt-2 text-sm leading-relaxed whitespace-pre-line`}>{item.description}</p>}
        {item.link && <p className="mt-3 truncate text-xs" style={{ color: accentCss }}>{item.link}</p>}
      </a>
    );
  }

  if (template === "gallery") {
    return (
      <a href={item.link || undefined} target={item.link ? "_blank" : undefined} rel={item.link ? "noreferrer noopener" : undefined} className={`${view.customCard} block overflow-hidden`} style={{ borderColor: accentCss }}>
        {item.imageUrl && <img src={item.imageUrl} alt={item.title || "gallery item"} className={`${view.galleryImage} mb-3 aspect-video w-full object-cover`} />}
        <p className="break-words text-sm font-semibold">{item.title || "untitled"}</p>
        {item.description && <p className={`${view.muted} mt-2 break-words text-sm leading-relaxed whitespace-pre-line`}>{item.description}</p>}
        {item.link && <p className="mt-3 truncate text-xs" style={{ color: accentCss }}>{item.link}</p>}
      </a>
    );
  }

  if (template === "timeline") {
    return (
      <div className={view.timelineItem} style={{ borderColor: accentCss }}>
        <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 bg-current" style={{ color: accentCss, borderColor: accentCss }} />
        <ThemedItem view={view} accentCss={accentCss} title={item.title || "untitled"} meta={item.date || item.meta || item.subheading} desc={item.description} url={item.link} bare />
      </div>
    );
  }

  return (
    <div className={view.simpleItem} style={{ borderColor: accentCss }}>
      <ThemedItem
        view={view}
        accentCss={accentCss}
        title={item.title || "untitled"}
        meta={item.meta || item.subheading}
        desc={item.description}
        url={item.link}
        bare
      />
    </div>
  );
}

function ThemedItem({
  view,
  accentCss,
  title,
  meta,
  desc,
  url,
  bare = false,
}: {
  view: ThemeView;
  accentCss: string;
  title: string;
  meta?: string;
  desc?: string;
  url?: string;
  bare?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold">{title}</p>
          {meta && <p className={`${view.muted} mt-1 text-xs`}>{meta}</p>}
        </div>
        {url && <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 opacity-70" style={{ color: accentCss }} />}
      </div>
      {desc && <p className={`${view.muted} mt-2 break-words text-sm leading-relaxed whitespace-pre-line`}>{desc}</p>}
      {url && <p className="mt-3 truncate text-xs" style={{ color: accentCss }}>{url}</p>}
    </>
  );

  if (bare) {
    if (!url) return <div>{content}</div>;
    return (
      <a href={url} target="_blank" rel="noreferrer noopener" className={view.link}>
        {content}
      </a>
    );
  }

  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer noopener" className={`${view.item} ${view.link}`} style={{ borderColor: accentCss }}>
        {content}
      </a>
    );
  }

  return <div className={view.item} style={{ borderColor: accentCss }}>{content}</div>;
}

function LinkedCard({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const Wrapper = item.link
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={item.link} target="_blank" rel="noreferrer noopener" className="group block border border-border bg-background p-3 hover:bg-secondary/50 transition-colors">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="group border border-border bg-background p-3 hover:bg-secondary/50 transition-colors">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold break-words">{item.title || "untitled link"}</p>
          {(item.meta ?? item.subheading) && (
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.meta ?? item.subheading}</p>
          )}
        </div>
        {item.link && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-neon transition-colors mt-1 shrink-0" />}
      </div>
      {item.description && <p className="text-xs text-muted-foreground mt-2 break-words whitespace-pre-line">{item.description}</p>}
      {item.link && <p className="font-mono text-[10px] mt-3 truncate" style={{ color: accentCss }}>{item.link}</p>}
    </Wrapper>
  );
}

function TimelineItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 p-2 -mx-2 hover:bg-secondary/50 transition-colors">
      <p className="font-mono text-[11px] text-muted-foreground pt-0.5 break-words">
        {item.date || item.meta || item.subheading || "now"}
      </p>
      <div className="relative min-w-0 border-l border-border pl-4">
        <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 bg-card border" style={{ borderColor: accentCss }} />
        <Item title={item.title} desc={item.description} url={item.link} />
      </div>
    </div>
  );
}

function GalleryItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const content = (
    <div className="group border border-border bg-background hover:bg-secondary/50 transition-colors overflow-hidden">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title || "gallery item"} className="w-full aspect-video object-cover border-b border-border" />
      ) : (
        <div className="aspect-video border-b border-border bg-secondary flex items-center justify-center font-mono text-xs text-muted-foreground">
          image
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-sm font-bold break-words">{item.title || "untitled"}</p>
          {item.link && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-neon transition-colors mt-1 shrink-0" />}
        </div>
        {item.description && <p className="text-xs text-muted-foreground mt-1 break-words whitespace-pre-line">{item.description}</p>}
      </div>
    </div>
  );

  if (!item.link) return content;

  return (
    <a href={item.link} target="_blank" rel="noreferrer noopener" style={{ ['--gallery-accent' as string]: accentCss }}>
      {content}
    </a>
  );
}

function StatItem({ item, accentCss }: { item: CustomSectionItem; accentCss: string }) {
  const content = (
    <div className="group border border-border bg-background p-4 hover:bg-secondary/50 transition-colors">
      <p className="font-mono text-2xl font-bold break-words" style={{ color: accentCss }}>
        {item.value || "0"}
      </p>
      <p className="font-mono text-sm font-medium mt-1 break-words">{item.title || "metric"}</p>
      {(item.meta ?? item.subheading) && (
        <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.meta ?? item.subheading}</p>
      )}
      {item.description && <p className="text-xs text-muted-foreground mt-2 break-words whitespace-pre-line">{item.description}</p>}
    </div>
  );

  if (!item.link) return content;

  return (
    <a href={item.link} target="_blank" rel="noreferrer noopener">
      {content}
    </a>
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
          className="h-28 w-28 object-cover shrink-0 md:h-32 md:w-32"
          style={{ border: `2px solid ${accent}`, boxShadow: `6px 6px 0 0 ${accent}` }}
        />
      ) : (
        <div
          className="h-28 w-28 bg-background flex items-center justify-center font-mono text-3xl font-bold shrink-0 md:h-32 md:w-32"
          style={{ border: `2px solid ${accent}`, color: accent, boxShadow: `6px 6px 0 0 ${accent}` }}
        >
          {initials(p.fullName)}
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-mono text-3xl font-bold break-words md:text-4xl">
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
