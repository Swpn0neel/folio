import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  CUSTOM_SECTION_TEMPLATES,
  getCustomSectionTemplateMeta,
  type CustomSectionTemplate,
} from "@/lib/portfolio";

interface TemplateSelectProps {
  value: CustomSectionTemplate;
  onChange: (value: CustomSectionTemplate) => void;
}

export function TemplateSelect({
  value,
  onChange,
}: TemplateSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = getCustomSectionTemplateMeta(value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative block">
      <div className="flex items-center justify-between min-h-[18px] mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="text-amber">▸</span> template
        </span>
      </div>
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-background border border-border hover:border-foreground focus:border-neon outline-none px-3 py-2 font-mono text-sm text-foreground transition-colors text-left"
      >
        <span>{meta.label}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 border border-border bg-card py-1 shadow-brutal max-h-72 overflow-y-auto">
          {CUSTOM_SECTION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onChange(template.id);
                setOpen(false);
              }}
              className={`w-full flex flex-col items-start px-3 py-2 hover:bg-secondary transition-colors text-left ${
                value === template.id ? "bg-secondary/50" : ""
              }`}
            >
              <span className={`font-mono text-sm ${value === template.id ? "text-neon font-bold" : "text-foreground"}`}>
                {template.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground leading-tight">
                {template.desc}
              </span>
            </button>
          ))}
        </div>
      )}      
    </div>
  );
}
