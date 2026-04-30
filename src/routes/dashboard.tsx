import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Eye, Save, TerminalSquare, RotateCcw } from "lucide-react";
import {
  defaultPortfolio,
  loadPortfolio,
  savePortfolio,
  uid,
  type Portfolio,
  type SectionId,
} from "@/lib/portfolio";
import { Field, TextField } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { SectionsManager } from "@/components/dashboard/SectionsManager";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";

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
        <div className="space-y-6">
          {/* Sections manager */}
          <Card title="sections" subtitle="toggle & drag to reorder">
            <SectionsManager
              order={portfolio.order}
              enabled={portfolio.enabled}
              onReorder={reorderSections}
              onToggle={toggleSection}
            />
          </Card>

          {/* Profile */}
          <Card title="profile" subtitle="who are you?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="handle"
                hint="folio.dev/u/<handle>"
                value={portfolio.handle}
                onChange={(e) =>
                  update("handle", e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase())
                }
                placeholder="yourhandle"
              />
              <Field
                label="full name"
                value={portfolio.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Alex Rivera"
              />
            </div>
            <Field
              label="avatar url"
              hint="paste an image URL"
              value={portfolio.avatarUrl}
              onChange={(e) => update("avatarUrl", e.target.value)}
              placeholder="https://..."
            />
            <Field
              label="tagline"
              value={portfolio.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="staff engineer @ vercel"
            />
            <TextField
              label="bio"
              hint={`${portfolio.bio.length}/280`}
              maxLength={280}
              value={portfolio.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="// what do you build, what do you care about?"
            />
          </Card>

          {/* Socials */}
          <Card title="socials" subtitle="links visitors should follow">
            <ListEditor
              title="links"
              accent="text-cyan"
              items={portfolio.socials}
              getId={(s) => s.id}
              onAdd={() => addItem("socials", { id: uid(), label: "", url: "" })}
              onRemove={(id) => removeItem("socials", id)}
              renderItem={(s) => (
                <>
                  <Field
                    label="label"
                    value={s.label}
                    onChange={(e) => updateItem("socials", s.id, { label: e.target.value })}
                    placeholder="github"
                  />
                  <Field
                    label="url"
                    value={s.url}
                    onChange={(e) => updateItem("socials", s.id, { url: e.target.value })}
                    placeholder="https://github.com/you"
                  />
                </>
              )}
            />
          </Card>

          {/* Projects */}
          <Card title="projects" subtitle="what you've shipped">
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
          <Card title="blogs" subtitle="featured writing">
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
          <Card title="experience" subtitle="where you've worked">
            <ListEditor
              title="roles"
              accent="text-cyan"
              items={portfolio.experience}
              getId={(e) => e.id}
              onAdd={() => addItem("experience", { id: uid(), role: "", company: "", period: "", description: "" })}
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
                  <Field
                    label="period"
                    value={e.period}
                    onChange={(ev) => updateItem("experience", e.id, { period: ev.target.value })}
                    placeholder="2023 → present"
                  />
                  <Field
                    label="description"
                    hint="optional"
                    value={e.description ?? ""}
                    onChange={(ev) => updateItem("experience", e.id, { description: ev.target.value })}
                    placeholder="led platform team"
                  />
                </>
              )}
            />
          </Card>

          {/* Achievements */}
          <Card title="achievements" subtitle="talks · awards · milestones">
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
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-xs text-muted-foreground">
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
          <div className="max-h-[calc(100vh-7rem)] overflow-auto pr-1">
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
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card shadow-brutal">
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
