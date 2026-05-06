import React from "react";
import { resolveAccent } from "@/lib/colors";
import type { Portfolio, PortfolioThemeId } from "@/lib/portfolio";
import { THEME_VIEW } from "@/config/themes";
import { ThemedProfile, ThemedSection } from "./ThemedComponents";

export function ThemedRenderer({
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
  const profileAccent = resolveAccent("profile", portfolio.sectionColors ?? {}, theme);
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
        <div className="absolute left-1/2 top-1/2 w-full max-w-[180px] sm:max-w-md -translate-x-1/2 -translate-y-1/2 truncate px-3 text-center text-xs">
          fo1io.vercel.app/u/{portfolio.handle || "you"}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">{page}</div>
    </div>
  );
}
