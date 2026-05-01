import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Eye, Save, TerminalSquare, RotateCcw, Github, Twitter, Linkedin, Globe, Link2, Mail, Trash2 } from "lucide-react";
import {
  defaultPortfolio,
  loadPortfolio,
  savePortfolio,
  uid,
  type Portfolio,
  type SectionId,
  type CustomSection,
  type CustomSectionItem,
} from "@/lib/portfolio";
import { Field, TextField } from "@/components/dashboard/Field";
import { Checkbox } from "@/components/ui/checkbox";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { SectionsManager } from "@/components/dashboard/SectionsManager";
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
    setPortfolio(loadPortfolio());
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

  const toggleSection = (id: SectionId) =>
    setPortfolio((p) => ({ ...p, enabled: { ...p.enabled, [id]: !p.enabled[id] } }));

  const reorderSections = (next: SectionId[]) =>
    setPortfolio((p) => ({ ...p, order: next }));

  const setSectionColor = (id: string, color: string) =>
    setPortfolio((p) => ({ ...p, sectionColors: { ...p.sectionColors, [id]: color } }));

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
  const colorKeyToCss: Record<string, string> = {
    neon: "var(--neon)", cyan: "var(--cyan)", magenta: "var(--magenta)",
    amber: "var(--amber)", indigo: "var(--indigo)", rose: "var(--rose)",
  };
  const sc = (id: string) => {
    const key = portfolio.sectionColors?.[id];
    return (key && colorKeyToCss[key]) ? colorKeyToCss[key] : (sectionDefaultAccent[id] ?? "var(--neon)");
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
    const section: CustomSection = { id, title, items: [] };
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

  const addCustomItem = (sectionId: string) => {
    const item: CustomSectionItem = { id: uid(), title: "", subheading: "", link: "", description: "" };
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s
      ),
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
            <TerminalSquare className="h-5 w-5 text-neon" />
            <span className="hidden sm:inline">~/folio</span>
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
                <Field
                  label="section title"
                  value={section.title}
                  onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                  placeholder="e.g. certifications, publications, volunteer…"
                />

                {/* Items */}
                <div className="space-y-3">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field
                          label="title"
                          value={item.title}
                          onChange={(e) => updateCustomItem(section.id, item.id, { title: e.target.value })}
                          placeholder="e.g. AWS Solutions Architect"
                        />
                        <Field
                          label="sub-heading"
                          hint="optional"
                          value={item.subheading ?? ""}
                          onChange={(e) => updateCustomItem(section.id, item.id, { subheading: e.target.value })}
                          placeholder="e.g. Amazon Web Services · 2024"
                        />
                        <div className="sm:col-span-2">
                          <Field
                            label="link"
                            hint="optional"
                            value={item.link ?? ""}
                            onChange={(e) => updateCustomItem(section.id, item.id, { link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <TextField
                            label="description"
                            hint="optional"
                            value={item.description ?? ""}
                            onChange={(e) => updateCustomItem(section.id, item.id, { description: e.target.value })}
                            placeholder="a short description of this item…"
                          />
                        </div>
                      </div>
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
