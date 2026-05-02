import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { ExternalLink, Eye, Save, TerminalSquare, RotateCcw, Github, Twitter, Linkedin, Globe, Link2, Mail, Trash2, Palette, ChevronDown } from "lucide-react";
import {
  defaultPortfolio,
  loadPortfolio,
  savePortfolio,
  uid,
  type Portfolio,
  type SectionId,
  type CustomSection,
  type CustomSectionItem,
  type CustomSectionTemplate,
  CUSTOM_SECTION_TEMPLATES,
  PORTFOLIO_THEMES,
  getCustomSectionTemplateMeta,
  type PortfolioThemeId,
} from "@/lib/portfolio";
import { Field, TextField } from "@/components/dashboard/Field";
import { Checkbox } from "@/components/ui/checkbox";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { colorToCss, SECTION_COLOR_GROUPS, SECTION_COLORS, SectionsManager } from "@/components/dashboard/SectionsManager";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";

const getSocialIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("github")) return Github;
  if (l.includes("twitter") || l === "x") return Twitter;
  if (l.includes("linkedin")) return Linkedin;
  if (l.includes("mail") || l.includes("email")) return Mail;
  if (l.includes("site") || l.includes("web") || l.includes("blog")) return Globe;
  return Link2;
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "dashboard — folio" },
      { name: "description", content: "Build your folio portfolio." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => defaultPortfolio());
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // hydrate from localStorage on mount
  useEffect(() => {
    const loaded = loadPortfolio();
    // Enforce profile at top and enabled
    loaded.enabled.profile = true;
    if (loaded.order[0] !== "profile") {
      loaded.order = ["profile", ...loaded.order.filter((id) => id !== "profile")];
    }
    setPortfolio(loaded);
    setHydrated(true);
  }, []);

  // autosave (debounced) once hydrated
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      savePortfolio(portfolio);
      setSavedAt(Date.now());
    }, 400);
    return () => clearTimeout(t);
  }, [portfolio, hydrated]);

  const update = <K extends keyof Portfolio>(key: K, value: Portfolio[K]) =>
    setPortfolio((p) => ({ ...p, [key]: value }));

  const toggleSection = (id: SectionId) => {
    if (id === "profile") return; // Profile is always on
    setPortfolio((p) => ({ ...p, enabled: { ...p.enabled, [id]: !p.enabled[id] } }));
  };

  const reorderSections = (next: SectionId[]) => {
    // Safety check: always keep profile at the top
    if (next[0] !== "profile") {
      next = ["profile", ...next.filter((id) => id !== "profile")];
    }
    setPortfolio((p) => ({ ...p, order: next }));
  };

  const setSectionColor = (id: string, color: string) =>
    setPortfolio((p) => ({ ...p, sectionColors: { ...p.sectionColors, [id]: color } }));

  const remapSectionColorsForTheme = (
    sectionColors: Record<string, string>,
    fromTheme: PortfolioThemeId,
    toTheme: PortfolioThemeId,
  ) => {
    const fromColors = SECTION_COLOR_GROUPS[fromTheme] ?? SECTION_COLOR_GROUPS.terminal;
    const toColors = SECTION_COLOR_GROUPS[toTheme] ?? SECTION_COLOR_GROUPS.terminal;
    return Object.fromEntries(
      Object.entries(sectionColors).map(([sectionId, colorKey]) => {
        const groupedIndex = fromColors.findIndex((color) => color.key === colorKey);
        const fallbackIndex = SECTION_COLORS.findIndex((color) => color.key === colorKey);
        const index = groupedIndex >= 0 ? groupedIndex : Math.max(0, fallbackIndex % toColors.length);
        return [sectionId, toColors[index]?.key ?? toColors[0].key];
      })
    );
  };

  const changeTheme = (theme: PortfolioThemeId) =>
    setPortfolio((p) => {
      const currentTheme = p.theme ?? "terminal";
      if (currentTheme === theme) return p;
      return {
        ...p,
        theme,
        sectionColors: remapSectionColorsForTheme(p.sectionColors ?? {}, currentTheme, theme),
      };
    });

  /** Resolve inline shadow CSS var from a section's chosen color key, with per-section defaults. */
  const sectionDefaultAccent: Record<string, string> = {
    profile:      "var(--neon)",
    bio:          "var(--rose)",
    socials:      "var(--cyan)",
    projects:     "var(--neon)",
    blogs:        "var(--magenta)",
    experience:   "var(--indigo)",
    achievements: "var(--amber)",
  };
  const sc = (id: string) => {
    const key = portfolio.sectionColors?.[id];
    return key ? colorToCss(key) : (sectionDefaultAccent[id] ?? "var(--neon)");
  };

  const reset = () => {
    if (confirm("reset portfolio to defaults? this clears local data.")) {
      const fresh = defaultPortfolio();
      setPortfolio(fresh);
      savePortfolio(fresh);
    }
  };

  const savedLabel = useMemo(() => {
    if (!savedAt) return "not saved yet";
    const d = new Date(savedAt);
    return `saved ${d.toLocaleTimeString()}`;
  }, [savedAt]);

  // helpers for list editors
  const addItem = <K extends "socials" | "projects" | "blogs" | "experience" | "achievements">(
    key: K,
    item: Portfolio[K][number]
  ) => setPortfolio((p) => ({ ...p, [key]: [...p[key], item] } as Portfolio));

  const updateItem = <K extends "socials" | "projects" | "blogs" | "experience" | "achievements">(
    key: K,
    id: string,
    patch: Partial<Portfolio[K][number]>
  ) =>
    setPortfolio((p) => ({
      ...p,
      [key]: (p[key] as Array<{ id: string }>).map((it) =>
        it.id === id ? { ...it, ...patch } : it
      ),
    } as Portfolio));

  const removeItem = <K extends "socials" | "projects" | "blogs" | "experience" | "achievements">(
    key: K,
    id: string
  ) =>
    setPortfolio((p) => ({
      ...p,
      [key]: (p[key] as Array<{ id: string }>).filter((it) => it.id !== id),
    } as Portfolio));

  // ── Custom sections helpers ─────────────────────────────────────────────────

  const addCustomSection = (title: string) => {
    const id = `custom:${uid()}`;
    const section: CustomSection = { id, title, template: "simple", items: [] };
    setPortfolio((p) => ({
      ...p,
      customSections: [...(p.customSections ?? []), section],
      order: [...p.order, id],
      enabled: { ...p.enabled, [id]: true },
    }));
  };

  const updateCustomSection = (sectionId: string, patch: Partial<CustomSection>) =>
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) =>
        s.id === sectionId ? { ...s, ...patch } : s
      ),
    }));

  const removeCustomSection = (sectionId: string) =>
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).filter((s) => s.id !== sectionId),
      order: p.order.filter((id) => id !== sectionId),
      enabled: Object.fromEntries(Object.entries(p.enabled).filter(([k]) => k !== sectionId)),
    }));

  const createCustomItem = (template: CustomSectionTemplate): CustomSectionItem => ({
    id: uid(),
    title: "",
    subheading: "",
    meta: "",
    link: "",
    description: "",
    date: template === "timeline" ? "" : undefined,
    imageUrl: template === "gallery" ? "" : undefined,
    value: template === "stats" ? "" : undefined,
  });

  const addCustomItem = (sectionId: string) => {
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) => {
        if (s.id !== sectionId) return s;
        const template = s.template ?? "simple";
        return { ...s, items: [...s.items, createCustomItem(template)] };
      }),
    }));
  };

  const updateCustomItem = (sectionId: string, itemId: string, patch: Partial<CustomSectionItem>) =>
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
          : s
      ),
    }));

  const removeCustomItem = (sectionId: string, itemId: string) =>
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
      ),
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm shrink-0">
            <span>~/folio</span>
            <span className="text-muted-foreground hidden sm:inline">/dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground">
              <span className={`h-1.5 w-1.5 ${savedAt ? "bg-neon" : "bg-amber"} ${savedAt ? "shadow-glow-neon" : ""}`} />
              {savedLabel}
            </span>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 px-2.5 h-8 border border-border hover:border-destructive hover:text-destructive transition-colors"
              title="reset portfolio"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">reset</span>
            </button>
            <Link
              to="/u/$handle"
              params={{ handle: portfolio.handle || "you" }}
              className="inline-flex items-center gap-1 px-2.5 h-8 border border-border hover:border-cyan hover:text-cyan transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">view live</span>
            </Link>
            <button
              onClick={() => {
                savePortfolio(portfolio);
                setSavedAt(Date.now());
              }}
              className="inline-flex items-center gap-1 px-3 h-8 bg-neon text-background font-bold hover:shadow-glow-neon transition-shadow"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">save</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
        {/* Editor */}
        <div className="space-y-6 pb-6">
          <div className="flex items-center mb-3 h-4">
            <p className="font-mono text-xs text-muted-foreground tracking-tight">
              <span className="text-amber">// </span> editor
            </p>
          </div>
          {/* Sections manager */}
          <Card title="sections" subtitle="toggle & drag to reorder">
            <SectionsManager
              theme={portfolio.theme ?? "terminal"}
              order={portfolio.order}
              enabled={portfolio.enabled}
              sectionColors={portfolio.sectionColors ?? {}}
              customSections={portfolio.customSections ?? []}
              onReorder={reorderSections}
              onToggle={toggleSection}
              onColorChange={setSectionColor}
              onRemoveCustom={removeCustomSection}
              onAddCustom={addCustomSection}
            />
          </Card>

          <Card title="theme" subtitle="choose portfolio presentation">
            <ThemePicker
              value={portfolio.theme ?? "terminal"}
              onChange={changeTheme}
            />
          </Card>

          {/* Profile */}
          <Card title="profile" subtitle="who are you?" shadowCss={sc("profile")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="full name"
                value={portfolio.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Alex Rivera"
              />
              <Field
                label="avatar url"
                hint="paste an image URL"
                value={portfolio.avatarUrl}
                onChange={(e) => update("avatarUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Field
              label="tagline"
              hint={
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="show-handle"
                    checked={portfolio.showHandle ?? true}
                    onCheckedChange={(checked) => update("showHandle", !!checked)}
                    className="h-3 w-3 border-border data-[state=checked]:bg-neon data-[state=checked]:text-background shrink-0"
                  />
                  <label
                    htmlFor="show-handle"
                    className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground cursor-pointer select-none leading-none"
                  >
                    show @tag
                  </label>
                </div>
              }
              value={portfolio.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="staff engineer @ vercel"
            />
          </Card>

          {/* Bio */}
          <Card title="bio" subtitle="tell visitors who you are" shadowCss={sc("bio")}>
            <TextField
              label="about"
              hint={`${(portfolio.bio || "").length}/500 · optional`}
              maxLength={500}
              value={portfolio.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder={"// what do you build?\n// what do you care about?\n// what makes you, you?"}
              rows={5}
            />
            <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">
              <span className="text-neon">→</span> shown below your name on your public page. keep it sharp.
            </p>
          </Card>

          {/* Socials */}
          <Card title="socials" subtitle="links visitors should follow" shadowCss={sc("socials")}>
            <ListEditor
              title="links"
              accent="text-cyan"
              items={portfolio.socials}
              getId={(s) => s.id}
              onAdd={() => addItem("socials", { id: uid(), label: "", url: "" })}
              onRemove={(id) => removeItem("socials", id)}
              renderItem={(s) => {
                const Icon = getSocialIcon(s.label);
                return (
                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-[180px] shrink-0">
                      <Field
                        icon={<Icon className="h-4 w-4" />}
                        label="platform"
                        value={s.label}
                        onChange={(e) => updateItem("socials", s.id, { label: e.target.value })}
                        placeholder="github"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Field
                        label="url"
                        value={s.url}
                        onChange={(e) => updateItem("socials", s.id, { url: e.target.value })}
                        placeholder="https://github.com/you"
                      />
                    </div>
                  </div>
                );
              }}
            />
          </Card>

          {/* Projects */}
          <Card title="projects" subtitle="what you've shipped" shadowCss={sc("projects")}>
            <ListEditor
              title="projects"
              accent="text-neon"
              items={portfolio.projects}
              getId={(p) => p.id}
              onAdd={() => addItem("projects", { id: uid(), name: "", description: "", url: "", tech: "" })}
              onRemove={(id) => removeItem("projects", id)}
              renderItem={(pr) => (
                <>
                  <Field
                    label="name"
                    value={pr.name}
                    onChange={(e) => updateItem("projects", pr.id, { name: e.target.value })}
                    placeholder="next-edge-cache"
                  />
                  <Field
                    label="tech"
                    value={pr.tech ?? ""}
                    onChange={(e) => updateItem("projects", pr.id, { tech: e.target.value })}
                    placeholder="typescript · react"
                  />
                  <div className="sm:col-span-2">
                    <TextField
                      label="description"
                      value={pr.description}
                      onChange={(e) => updateItem("projects", pr.id, { description: e.target.value })}
                      placeholder="what does it do, why does it matter"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="url"
                      value={pr.url ?? ""}
                      onChange={(e) => updateItem("projects", pr.id, { url: e.target.value })}
                      placeholder="https://github.com/you/repo"
                    />
                  </div>
                </>
              )}
            />
          </Card>

          {/* Blogs */}
          <Card title="blogs" subtitle="featured writing" shadowCss={sc("blogs")}>
            <ListEditor
              title="posts"
              accent="text-magenta"
              items={portfolio.blogs}
              getId={(b) => b.id}
              onAdd={() => addItem("blogs", { id: uid(), title: "", url: "", meta: "" })}
              onRemove={(id) => removeItem("blogs", id)}
              renderItem={(b) => (
                <>
                  <div className="sm:col-span-2">
                    <Field
                      label="title"
                      value={b.title}
                      onChange={(e) => updateItem("blogs", b.id, { title: e.target.value })}
                      placeholder="why edge functions changed my stack"
                    />
                  </div>
                  <Field
                    label="url"
                    value={b.url}
                    onChange={(e) => updateItem("blogs", b.id, { url: e.target.value })}
                    placeholder="https://..."
                  />
                  <Field
                    label="meta"
                    hint="optional"
                    value={b.meta ?? ""}
                    onChange={(e) => updateItem("blogs", b.id, { meta: e.target.value })}
                    placeholder="12 min · 18k reads"
                  />
                </>
              )}
            />
          </Card>

          {/* Experience */}
          <Card title="experience" subtitle="where you've worked" shadowCss={sc("experience")}>
            <ListEditor
              title="roles"
              accent="text-cyan"
              items={portfolio.experience}
              getId={(e) => e.id}
              onAdd={() => addItem("experience", { id: uid(), role: "", company: "", startDate: "", endDate: "", isCurrent: true, description: "" })}
              onRemove={(id) => removeItem("experience", id)}
              renderItem={(e) => (
                <>
                  <Field
                    label="role"
                    value={e.role}
                    onChange={(ev) => updateItem("experience", e.id, { role: ev.target.value })}
                    placeholder="staff engineer"
                  />
                  <Field
                    label="company"
                    value={e.company}
                    onChange={(ev) => updateItem("experience", e.id, { company: ev.target.value })}
                    placeholder="vercel"
                  />
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Field
                      label="start date"
                      value={e.startDate ?? ""}
                      onChange={(ev) => updateItem("experience", e.id, { startDate: ev.target.value })}
                      placeholder="Jan 2023"
                    />
                    <Field
                      label="end date"
                      hint={
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            id={`current-${e.id}`}
                            checked={e.isCurrent ?? true}
                            onCheckedChange={(checked) => 
                              updateItem("experience", e.id, { isCurrent: !!checked })
                            }
                            className="h-3 w-3 border-border data-[state=checked]:bg-neon data-[state=checked]:text-background shrink-0"
                          />
                          <label
                            htmlFor={`current-${e.id}`}
                            className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground cursor-pointer select-none leading-none"
                          >
                            still working
                          </label>
                        </div>
                      }
                      value={e.endDate ?? ""}
                      onChange={(ev) => updateItem("experience", e.id, { endDate: ev.target.value })}
                      placeholder="Present"
                      disabled={e.isCurrent ?? true}
                      className={(e.isCurrent ?? true) ? "opacity-40" : ""}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextField
                      label="description"
                      hint="optional"
                      value={e.description ?? ""}
                      onChange={(ev) => updateItem("experience", e.id, { description: ev.target.value })}
                      placeholder="led platform team"
                    />
                  </div>
                </>
              )}
            />
          </Card>

          {/* Achievements */}
          <Card title="achievements" subtitle="talks · awards · milestones" shadowCss={sc("achievements")}>
            <ListEditor
              title="achievements"
              accent="text-amber"
              items={portfolio.achievements}
              getId={(a) => a.id}
              onAdd={() => addItem("achievements", { id: uid(), title: "", meta: "" })}
              onRemove={(id) => removeItem("achievements", id)}
              renderItem={(a) => (
                <>
                  <Field
                    label="title"
                    value={a.title}
                    onChange={(e) => updateItem("achievements", a.id, { title: e.target.value })}
                    placeholder="github star, 2024"
                  />
                  <Field
                    label="meta"
                    hint="optional"
                    value={a.meta ?? ""}
                    onChange={(e) => updateItem("achievements", a.id, { meta: e.target.value })}
                    placeholder="open source recognition"
                  />
                </>
              )}
            />
          </Card>

          {/* Custom section editors — one card per custom section */}
          {(portfolio.customSections ?? []).map((section) => (
            <Card key={section.id} title={section.title || "untitled section"} subtitle="custom section" shadowCss={sc(section.id)}>
              <div className="space-y-4">
                {/* Section title */}
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_220px] gap-3">
                  <Field
                    label="section title"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                    placeholder="e.g. certifications, publications, volunteer…"
                  />
                  <TemplateSelect
                    value={section.template ?? "simple"}
                    onChange={(template) => updateCustomSection(section.id, { template })}
                  />
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-magenta">
                      {">"} {getCustomSectionTemplateMeta(section.template ?? "simple").label}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {getCustomSectionTemplateMeta(section.template ?? "simple").desc}
                    </p>
                  </div>
                  {section.items.map((item, idx) => (
                    <div key={item.id} className="border border-border/60 p-3 space-y-3 bg-background/50">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                          <span className="text-magenta">#</span> item {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCustomItem(section.id, item.id)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors"
                          title="remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <CustomItemFields
                        template={section.template ?? "simple"}
                        item={item}
                        onChange={(patch) => updateCustomItem(section.id, item.id, patch)}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addCustomItem(section.id)}
                    className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border hover:border-magenta hover:text-magenta text-muted-foreground font-mono text-xs py-2 transition-colors"
                  >
                    + add item
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="flex items-center justify-between mb-3 h-4">
            <p className="font-mono text-xs text-muted-foreground tracking-tight">
              <span className="text-amber">// </span> live preview
            </p>
            <Link
              to="/u/$handle"
              params={{ handle: portfolio.handle || "you" }}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-cyan"
            >
              <Eye className="h-3 w-3" /> open full page
            </Link>
          </div>
          <div className="h-[calc(100vh-9rem)]">
            <PortfolioRenderer portfolio={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemePicker({
  value,
  onChange,
}: {
  value: PortfolioThemeId;
  onChange: (value: PortfolioThemeId) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PORTFOLIO_THEMES.map((theme) => {
        const active = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`group text-left border px-3 py-3 bg-background transition-colors ${
              active ? "border-neon shadow-brutal" : "border-border hover:border-cyan"
            }`}
            aria-pressed={active}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                <Palette className="mr-1.5 inline h-3.5 w-3.5 text-cyan" />
                {theme.label}
              </span>
              <span className={`h-2 w-2 shrink-0 ${active ? "bg-neon" : "bg-muted"}`} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{theme.desc}</p>
            <ThemeSwatches id={theme.id} />
          </button>
        );
      })}
    </div>
  );
}

function ThemeSwatches({ id }: { id: PortfolioThemeId }) {
  const swatches: Record<PortfolioThemeId, string[]> = {
    terminal: ["var(--neon)", "var(--magenta)", "var(--cyan)"],
    vercel: ["#000000", "#fafafa", "#a1a1aa"],
    vercelDark: ["#000000", "#27272a", "#f4f4f5"],
    material: ["#6750a4", "#ffb1c8", "#8bd8bd"],
    editorial: ["#111827", "#d97706", "#f8fafc"],
    studio: ["#111111", "#f43f5e", "#38bdf8"],
  };

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {swatches[id].map((color) => (
        <span
          key={color}
          className="h-2.5 w-8 border border-border"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

function TemplateSelect({
  value,
  onChange,
}: {
  value: CustomSectionTemplate;
  onChange: (value: CustomSectionTemplate) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = getCustomSectionTemplateMeta(value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative block">
      <div className="flex items-center justify-between min-h-[18px] mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> template
        </span>
      </div>
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-background border border-border hover:border-foreground focus:border-neon outline-none px-3 py-2 font-mono text-sm text-foreground transition-colors text-left"
      >
        <span>{meta.label}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 border border-border bg-card py-1 shadow-brutal max-h-72 overflow-y-auto">
          {CUSTOM_SECTION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onChange(template.id);
                setOpen(false);
              }}
              className={`w-full flex flex-col items-start px-3 py-2 hover:bg-secondary transition-colors text-left ${
                value === template.id ? "bg-secondary/50" : ""
              }`}
            >
              <span className={`font-mono text-sm ${value === template.id ? "text-neon font-bold" : "text-foreground"}`}>
                {template.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground leading-tight">
                {template.desc}
              </span>
            </button>
          ))}
        </div>
      )}      
      {/* <p className="mt-1.5 font-mono text-[10px] text-muted-foreground/40 italic">
        * changing template resets item fields
      </p> */}
    </div>
  );
}

function CustomItemFields({
  template,
  item,
  onChange,
}: {
  template: CustomSectionTemplate;
  item: CustomSectionItem;
  onChange: (patch: Partial<CustomSectionItem>) => void;
}) {
  const metaValue = item.meta ?? item.subheading ?? "";
  const updateMeta = (meta: string) => onChange({ meta, subheading: meta });

  if (template === "linkCards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Open source starter"
        />
        <Field
          label="url"
          hint="required for click"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="why this link is useful"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="meta"
            hint="optional"
            value={metaValue}
            onChange={(e) => updateMeta(e.target.value)}
            placeholder="github · docs · case study"
          />
        </div>
      </div>
    );
  }

  if (template === "timeline") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. launched v2"
        />
        <Field
          label="date / period"
          value={item.date ?? metaValue}
          onChange={(e) => onChange({ date: e.target.value, meta: e.target.value })}
          placeholder="2024 · Jan-Mar"
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="what happened and why it mattered"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="link"
            hint="optional"
            value={item.link ?? ""}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (template === "gallery") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. brand refresh"
        />
        <Field
          label="image url"
          value={item.imageUrl ?? ""}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="caption or context"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="link"
            hint="optional"
            value={item.link ?? ""}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (template === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="label"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. users"
        />
        <Field
          label="value"
          value={item.value ?? ""}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="10k+"
        />
        <Field
          label="meta"
          hint="optional"
          value={metaValue}
          onChange={(e) => updateMeta(e.target.value)}
          placeholder="monthly active"
        />
        <Field
          label="link"
          hint="optional"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="extra context for the number"
          />
        </div>
      </div>
    );
  }

  if (template === "textBox") {
    return (
      <div className="sm:col-span-2">
        <TextField
          label="text content"
          hint="multi-line supported"
          value={item.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="// write something here..."
          rows={6}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        label="title"
        value={item.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g. AWS Solutions Architect"
      />
      <Field
        label="meta"
        hint="optional"
        value={metaValue}
        onChange={(e) => updateMeta(e.target.value)}
        placeholder="e.g. Amazon Web Services · 2024"
      />
      <div className="sm:col-span-2">
        <Field
          label="link"
          hint="optional"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          label="description"
          hint="optional"
          value={item.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="a short description of this item…"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  shadowCss,
  children,
}: {
  title: string;
  subtitle?: string;
  /** When set, overrides the brutal shadow color. Omit to keep the default neon green. */
  shadowCss?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`border border-border bg-card ${shadowCss ? "" : "shadow-brutal"}`}
      style={shadowCss ? { boxShadow: `6px 6px 0 0 ${shadowCss}` } : undefined}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-secondary">
        <p className="font-mono text-xs font-bold">
          <span className="text-neon">$</span> {title}
        </p>
        {subtitle && <p className="font-mono text-[10px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </section>
  );
}
