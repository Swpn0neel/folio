import type { Portfolio } from "@/lib/portfolio";
import { TerminalTheme } from "./themes/TerminalTheme";
import { VercelTheme } from "./themes/VercelTheme";
import { MaterialTheme } from "./themes/MaterialTheme";
import { EditorialTheme } from "./themes/EditorialTheme";
import { StudioTheme } from "./themes/StudioTheme";
import { DiscordTheme } from "./themes/DiscordTheme";

export function PortfolioRenderer({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  if (!portfolio) return null;

  const theme = portfolio.theme ?? "terminal";

  switch (theme) {
    case "terminal":
      return <TerminalTheme portfolio={portfolio} framed={framed} />;
    case "vercel":
      return <VercelTheme portfolio={portfolio} framed={framed} />;
    case "vercelDark":
      return <VercelTheme portfolio={portfolio} framed={framed} dark />;
    case "material":
      return <MaterialTheme portfolio={portfolio} framed={framed} />;
    case "editorial":
      return <EditorialTheme portfolio={portfolio} framed={framed} />;
    case "studio":
      return <StudioTheme portfolio={portfolio} framed={framed} />;
    case "discord":
      return <DiscordTheme portfolio={portfolio} framed={framed} />;
    default:
      return <TerminalTheme portfolio={portfolio} framed={framed} />;
  }
}
