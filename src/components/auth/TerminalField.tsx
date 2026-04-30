import type { InputHTMLAttributes } from "react";

export function TerminalField({
  label,
  prefix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="text-amber">▸</span> {label}
      </span>
      <div className="mt-1.5 flex items-center border border-border focus-within:border-neon bg-background px-3 py-2 transition-colors">
        {prefix && <span className="font-mono text-sm text-magenta mr-1 shrink-0">{prefix}</span>}
        <input
          {...props}
          className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground/40 min-w-0"
        />
      </div>
    </label>
  );
}
