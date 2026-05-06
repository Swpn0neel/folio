import React from "react";
import { ArrowUpRight } from "lucide-react";
import { getSocialIcon as socialIcon } from "@/lib/social-icons";
import { resolveAccent } from "@/lib/colors";
import { initials } from "@/utils/text";
import { FormatText } from "@/components/FormatText";
import type { CustomSection, CustomSectionItem, Portfolio, PortfolioThemeId, SectionId } from "@/lib/portfolio";
import type { ThemeView } from "@/config/themes";

export function ThemedProfile({ p, view, accentCss }: { p: Portfolio; view: ThemeView; accentCss: string }) {
  const showHandle = p.showHandle ?? true;
  return (
    <section className={view.header} style={{ ["--profile-accent" as string]: accentCss }}>
      <ThemedAvatar p={p} view={view} accentCss={accentCss} />
      <div className="min-w-0">
        {showHandle && <p className={view.eyebrow} style={{ color: accentCss }}>@{p.handle || "you"}</p>}
        <h1 className={`${view.title} wrap-break-words`}>{p.fullName}<span className="animate-pulse" style={{ color: accentCss }}>.</span></h1>
        {p.tagline && <p className={`${view.muted} leading-relaxed`} style={{ color: accentCss }}>{p.tagline}</p>}
      </div>
    </section>
  );
}

export function ThemedAvatar({ p, view, accentCss }: { p: Portfolio; view: ThemeView; accentCss: string }) {
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
      className={`${view.avatar} flex h-24 w-24 items-center justify-center text-3xl font-bold md:h-32 md:w-32`}
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

export function ThemedSection({ id, portfolio, view }: { id: SectionId; portfolio: Portfolio; view: ThemeView }) {
  const accentCss = resolveAccent(id, portfolio.sectionColors ?? {}, view.id as PortfolioThemeId);
  const custom = id.startsWith("custom:")
    ? (portfolio.customSections ?? []).find((section) => section.id === id)
    : null;
  const label = custom?.title || (
    id === "bio" ? "about" :
    id === "socials" ? "socials" :
    id === "projects" ? "projects" :
    id === "blogs" ? "writing" :
    id === "experience" ? "experience" :
    id === "achievements" ? "achievements" : id
  );
  const content = renderThemedSectionContent(id, portfolio, view, accentCss, custom ?? undefined);
  if (!content) return null;

  return (
    <section
      className={view.section}
      style={{ ["--section-accent" as string]: accentCss }}
    >
      <div className="mb-4 flex items-center gap-2">
        {view.id !== "discord" && <span className="h-2 w-2 shrink-0" style={{ background: accentCss }} />}
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
    return portfolio.bio ? <FormatText text={portfolio.bio} className={`${view.muted} text-base leading-relaxed`} /> : null;
  }
  if (id === "socials") {
    if (!portfolio.socials?.length) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {portfolio.socials.map((social) => {
          const Icon = socialIcon(social.label);
          return (
            <a
              key={social.id}
              href={social.url || "#"}
              target="_blank"
              rel="noreferrer noopener"
              className={`${view.badge} inline-flex items-center gap-2 transition-all hover:border-(--section-accent)`}
              style={{
                backgroundColor: view.id === "material" ? `color-mix(in oklch, ${accentCss}, transparent 85%)` : undefined,
                color: view.id === "material" ? `color-mix(in oklch, ${accentCss}, black 40%)` : undefined,
                // Removed inline borderColor to allow Tailwind hover classes to work or be controlled by theme config
              }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {social.label || "link"}
            </a>
          );
        })}
      </div>
    );
  }
  if (id === "projects") {
    if (!portfolio.projects?.length) return null;
    const isEditorial = view.id === "editorial";
    return (
      <div className={`grid grid-cols-1 items-stretch gap-4 ${isEditorial ? "" : "sm:grid-cols-2"} ${(isEditorial || view.id === "vercelDark") && !isEditorial ? "sm:[&>*:nth-child(2)]:border-t-0 sm:[&>*:nth-child(2)]:pt-0" : ""}`}>
        {portfolio.projects.map((project) => (
          <ThemedItem key={project.id} view={view} accentCss={accentCss} title={project.name} meta={project.tech} desc={project.description} url={project.url} />
        ))}
      </div>
    );
  }
  if (id === "blogs") {
    return portfolio.blogs?.length
      ? portfolio.blogs.map((blog) => (
          <ThemedItem key={blog.id} view={view} accentCss={accentCss} title={blog.title} meta={blog.meta} desc={blog.description} url={blog.url} />
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
          <ThemedItem key={achievement.id} view={view} accentCss={accentCss} title={achievement.title} meta={achievement.meta} desc={achievement.description} />
        ))
      : null;
  }
  if (custom?.items.length) {
    return <ThemedCustomItems section={custom} view={view} accentCss={accentCss} />;
  }
  return null;
}

export function ThemedCustomItems({
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
    const isEditorial = view.id === "editorial";
    return (
      <div className={`grid grid-cols-1 items-stretch gap-3 ${isEditorial ? "" : "sm:grid-cols-2"} ${(isEditorial || view.id === "vercelDark") && !isEditorial ? "sm:[&>*:nth-child(2)]:border-t-0 sm:[&>*:nth-child(2)]:pt-0" : ""}`}>
        {section.items.map((item) => (
          <ThemedCustomItem key={item.id} item={item} view={view} accentCss={accentCss} template={template} />
        ))}
      </div>
    );
  }

  if (template === "gallery" || template === "stats") {
    const isEditorial = view.id === "editorial";
    const useTwoCols = template === "gallery" || template === "stats" || !isEditorial;
    return (
      <div className={`grid grid-cols-1 items-stretch ${isEditorial ? "gap-x-8" : "gap-x-3"} gap-y-3 ${useTwoCols ? "sm:grid-cols-2" : ""} ${(isEditorial || view.id === "vercelDark") && useTwoCols ? "sm:[&>*:nth-child(2)]:border-t-0 sm:[&>*:nth-child(2)]:pt-0" : ""}`}>
        {section.items.map((item) => (
          <ThemedCustomItem key={item.id} item={item} view={view} accentCss={accentCss} template={template} />
        ))}
      </div>
    );
  }

  if (template === "textBox") {
    return (
      <div className="flex flex-col gap-4">
        {section.items.map((item) => (
          <FormatText key={item.id} text={item.description || ""} className={`${view.muted} text-base leading-relaxed`} />
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

export function ThemedCustomItem({
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
      <a
        href={item.link || undefined}
        target={item.link ? "_blank" : undefined}
        rel={item.link ? "noreferrer noopener" : undefined}
        className={`${view.customCard} flex h-full flex-col group`}
        style={{ borderColor: accentCss, ["--section-accent" as string]: accentCss }}
      >
        <div className="flex justify-between items-start gap-2">
          <p className={`${view.id === "editorial" ? "text-5xl font-black" : "text-4xl font-bold"} transition-colors`} style={{ color: accentCss }}>{item.value || "0"}</p>
          {item.link && <ArrowUpRight className="h-4 w-4 mt-1 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all shrink-0" />}
        </div>
        <p className={`mt-1 font-bold ${view.id === "editorial" ? "text-xs uppercase tracking-widest" : "text-base"} group-hover:text-(--section-accent) transition-colors`}>{item.title || "metric"}</p>
        {(item.meta ?? item.subheading) && <p className={`${view.muted} mt-1 text-sm ${view.id === "editorial" ? "italic" : ""}`}>{item.meta ?? item.subheading}</p>}
        {item.description && <FormatText text={item.description} className={`${view.muted} mt-2 flex-1 text-base leading-relaxed`} />}

      </a>
    );
  }

  if (template === "gallery") {
    return (
      <a
        href={item.link || undefined}
        target={item.link ? "_blank" : undefined}
        rel={item.link ? "noreferrer noopener" : undefined}
        className={`${view.customCard} flex h-full flex-col overflow-hidden group transition-colors`}
        style={{ borderColor: accentCss, ["--section-accent" as string]: accentCss }}
      >
        {item.imageUrl && <img src={item.imageUrl} alt={item.title || "gallery item"} className={`${view.galleryImage} mb-3 aspect-video w-full object-cover`} />}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <p className="wrap-break-words text-base font-semibold group-hover:text-(--section-accent) transition-colors flex-1">{item.title || "untitled"}</p>
            {item.link && <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all" />}
          </div>
          {item.description && <FormatText text={item.description} className={`${view.muted} mt-2 flex-1 wrap-break-words text-base leading-relaxed`} />}
        </div>
      </a>
    );
  }

  if (template === "timeline") {
    return (
      <div className={view.timelineItem} style={{ borderColor: accentCss }}>
        <span className="absolute -left-[6px] top-2 h-2.5 w-2.5 rounded-full border-2 bg-current" style={{ color: accentCss, borderColor: accentCss }} />
        <ThemedItem view={view} accentCss={accentCss} title={item.title || "untitled"} meta={item.date || item.meta || item.subheading} desc={item.description} url={item.link} bare />
      </div>
    );
  }

  return (
    <div className={`${view.simpleItem} group`} style={{ borderColor: accentCss, ["--section-accent" as string]: accentCss }}>
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

export function ThemedItem({
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
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="wrap-break-words text-base font-semibold group-hover:text-(--section-accent) transition-colors">{title}</p>
          {meta && <p className={`${view.muted} mt-1 text-sm`}>{meta}</p>}
        </div>
        {url && (
          <ArrowUpRight className="h-4 w-4 mt-1 opacity-40 group-hover:opacity-100 group-hover:text-(--section-accent) transition-all shrink-0" />
        )}
      </div>
      {desc && <FormatText text={desc} className={`${view.muted} mt-2 flex-1 wrap-break-words text-base leading-relaxed`} />}

    </div>
  );

  if (bare) {
    if (!url) return <div className="group" style={{ ["--section-accent" as string]: accentCss }}>{content}</div>;
    return (
      <a href={url} target="_blank" rel="noreferrer noopener" className="group" style={{ ["--section-accent" as string]: accentCss }}>
        {content}
      </a>
    );
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className={`${view.item} flex flex-col group transition-colors`}
        style={{ borderColor: accentCss, ["--section-accent" as string]: accentCss }}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={`${view.item} flex flex-col group`} style={{ borderColor: accentCss, ["--section-accent" as string]: accentCss }}>
      {content}
    </div>
  );
}
