import { useState, useEffect, useRef } from "react";
import { GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uid } from "@/lib/portfolio";

const INITIAL_SECTIONS = [
  { id: "profile", name: "profile", desc: "name · avatar · tag", on: true, accent: "var(--neon)" },
  { id: "bio", name: "bio", desc: "about you · in your words", on: true, accent: "var(--rose)" },
  { id: "socials", name: "socials", desc: "github · x · linkedin · site", on: true, accent: "var(--cyan)" },
  { id: "projects", name: "projects", desc: "what you've built", on: true, accent: "var(--neon)" },
  { id: "blogs", name: "blogs", desc: "what you've written", on: true, accent: "var(--magenta)" },
  { id: "experience", name: "experience", desc: "where you've worked", on: false, accent: "var(--indigo)" },
  { id: "achievements", name: "achievements", desc: "talks · awards · milestones", on: true, accent: "var(--amber)" },
];

export function SectionsShowcase() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [mounted, setMounted] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (addingCustom) inputRef.current?.focus();
  }, [addingCustom]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, on: !s.on } : s))
    );
  };


  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const commitAdd = () => {
    const t = newTitle.trim();
    if (t) {
      setSections((prev) => [
        ...prev,
        {
          id: `custom:${uid()}`,
          name: t,
          desc: "0 items · custom section",
          on: true,
          accent: "var(--neon)",
        },
      ]);
    }
    setNewTitle("");
    setAddingCustom(false);
  };

  return (
    <section id="sections" className="py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-mono text-xs text-muted-foreground mb-3">
            <span className="text-amber">/**</span> control <span className="text-amber">*/</span>
          </p>
          <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-magenta">sections</span>.map(
            {/* <br />
            <span className="ml-6 text-neon">(s) =&gt; yours(s)</span>
            <br /> */}
            )
          </h2>
          <p className="mt-5 text-muted-foreground text-sm leading-relaxed">
            <span className="text-amber">// </span>
            want to lead with blogs and skip experience? done.
            just projects and a bio? even better. folio adapts
            to the story <span className="text-neon">you</span> want to tell.
          </p>
          <ul className="mt-8 space-y-2 font-mono text-sm">
            {[
              "every section is optional — show only what you love",
              "drag-and-drop reordering, persisted instantly",
              "smart defaults so it always looks intentional",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="text-neon shrink-0">▸</span>
                <span className="text-foreground/85">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border bg-card shadow-brutal-magenta">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 bg-secondary">
            <span className="h-2.5 w-2.5 bg-destructive" />
            <span className="h-2.5 w-2.5 bg-amber" />
            <span className="h-2.5 w-2.5 bg-neon" />
            <span className="ml-2 text-[10px] font-mono text-muted-foreground">~/folio/sections.config</span>
          </div>
          <div className="p-3 space-y-1 min-h-[360px]">
            {mounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((s) => (
                    <SortableItem
                      key={s.id}
                      section={s}
                      onToggle={() => toggleSection(s.id)}
                      onRemove={s.id.startsWith("custom:") ? () => removeSection(s.id) : undefined}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              sections.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 border border-transparent bg-background/50 px-2 py-2"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/60" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm">
                      <span className="text-neon">$</span> {s.name}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground truncate">{s.desc}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${
                      s.on
                        ? "border-neon text-neon"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s.on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {s.on ? "on" : "off"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Add custom section inline form - matching dashboard */}
          <div className="mt-3 border-t border-dashed border-border p-3 pt-4">
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
        </div>
      </div>
    </section>
  );
}

function SortableItem({
  section,
  onToggle,
  onRemove,
}: {
  section: (typeof INITIAL_SECTIONS)[0];
  onToggle: () => void;
  onRemove?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 border border-transparent hover:border-border bg-background/50 px-2 py-2 transition-colors group relative ${
        isDragging ? "border-neon shadow-glow-neon z-50" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm">
          <span className="text-neon">$</span> {section.name}
        </p>
        <p className="text-xs font-mono text-muted-foreground truncate">{section.desc}</p>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
          title="remove custom section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Static Color Swatch */}
      <ColorPicker 
        value={section.accent} 
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border transition-colors ${
          section.on
            ? "border-neon text-neon"
            : "border-border text-muted-foreground hover:border-foreground"
        }`}
      >
        {section.on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {section.on ? "on" : "off"}
      </button>
    </div>
  );
}

function ColorPicker({
  value,
}: {
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 px-1.5 py-1 border border-border opacity-60 group-hover:opacity-100 transition-opacity">
      <span
        className="block h-2.5 w-2.5 rounded-full border border-white/10 shrink-0"
        style={{ background: value }}
      />
      <svg className="h-2 w-2 text-muted-foreground" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 3L4 5.5L6.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

