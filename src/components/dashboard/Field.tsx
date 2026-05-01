import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: ReactNode;
  icon?: ReactNode;
};

export function Field({
  label,
  hint,
  icon,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="flex items-center justify-between min-h-[18px]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> {label}
        </span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      <div className="relative mt-1">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full bg-background border border-border focus:border-neon outline-none py-2 font-mono text-sm placeholder:text-muted-foreground/40 transition-colors ${icon ? "pl-9 pr-3" : "px-3"} ${props.className || ""}`}
        />
      </div>
    </label>
  );
}

export function TextField({
  label,
  hint,
  icon,
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
        className={`mt-1 w-full bg-background border border-border focus:border-neon outline-none px-3 py-2 font-mono text-sm placeholder:text-muted-foreground/40 transition-colors resize-y ${props.className || ""}`}
      />
    </label>
  );
}
