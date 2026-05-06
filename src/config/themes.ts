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
    shell: "bg-white text-[#171717] font-sans",
    frame: "rounded-xl border border-[#ebebeb] bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px]",
    frameBar: "border-b border-[#ebebeb] bg-[#fafafa] text-[#666666]",
    page: "bg-white px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col md:flex-row gap-8 items-start md:items-center mb-10 pb-8 border-b border-[#ebebeb]",
    avatar: "rounded-full border border-[#ebebeb] shadow-sm",
    title: "text-2xl md:text-4xl font-bold tracking-tight text-[#171717] mb-1.5",
    eyebrow: "text-sm font-medium uppercase tracking-widest text-[#666666] mb-2",
    muted: "text-sm md:text-base leading-relaxed text-[#4d4d4d]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border-b border-[#ebebeb] pb-6 last:border-b-0",
    sectionTitle: "text-base font-semibold uppercase tracking-widest text-[#171717]",
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
    shell: "bg-black text-[#ededed] font-sans",
    frame: "rounded-xl border border-[#333333] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.6)]",
    frameBar: "border-b border-[#333333] bg-[#111111] text-[#888888]",
    page: "bg-black px-6 py-8 md:px-10 md:py-10",
    header: "flex flex-col md:flex-row gap-8 items-start md:items-center mb-10 pb-8 border-b border-[#333333]",
    avatar: "rounded-full border border-[#333333] shadow-sm",
    title: "text-2xl md:text-4xl font-bold tracking-tight text-white mb-1.5",
    eyebrow: "text-sm font-medium uppercase tracking-widest text-[#888888] mb-2",
    muted: "text-sm md:text-base leading-relaxed text-[#a1a1a1]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border-b border-[#333333] pb-6 last:border-b-0",
    sectionTitle: "text-base font-semibold uppercase tracking-widest text-white",
    item: "border-t border-[#333333] first:border-t-0 first:pt-0 py-4 transition-colors",
    simpleItem: "border-l-2 border-[#333333] py-1 pl-4 hover:border-(--section-accent) transition-colors",
    timelineItem: "relative border-l-2 border-[#333333] py-1 pl-5 hover:border-(--section-accent) transition-colors",
    link: "text-[#0070f3] hover:text-[#3291ff] transition-colors",
    badge: "rounded-full border border-[#333333] bg-transparent px-3 py-1 text-sm text-[#ededed] transition-all hover:border-(--section-accent)",
    customCard: "border-t border-[#333333] first:border-t-0 first:pt-0 py-4",
    galleryImage: "rounded-md border border-[#333333]",
    accent: "#0070f3",
  },
  material: {
    id: "material",
    shell: "bg-[#fbf7ff] text-[#1f1b24] font-outfit",
    frame: "rounded-xl border border-[#e7dff5] bg-[#fbf7ff] shadow-[0_24px_70px_rgba(103,80,164,0.18)] overflow-hidden",
    frameBar: "border-b border-[#e7dff5] bg-[#f1e8ff] text-[#625b71]",
    page: "bg-[linear-gradient(135deg,#fbf7ff_0%,#fff7ed_48%,#effdf7_100%)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col md:flex-row gap-8 items-start md:items-center mb-10",
    avatar: "rounded-[24px] shadow-[0_10px_28px_rgba(103,80,164,0.22)]",
    title: "text-2xl md:text-4xl font-bold tracking-normal text-[#1f1b24] mb-1.5",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-[#6750a4] mb-2",
    muted: "text-sm md:text-base leading-relaxed text-[#625b71]",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "rounded-[24px] bg-white/76 p-5 shadow-[0_10px_30px_rgba(103,80,164,0.10)]",
    sectionTitle: "text-base font-bold uppercase tracking-widest text-[#6750a4]",
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
    shell: "bg-[#f8fafc] text-slate-950 font-body",
    frame: "rounded-xl border border-slate-300 bg-[#f8fafc] shadow-[0_28px_80px_rgba(15,23,42,0.12)]",
    frameBar: "border-b border-slate-300 bg-[#f1f5f9] text-slate-500",
    page: "bg-[#f8fafc] px-6 py-8 md:px-12 md:py-12",
    header: "flex flex-col md:flex-row gap-8 items-start md:items-center mb-10 border-b-2 border-slate-950 pb-8",
    avatar: "rounded-sm border border-slate-300 grayscale",
    title: "font-serif text-2xl md:text-4xl font-bold tracking-normal leading-tight text-slate-950 mb-1.5",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-amber-700 mb-2",
    muted: "text-sm md:text-base leading-relaxed text-slate-600",
    sectionGrid: "mt-2 flex flex-col",
    section: "grid gap-4 md:grid-cols-[160px_minmax(0,1fr)] border-b border-slate-300 py-10",
    sectionTitle: "font-serif text-sm font-bold uppercase tracking-widest text-slate-950",
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
    shell: "bg-[#111111] text-white font-display",
    frame: "rounded-xl border border-white/10 bg-[#111111]",
    frameBar: "border-b border-white/10 bg-[#18181b] text-zinc-400",
    page: "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.28),transparent_34%),linear-gradient(135deg,#111111,#171717_55%,#0f172a)] px-6 py-7 md:px-10 md:py-10",
    header: "flex flex-col md:flex-row gap-8 items-start md:items-center mb-10",
    avatar: "rounded-2xl border border-white/15 shadow-[10px_10px_0_#f43f5e]",
    title: "text-2xl md:text-4xl font-black tracking-normal leading-none text-white mb-1.5",
    eyebrow: "text-sm font-bold uppercase tracking-widest text-sky-300 mb-2",
    muted: "text-sm md:text-base leading-relaxed text-zinc-300",
    sectionGrid: "mt-10 grid grid-cols-1 gap-8",
    section: "border border-white/10 bg-white/[0.06] p-5 backdrop-blur",
    sectionTitle: "text-base font-black uppercase tracking-widest text-white",
    item: "border border-white/10 bg-black/20 p-4 transition-colors hover:border-rose-400/70",
    simpleItem: "border-l-2 py-1 pl-4",
    timelineItem: "relative border-l-2 py-1 pl-5",
    link: "text-sky-300 hover:text-rose-300",
    badge: "border border-white/10 bg-white/10 px-3 py-1 text-sm text-zinc-100 transition-all hover:bg-white/20 hover:border-(--section-accent)",
    customCard: "border border-white/10 bg-black/20 p-4",
    galleryImage: "rounded-xl",
    accent: "#f43f5e",
  },
  discord: {
    id: "discord",
    shell: "bg-[#313338] text-[#dbdee1] font-sans",
    frame: "rounded-xl border border-[#1e1f22] bg-[#313338]",
    frameBar: "border-b border-[#1e1f22] bg-[#2b2d31] text-[#949ba4]",
    page: "bg-[#313338] px-4 py-6 md:px-12 md:py-10",
    header: "flex flex-col bg-[#232428] rounded-[24px] p-6 pt-16 md:pt-20 relative mt-16 md:mt-20 mb-10",
    avatar: "rounded-[9999px] border-[6px] !border-[#232428] bg-[#1e1f22] absolute -top-12 md:-top-16 left-6 md:left-8",
    title: "text-2xl md:text-4xl font-bold tracking-tight text-[#f2f3f5] mb-1.5",
    eyebrow: "text-sm font-bold text-[#f2f3f5] mb-2",
    muted: "text-sm md:text-base leading-relaxed text-[#b5bac1]",
    sectionGrid: "mt-8 flex flex-col gap-6",
    section: "rounded-[24px] bg-[#232428] p-5 md:p-6",
    sectionTitle: "text-[12px] font-bold uppercase tracking-widest text-[#949ba4]",
    item: "rounded-[12px] bg-[#2b2d31] p-4 transition-colors hover:bg-[#313338] [&_.min-w-0>p:first-child]:!text-[#f2f3f5] [&_.min-w-0>p:nth-child(2)]:!text-(--section-accent) [&_.min-w-0>p:nth-child(2)]:bg-(--section-accent)/15 [&_.min-w-0>p:nth-child(2)]:inline-flex [&_.min-w-0>p:nth-child(2)]:px-2 [&_.min-w-0>p:nth-child(2)]:py-0.5 [&_.min-w-0>p:nth-child(2)]:rounded-[6px] [&_.min-w-0>p:nth-child(2)]:text-[11px] [&_.min-w-0>p:nth-child(2)]:font-bold [&_.min-w-0>p:nth-child(2)]:mt-1.5",
    simpleItem: "rounded-[12px] bg-[#2b2d31] py-3 px-4 transition-colors hover:bg-[#313338] [&_.min-w-0>p:first-child]:!text-[#f2f3f5] [&_.min-w-0>p:nth-child(2)]:!text-(--section-accent) [&_.min-w-0>p:nth-child(2)]:bg-(--section-accent)/15 [&_.min-w-0>p:nth-child(2)]:inline-flex [&_.min-w-0>p:nth-child(2)]:px-2 [&_.min-w-0>p:nth-child(2)]:py-0.5 [&_.min-w-0>p:nth-child(2)]:rounded-[6px] [&_.min-w-0>p:nth-child(2)]:text-[11px] [&_.min-w-0>p:nth-child(2)]:font-bold [&_.min-w-0>p:nth-child(2)]:mt-1.5",
    timelineItem: "relative pl-10 pb-12 last:pb-0 before:absolute before:left-0 before:top-4 before:bottom-0 before:w-[2px] before:bg-[#3f4147] last:before:hidden hover:before:bg-(--section-accent)/50 transition-all duration-300 [&_span.absolute]:h-3.5 [&_span.absolute]:w-3.5 [&_span.absolute]:-left-[6px] [&_span.absolute]:top-1.5 [&_span.absolute]:border-2 [&_span.absolute]:border-[#232428] [&_span.absolute]:ring-2 [&_span.absolute]:ring-(--section-accent) [&_.min-w-0>p:first-child]:text-lg [&_.min-w-0>p:first-child]:!text-[#f2f3f5] [&_.min-w-0>p:nth-child(2)]:!mt-3",
    link: "text-[#00a8fc] hover:underline",
    badge: "rounded-[12px] bg-[#2b2d31] px-3 py-1.5 text-xs font-semibold text-[#dbdee1] transition-colors hover:bg-[#313338] hover:text-(--section-accent)",
    customCard: "rounded-[12px] bg-[#2b2d31] p-4 hover:bg-[#313338] transition-colors",
    galleryImage: "rounded-[12px] object-cover",
    accent: "#5865F2",
  },
};
