import { useEffect, useRef, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { getSectionMeta, type CustomSection, type PortfolioThemeId, type SectionId } from "@/lib/portfolio";

// ─── Colour palette ────────────────────────────────────────────────────────────
type SectionColor = { key: string; label: string; css: string };

/** Color options the user can pick per section. */
export const SECTION_COLOR_GROUPS: Record<PortfolioThemeId, SectionColor[]> = {
  terminal: [
    { key: "neon", label: "neon", css: "var(--neon)" },
    { key: "cyan", label: "cyan", css: "var(--cyan)" },
    { key: "magenta", label: "magenta", css: "var(--magenta)" },
    { key: "amber", label: "amber", css: "var(--amber)" },
    { key: "indigo", label: "indigo", css: "var(--indigo)" },
    { key: "rose", label: "rose", css: "var(--rose)" },
  ],
  vercel: [
    { key: "graphite", label: "graphite", css: "oklch(0.22 0.02 255)" },
    { key: "zinc", label: "zinc", css: "oklch(0.50 0.02 255)" },
    { key: "vercelBlue", label: "blue", css: "oklch(0.56 0.19 255)" },
    { key: "vercelGreen", label: "green", css: "oklch(0.58 0.14 155)" },
    { key: "vercelViolet", label: "violet", css: "oklch(0.58 0.17 292)" },
    { key: "vercelRed", label: "red", css: "oklch(0.58 0.18 25)" },
  ],
  vercelDark: [
    { key: "darkSilver", label: "silver", css: "oklch(0.84 0.03 255)" },
    { key: "darkBlue", label: "blue", css: "oklch(0.72 0.16 245)" },
    { key: "darkMint", label: "mint", css: "oklch(0.78 0.14 165)" },
    { key: "darkViolet", label: "violet", css: "oklch(0.74 0.18 300)" },
    { key: "darkAmber", label: "amber", css: "oklch(0.82 0.15 85)" },
    { key: "darkRose", label: "rose", css: "oklch(0.72 0.19 20)" },
  ],
  material: [
    { key: "lavender", label: "lavender", css: "oklch(0.62 0.17 305)" },
    { key: "blossom", label: "blossom", css: "oklch(0.74 0.16 350)" },
    { key: "seafoam", label: "seafoam", css: "oklch(0.78 0.13 170)" },
    { key: "daySky", label: "day sky", css: "oklch(0.73 0.12 235)" },
    { key: "sunset", label: "sunset", css: "oklch(0.76 0.16 45)" },
    { key: "marigold", label: "marigold", css: "oklch(0.82 0.15 90)" },
  ],
  editorial: [
    { key: "charcoal", label: "charcoal", css: "oklch(0.24 0.03 255)" },
    { key: "ochre", label: "ochre", css: "oklch(0.58 0.13 75)" },
    { key: "brick", label: "brick", css: "oklch(0.50 0.15 32)" },
    { key: "forest", label: "forest", css: "oklch(0.42 0.10 155)" },
    { key: "navy", label: "navy", css: "oklch(0.36 0.10 255)" },
    { key: "plum", label: "plum", css: "oklch(0.42 0.12 320)" },
  ],
  studio: [
    { key: "hotPink", label: "hot pink", css: "oklch(0.69 0.25 358)" },
    { key: "electricBlue", label: "electric blue", css: "oklch(0.72 0.18 235)" },
    { key: "acid", label: "acid", css: "oklch(0.86 0.22 125)" },
    { key: "tangerine", label: "tangerine", css: "oklch(0.74 0.20 50)" },
    { key: "ultraviolet", label: "ultraviolet", css: "oklch(0.66 0.24 300)" },
    { key: "laserAqua", label: "laser aqua", css: "oklch(0.82 0.15 190)" },
  ],
};

const LEGACY_SECTION_COLORS: SectionColor[] = [
  { key: "emerald", label: "emerald", css: "oklch(0.72 0.20 155)" },
  { key: "lime", label: "lime", css: "oklch(0.84 0.20 125)" },
  { key: "sky", label: "sky", css: "oklch(0.72 0.17 235)" },
  { key: "blue", label: "blue", css: "oklch(0.62 0.22 255)" },
  { key: "purple", label: "purple", css: "oklch(0.64 0.23 305)" },
  { key: "pink", label: "pink", css: "oklch(0.72 0.24 350)" },
  { key: "coral", label: "coral", css: "oklch(0.72 0.20 35)" },
  { key: "orange", label: "orange", css: "oklch(0.76 0.19 55)" },
  { key: "gold", label: "gold", css: "oklch(0.82 0.16 95)" },
  { key: "mint", label: "mint", css: "oklch(0.82 0.14 170)" },
  { key: "teal", label: "teal", css: "oklch(0.70 0.15 190)" },
  { key: "slate", label: "slate", css: "oklch(0.55 0.05 255)" },
];

export const SECTION_COLORS = [...Object.values(SECTION_COLOR_GROUPS).flat(), ...LEGACY_SECTION_COLORS];

/** Resolves the CSS var string for a colour key. */
export function colorToCss(key: string): string {
  return SECTION_COLORS.find((c) => c.key === key)?.css ?? "var(--neon)";
}

type Props = {
  theme: PortfolioThemeId;
  order: SectionId[];
  enabled: Record<string, boolean>;
  sectionColors: Record<string, string>;
  customSections: CustomSection[];
  onReorder: (next: SectionId[]) => void;
  onToggle: (id: SectionId) => void;
  onColorChange: (id: string, color: string) => void;
  onRemoveCustom?: (id: string) => void;
  onAddCustom?: (title: string) => void;
};

export function SectionsManager({
  theme, order, enabled, sectionColors, customSections,
  onReorder, onToggle, onColorChange, onRemoveCustom, onAddCustom,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (addingCustom) inputRef.current?.focus();
  }, [addingCustom]);

  const commitAdd = () => {
    const t = newTitle.trim();
    if (t) onAddCustom?.(t);
    setNewTitle("");
    setAddingCustom(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id as SectionId);
    const newIndex = order.indexOf(over.id as SectionId);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  if (!mounted) {
    return (
      <div className="space-y-1">
        {order.map((id) => {
          const meta = getSectionMeta(id, customSections);
          const on = enabled[id];
          return (
            <div
              key={id}
              className="flex items-center gap-2 border border-transparent bg-background/50 px-2 py-2"
            >
              <span className="text-muted-foreground/60">
                <GripVertical className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm">
                  <span className="text-neon">$</span> {meta.label}
                </p>
                <p className="text-xs font-mono text-muted-foreground truncate">{meta.desc}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${
                  on ? "border-neon text-neon" : "border-border text-muted-foreground"
                }`}
              >
                {on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {on ? "on" : "off"}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-1 mb-2">
            {order.map((id) => (
              <SortableRow
                key={id}
                id={id}
                on={enabled[id]}
                color={sectionColors[id] ?? "default"}
                theme={theme}
                customSections={customSections}
                onToggle={() => onToggle(id)}
                onColorChange={(c) => onColorChange(id, c)}
                onRemove={id.startsWith("custom:") && onRemoveCustom ? () => onRemoveCustom(id) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add custom section inline form */}
      <div className="mt-3 border-t border-dashed border-border pt-3">
        {addingCustom ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitAdd();
                if (e.key === "Escape") { setAddingCustom(false); setNewTitle(""); }
              }}
              placeholder="section title…"
              className="flex-1 bg-background border border-neon outline-none px-3 py-1.5 font-mono text-sm placeholder:text-muted-foreground/40 text-foreground"
            />
            <button
              type="button"
              onClick={commitAdd}
              className="px-3 py-1.5 bg-neon text-background font-mono text-xs font-bold hover:shadow-glow-neon transition-shadow shrink-0"
            >
              add
            </button>
            <button
              type="button"
              onClick={() => { setAddingCustom(false); setNewTitle(""); }}
              className="px-3 py-1.5 border border-border font-mono text-xs text-muted-foreground hover:border-foreground transition-colors shrink-0"
            >
              cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingCustom(true)}
            className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border hover:border-neon hover:text-neon text-muted-foreground font-mono text-xs py-2 transition-colors"
          >
            <span className="text-neon text-sm leading-none">+</span> add custom section
          </button>
        )}
      </div>
    </>
  );
}

// ─── Colour picker (small popover) ────────────────────────────────────────────────
function ColorPicker({
  value,
  defaultCss,
  theme,
  onChange,
}: {
  value: string;
  /** CSS var string for this section's built-in accent, shown when no custom colour is picked yet */
  defaultCss: string;
  theme: PortfolioThemeId;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // If user has picked a colour, show that. Otherwise fall back to the section's own default accent.
  const current = SECTION_COLORS.find((c) => c.key === value);
  const activeCss = current ? current.css : defaultCss;
  const colors = SECTION_COLOR_GROUPS[theme] ?? SECTION_COLOR_GROUPS.terminal;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger swatch */}
      <button
        type="button"
        title="choose section colour"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-1.5 py-1 border border-border hover:border-foreground transition-colors"
        aria-label="choose section colour"
      >
        {/* coloured circle swatch — shows current or section default */}
        <span
          className="block h-2.5 w-2.5 rounded-full border border-white/10 shrink-0"
          style={{ background: activeCss }}
        />
        {/* tiny chevron */}
        <svg className="h-2 w-2 text-muted-foreground" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 3L4 5.5L6.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 max-h-72 min-w-[150px] overflow-y-auto border border-border bg-card py-1 shadow-brutal"
        >
          {colors.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => { onChange(c.key); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-2.5 py-1 hover:bg-secondary transition-colors font-mono text-[10px] uppercase tracking-wide ${
                value === c.key ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className="block h-2.5 w-2.5 rounded-full border border-white/10 shrink-0"
                style={{ background: c.css }}
              />
              {c.label}
              {value === c.key && (
                <span className="ml-auto text-[9px]" style={{ color: c.css }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sortable row ──────────────────────────────────────────────────────────
function SortableRow({
  id, on, color, theme, customSections, onToggle, onColorChange, onRemove,
}: {
  id: SectionId;
  on: boolean;
  color: string;
  theme: PortfolioThemeId;
  customSections: CustomSection[];
  onToggle: () => void;
  onColorChange: (key: string) => void;
  onRemove?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const meta = getSectionMeta(id, customSections);
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined };

  // The section's built-in default accent CSS var (e.g. "text-cyan" -> "var(--color-cyan)")
  const defaultAccentCss = meta.accent.replace("text-", "var(--color-") + ")";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 border border-transparent hover:border-border bg-background/50 px-2 py-2 ${isDragging ? "border-neon shadow-glow-neon" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground/60 hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label={`reorder ${meta.label}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm">
          <span className="text-neon">$</span> {meta.label}
        </p>
        <p className="text-xs font-mono text-muted-foreground truncate">{meta.desc}</p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
          title="remove custom section"
          aria-label={`remove ${meta.label}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      {/* Colour picker — left of the on/off button */}
      <ColorPicker value={color} defaultCss={defaultAccentCss} theme={theme} onChange={onColorChange} />
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border transition-colors ${
          on ? "border-neon text-neon" : "border-border text-muted-foreground hover:border-foreground"
        }`}
      >
        {on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {on ? "on" : "off"}
      </button>
    </div>
  );
}
