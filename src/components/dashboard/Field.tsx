import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

export function Field({
  label,
  hint,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> {label}
        </span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      <input
        {...props}
        className="mt-1 w-full bg-background border border-border focus:border-neon outline-none px-3 py-2 font-mono text-sm placeholder:text-muted-foreground/40 transition-colors"
      />
    </label>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> {label}
        </span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      <textarea
        rows={3}
        {...props}
        className="mt-1 w-full bg-background border border-border focus:border-neon outline-none px-3 py-2 font-mono text-sm placeholder:text-muted-foreground/40 transition-colors resize-y"
      />
    </label>
  );
}
