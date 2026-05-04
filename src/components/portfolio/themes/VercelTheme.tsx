import { Portfolio } from "@/lib/portfolio";
import { ThemedRenderer } from "./ThemedRenderer";

export function VercelTheme({ portfolio, framed = true, dark = false }: { portfolio: Portfolio; framed?: boolean; dark?: boolean }) {
  return <ThemedRenderer portfolio={portfolio} framed={framed} theme={dark ? "vercelDark" : "vercel"} />;
}
