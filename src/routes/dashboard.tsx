import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Eye, Save, RotateCcw, LogOut, Share2, Settings } from "lucide-react";
import {
  type Portfolio,
  type SectionId,
} from "@/lib/portfolio";
import { SectionsManager } from "@/components/dashboard/SectionsManager";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/dashboard/Card";
import { ThemePicker } from "@/components/dashboard/ThemePicker";
import { LogoutDialog } from "@/components/dashboard/dialogs/LogoutDialog";
import { DeleteAccountDialog } from "@/components/dashboard/dialogs/DeleteAccountDialog";
import { ShareDialog } from "@/components/dashboard/dialogs/ShareDialog";

// Hooks
import { useDashboard } from "@/hooks/useDashboard";

// Editors
import { ProfileEditor } from "@/components/dashboard/editors/ProfileEditor";
import { BioEditor } from "@/components/dashboard/editors/BioEditor";
import { SocialsEditor } from "@/components/dashboard/editors/SocialsEditor";
import { ProjectsEditor } from "@/components/dashboard/editors/ProjectsEditor";
import { BlogsEditor } from "@/components/dashboard/editors/BlogsEditor";
import { ExperienceEditor } from "@/components/dashboard/editors/ExperienceEditor";
import { AchievementsEditor } from "@/components/dashboard/editors/AchievementsEditor";
import { CustomSectionEditor } from "@/components/dashboard/editors/CustomSectionEditor";


function Dashboard() {
  const {
    portfolio,
    hydrated,
    isSaving,
    isAuthLoading,
    session,
    showLogoutDialog,
    setShowLogoutDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showShareDialog,
    setShowShareDialog,
    isSystemOpen,
    setIsSystemOpen,
    savedAt,
    savedLabel,
    profileUrl,
    sc,
    update,
    toggleSection,
    reorderSections,
    setSectionColor,
    changeTheme,
    reset,
    forceSave,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    addCustomSection,
    updateCustomSection,
    addCustomItem,
    updateCustomItem,
    removeCustomItem,
    reorderCustomItems,
    removeCustomSection,
    logout,
    deletePortfolioAccount,
  } = useDashboard();

  const renderSectionEditor = (id: SectionId) => {
    if (!portfolio.enabled[id]) return null;

    const shadowCss = sc(id);

    switch (id) {
      case "profile":
        return <ProfileEditor portfolio={portfolio} update={update} shadowCss={shadowCss} />;
      case "bio":
        return <BioEditor portfolio={portfolio} update={update} shadowCss={shadowCss} />;
      case "socials":
        return (
          <SocialsEditor
            socials={portfolio.socials}
            onAdd={(item) => addItem("socials", item)}
            onRemove={(id) => removeItem("socials", id)}
            onUpdate={(id, patch) => updateItem("socials", id, patch)}
            onReorder={(next) => reorderItems("socials", next)}
            shadowCss={shadowCss}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            projects={portfolio.projects}
            onAdd={(item) => addItem("projects", item)}
            onRemove={(id) => removeItem("projects", id)}
            onUpdate={(id, patch) => updateItem("projects", id, patch)}
            onReorder={(next) => reorderItems("projects", next)}
            shadowCss={shadowCss}
          />
        );
      case "blogs":
        return (
          <BlogsEditor
            blogs={portfolio.blogs}
            onAdd={(item) => addItem("blogs", item)}
            onRemove={(id) => removeItem("blogs", id)}
            onUpdate={(id, patch) => updateItem("blogs", id, patch)}
            onReorder={(next) => reorderItems("blogs", next)}
            shadowCss={shadowCss}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            experience={portfolio.experience}
            onAdd={(item) => addItem("experience", item)}
            onRemove={(id) => removeItem("experience", id)}
            onUpdate={(id, patch) => updateItem("experience", id, patch)}
            onReorder={(next) => reorderItems("experience", next)}
            shadowCss={shadowCss}
          />
        );
      case "achievements":
        return (
          <AchievementsEditor
            achievements={portfolio.achievements}
            onAdd={(item) => addItem("achievements", item)}
            onRemove={(id) => removeItem("achievements", id)}
            onUpdate={(id, patch) => updateItem("achievements", id, patch)}
            onReorder={(next) => reorderItems("achievements", next)}
            shadowCss={shadowCss}
          />
        );
      default:
        if (id.startsWith("custom:")) {
          const section = (portfolio.customSections ?? []).find((s) => s.id === id);
          if (!section) return null;
          return (
            <CustomSectionEditor
              section={section}
              onUpdateSection={updateCustomSection}
              onAddItem={addCustomItem}
              onUpdateItem={updateCustomItem}
              onRemoveItem={removeCustomItem}
              onReorderItems={reorderCustomItems}
              shadowCss={shadowCss}
            />
          );
        }
        return null;
    }
  };

  if (isAuthLoading || (!session && !isAuthLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-xs text-muted-foreground">authenticating<span className="animate-blink">_</span></p>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-xs text-muted-foreground">loading_portfolio<span className="animate-blink">_</span></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 font-mono font-bold text-sm shrink-0 group leading-none">
            <Logo className="h-5 w-5 group-hover:text-neon transition-colors" />
            <span className="leading-none">~/folio</span>
            <span className="text-muted-foreground hidden sm:inline leading-none">/dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground">
              <span className={`h-1.5 w-1.5 ${savedAt ? "bg-neon" : "bg-amber"} ${savedAt ? "shadow-glow-neon" : ""}`} />
              {savedLabel}
            </span>
            <Link
              to="/u/$handle"
              params={{ handle: portfolio.handle || "you" }}
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 h-8 border border-border hover:border-cyan hover:text-cyan transition-colors"
              title="view live page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">view live</span>
            </Link>
            <button
              onClick={() => setShowShareDialog(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 border border-border hover:border-cyan hover:text-cyan transition-colors"
              title="share profile"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">share</span>
            </button>
            <button
              onClick={forceSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1 px-3 h-8 bg-neon text-background font-bold hover:shadow-glow-neon transition-shadow disabled:opacity-50"
              title="save changes"
            >
              <Save className={`h-3.5 w-3.5 ${isSaving ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">{isSaving ? "saving..." : "save"}</span>
            </button>
            
            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <div 
                className={cn(
                  "flex items-center gap-1.5 transition-all duration-300 ease-in-out overflow-hidden",
                  isSystemOpen ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0 invisible sm:visible"
                )}
              >
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1 px-2.5 h-8 border border-border hover:border-destructive hover:text-destructive transition-colors text-muted-foreground shrink-0"
                  title="reset portfolio"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">reset</span>
                </button>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-8 border border-border hover:border-destructive hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-200 shrink-0"
                  title="log out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-mono text-[11px]">logout</span>
                </button>
              </div>

              <button
                onClick={() => setIsSystemOpen(!isSystemOpen)}
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 border border-border hover:border-foreground transition-all duration-300",
                  isSystemOpen ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
                title={isSystemOpen ? "collapse system actions" : "expand system actions"}
              >
                <Settings className={cn("h-4 w-4 transition-transform duration-500", isSystemOpen ? "rotate-90" : "")} />
              </button>
            </div>
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

          {/* Dynamic Sections mapped from order */}
          {portfolio.order.map((id) => renderSectionEditor(id))}
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

      {/* Logout Confirmation */}
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onLogout={logout}
        onOpenDelete={() => setShowDeleteDialog(true)}
      />

      {/* Delete Account Confirmation */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={deletePortfolioAccount}
        handle={portfolio.handle}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        profileUrl={profileUrl}
      />
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "dashboard — folio" },
      { name: "description", content: "Build your folio portfolio." },
    ],
  }),
  component: Dashboard,
});

