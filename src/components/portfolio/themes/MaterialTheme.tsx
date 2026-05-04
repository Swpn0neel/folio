import { Portfolio } from "@/lib/portfolio";
import { ThemedRenderer } from "./ThemedRenderer";

export function MaterialTheme({ portfolio, framed = true }: { portfolio: Portfolio; framed?: boolean }) {
  return <ThemedRenderer portfolio={portfolio} framed={framed} theme="material" />;
}
