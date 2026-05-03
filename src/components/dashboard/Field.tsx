import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

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

export function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: FieldProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="block">
      <div className="flex items-center justify-between min-h-[18px]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> {label}
        </span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      <div className="mt-1 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://..."}
            className="w-full bg-background border border-border focus:border-neon outline-none py-2 pl-9 pr-10 font-mono text-sm placeholder:text-muted-foreground/40 transition-colors"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive p-1 transition-colors"
              title="clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <label className="shrink-0 flex items-center justify-center gap-2 px-3 border border-border hover:border-neon hover:text-neon cursor-pointer transition-colors font-mono text-xs uppercase tracking-widest bg-background group">
          <Upload className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {value && value.startsWith("data:") && (
        <p className="mt-1 font-mono text-[9px] text-muted-foreground/60 uppercase tracking-tighter">
          [ local image uploaded ]
        </p>
      )}
    </div>
  );
}

