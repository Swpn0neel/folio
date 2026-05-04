import { Portfolio } from "@/lib/portfolio";
import { ThemedRenderer } from "./ThemedRenderer";

export function StudioTheme({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  return <ThemedRenderer portfolio={portfolio} framed={framed} theme="studio" />;
}
