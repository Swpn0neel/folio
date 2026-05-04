import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  defaultPortfolio,
  loadPortfolio,
  savePortfolio,
  type Portfolio,
  type SectionId,
  type CustomSection,
  type CustomSectionItem,
  type CustomSectionTemplate,
  type PortfolioThemeId,
  deleteAccount as apiDeleteAccount,
} from "@/lib/portfolio";
import { uid } from "@/utils/id";
import { SECTION_COLOR_GROUPS, remapSectionColorsForTheme, resolveAccent } from "@/lib/colors";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

export function useDashboard() {
  const navigate = useNavigate();
  const { session, isLoading: isAuthLoading } = useAuth();

  const [portfolio, setPortfolio] = useState<Portfolio>(() => defaultPortfolio());
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dialog visibility states
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);

  // Auth redirect
  useEffect(() => {
    if (!isAuthLoading && !session) {
      navigate({ to: "/login", replace: true });
    }
  }, [session, isAuthLoading, navigate]);

  // Hydrate from Supabase on mount
  useEffect(() => {
    const userId = session?.user.id;
    if (!userId || hydrated) return;

    loadPortfolio()
      .then((loaded) => {
        // Enforce profile at top and enabled
        loaded.enabled.profile = true;
        if (loaded.order[0] !== "profile") {
          loaded.order = ["profile", ...loaded.order.filter((id) => id !== "profile")];
        }
        setPortfolio(loaded);
        setHydrated(true);
      })
      .catch((err) => {
        console.error("Hydration failed:", err);
        // We don't set hydrated to true here, so it might retry if userId changes
      });
  }, [session?.user.id, hydrated]);

  // Autosave (debounced) once hydrated
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(async () => {
      try {
        await savePortfolio(portfolio);
        setSavedAt(Date.now());
      } catch (err) {
        console.error("Autosave failed:", err);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [portfolio, hydrated]);

  // Actions
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

  const sc = (id: string) => resolveAccent(id, portfolio.sectionColors ?? {});

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

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/u/${portfolio.handle || "you"}`;
  }, [portfolio.handle]);

  // List editor helpers
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

  const reorderItems = <K extends "socials" | "projects" | "blogs" | "experience" | "achievements">(
    key: K,
    next: Portfolio[K]
  ) => setPortfolio((p) => ({ ...p, [key]: next } as Portfolio));

  // Custom sections helpers
  const addCustomSection = (title: string) => {
    const id = `custom:${uid()}`;
    const section: CustomSection = { id, title, template: "simple", items: [] };
    const theme = portfolio.theme ?? "terminal";
    const defaultColor = (SECTION_COLOR_GROUPS[theme] ?? SECTION_COLOR_GROUPS.terminal)[0].key;

    setPortfolio((p) => ({
      ...p,
      customSections: [...(p.customSections ?? []), section],
      order: [...p.order, id],
      enabled: { ...p.enabled, [id]: true },
      sectionColors: { ...p.sectionColors, [id]: defaultColor },
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

  const reorderCustomItems = (sectionId: string, next: CustomSectionItem[]) =>
    setPortfolio((p) => ({
      ...p,
      customSections: (p.customSections ?? []).map((s) =>
        s.id === sectionId ? { ...s, items: next } : s
      ),
    }));

  const forceSave = async () => {
    setIsSaving(true);
    await savePortfolio(portfolio);
    setSavedAt(Date.now());
    setIsSaving(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const deletePortfolioAccount = async () => {
    await apiDeleteAccount();
    navigate({ to: "/", replace: true });
  };

  return {
    // State
    portfolio,
    hydrated,
    savedAt,
    isSaving,
    isAuthLoading,
    session,
    
    // Dialog states
    showLogoutDialog,
    setShowLogoutDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showShareDialog,
    setShowShareDialog,
    isSystemOpen,
    setIsSystemOpen,

    // UI helpers
    savedLabel,
    profileUrl,
    sc,

    // Actions
    update,
    toggleSection,
    reorderSections,
    setSectionColor,
    changeTheme,
    reset,
    forceSave,
    
    // Item Actions
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    
    // Custom Section Actions
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomItem,
    updateCustomItem,
    removeCustomItem,
    reorderCustomItems,
    logout,
    deletePortfolioAccount,
  };
}
