import type { PortfolioThemeId } from "@/lib/portfolio";

export type ThemeView = {
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

export const THEME_VIEW: Record<Exclude<PortfolioThemeId, "terminal">, ThemeView> = {
  vercel: {
    id: "vercel",
    shell: "bg-white text-[#171717]",
    frame: "rounded-xl border border-[#ebebeb] bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px]",
    frameBar: "border-b border-[#ebebeb] bg-[#fafafa] text-[#666666]",
    page: "bg-white px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-8 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-full border border-[#ebebeb] shadow-sm",
    title: "font-sans text-3xl md:text-5xl font-bold tracking-tight text-[#171717]",
    eyebrow: "text-sm font-medium uppercase tracking-widest text-[#666666]",
    muted: "text-[#4d4d4d]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border-b border-[#ebebeb] pb-6 last:border-b-0",
    sectionTitle: "font-sans text-base font-semibold uppercase tracking-widest text-[#171717]",
    item: "rounded-md border border-[#ebebeb] bg-white p-4 transition-colors hover:bg-[#fafafa]",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-[#0072f5] hover:text-[#0068d6]",
    badge: "rounded-full border border-transparent bg-[#ebf5ff] px-3 py-1 text-sm font-medium text-[#0068d6] transition-all hover:border-(--section-accent) hover:bg-[#ebf5ff]",
    customCard: "rounded-md border border-[#ebebeb] bg-[#fafafa] p-4",
    galleryImage: "rounded-md border border-[#ebebeb]",
    accent: "#0070f3",
  },
  vercelDark: {
    id: "vercelDark",
    shell: "bg-[#000000] text-[#fafafa]",
    frame: "rounded-xl border border-[#171717] bg-[#000000] shadow-[0_24px_70px_rgba(0,0,0,0.55)]",
    frameBar: "border-b border-[#171717] bg-[#0a0a0a] text-[#808080]",
    page: "bg-[#000000] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-8 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-full border border-[#171717] shadow-sm",
    title: "font-sans text-3xl md:text-5xl font-bold tracking-tight text-[#ffffff]",
    eyebrow: "text-sm font-medium uppercase tracking-widest text-[#808080]",
    muted: "text-[#808080]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border-b border-[#171717] pb-6 last:border-b-0",
    sectionTitle: "font-sans text-base font-semibold uppercase tracking-widest text-[#ffffff]",
    item: "rounded-md border border-[#171717] bg-[#0a0a0a] p-4 transition-colors hover:bg-[#171717]",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-[#0072f5] hover:text-[#0068d6]",
    badge: "rounded-full border border-[#171717] bg-[#0a0a0a] px-3 py-1 text-sm text-[#fafafa] transition-all hover:border-(--section-accent) hover:bg-[#171717]",
    customCard: "rounded-md border border-[#171717] bg-[#0a0a0a] p-4",
    galleryImage: "rounded-md border border-[#171717]",
    accent: "#fafafa",
  },
  material: {
    id: "material",
    shell: "bg-[#fbf7ff] text-[#1f1b24]",
    frame: "rounded-xl border border-[#e7dff5] bg-[#fbf7ff] shadow-[0_24px_70px_rgba(103,80,164,0.18)] overflow-hidden",
    frameBar: "border-b border-[#e7dff5] bg-[#f1e8ff] text-[#625b71]",
    page: "bg-[linear-gradient(135deg,#fbf7ff_0%,#fff7ed_48%,#effdf7_100%)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-8 sm:flex-row sm:items-center",
    avatar: "rounded-[24px] shadow-[0_10px_28px_rgba(103,80,164,0.22)]",
    title: "font-sans text-3xl md:text-5xl font-bold tracking-normal text-[#1f1b24]",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-[#6750a4]",
    muted: "text-[#625b71]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "rounded-[24px] bg-white/76 p-5 shadow-[0_10px_30px_rgba(103,80,164,0.10)]",
    sectionTitle: "font-sans text-base font-bold uppercase tracking-widest text-[#6750a4]",
    item: "rounded-[18px] border border-[#e7dff5] bg-[#fffbff] p-4 transition-transform hover:-translate-y-0.5",
    simpleItem: "rounded-[18px] bg-white/55 px-4 py-3",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-[#6750a4] hover:text-[#4f378b]",
    badge: "rounded-full bg-[#eaddff] px-3 py-1 text-sm font-semibold text-[#21005d] transition-all hover:border-(--section-accent) border border-transparent",
    customCard: "rounded-[18px] bg-[#fef7ff] p-4",
    galleryImage: "rounded-[16px]",
    accent: "#6750a4",
  },
  editorial: {
    id: "editorial",
    shell: "bg-[#f8fafc] text-slate-950",
    frame: "rounded-xl border border-slate-300 bg-[#f8fafc] shadow-[0_28px_80px_rgba(15,23,42,0.12)]",
    frameBar: "border-b border-slate-300 bg-[#f1f5f9] text-slate-500",
    page: "bg-[#f8fafc] px-6 py-8 md:px-12 md:py-12",
    header: "flex flex-col gap-8 border-b-2 border-slate-950 pb-8 sm:flex-row sm:items-center",
    avatar: "rounded-sm border border-slate-300 grayscale",
    title: "font-sans text-4xl md:text-6xl font-bold tracking-normal leading-tight text-slate-950",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-amber-700",
    muted: "text-slate-600",
    sectionGrid: "mt-2 flex flex-col",
    section: "grid gap-4 md:grid-cols-[160px_minmax(0,1fr)] border-b border-slate-300 py-10",
    sectionTitle: "font-sans text-sm font-bold uppercase tracking-widest text-slate-950",
    item: "border-t border-slate-300 py-4 first:border-t-0 first:pt-0",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-slate-950 underline decoration-amber-600/60 underline-offset-4 hover:decoration-amber-600",
    badge: "border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 transition-all hover:border-(--section-accent) hover:text-slate-950 hover:bg-slate-50",
    customCard: "border-t border-slate-300 py-4 first:border-t-0 first:pt-0",
    galleryImage: "rounded-sm",
    accent: "#b45309",
  },
  studio: {
    id: "studio",
    shell: "bg-[#111111] text-white",
    frame: "rounded-xl border border-white/10 bg-[#111111] shadow-[0_28px_90px_rgba(244,63,94,0.18)]",
    frameBar: "border-b border-white/10 bg-[#18181b] text-zinc-400",
    page: "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.28),transparent_34%),linear-gradient(135deg,#111111,#171717_55%,#0f172a)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col gap-8 sm:flex-row sm:items-center",
    avatar: "rounded-2xl border border-white/15 shadow-[10px_10px_0_#f43f5e]",
    title: "font-sans text-4xl md:text-6xl font-black tracking-normal leading-none text-white",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-sky-300",
    muted: "text-zinc-300",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border border-white/10 bg-white/[0.06] p-5 backdrop-blur",
    sectionTitle: "font-sans text-base font-black uppercase tracking-widest text-white",
    item: "border border-white/10 bg-black/20 p-4 transition-colors hover:border-rose-400/70",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-sky-300 hover:text-rose-300",
    badge: "border border-white/10 bg-white/10 px-3 py-1 text-sm text-zinc-100 transition-all hover:bg-white/20 hover:border-(--section-accent)",
    customCard: "border border-white/10 bg-black/20 p-4",
    galleryImage: "rounded-xl",
    accent: "#f43f5e",
  },
};
