import { useState, useEffect } from "react";
import { GripVertical, Eye, EyeOff } from "lucide-react";
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

const INITIAL_SECTIONS = [
  { id: "profile", name: "profile", desc: "name · avatar · bio", on: true },
  { id: "socials", name: "socials", desc: "github · x · linkedin · site", on: true },
  { id: "projects", name: "projects", desc: "what you've built", on: true },
  { id: "blogs", name: "blogs", desc: "what you've written", on: true },
  { id: "experience", name: "experience", desc: "where you've worked", on: false },
  { id: "achievements", name: "achievements", desc: "talks · awards · milestones", on: true },
];

export function SectionsShowcase() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              sections.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 border border-transparent px-3 py-2.5"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/60" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm">
                      <span className="text-neon">$</span> {s.name}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">{s.desc}</p>
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
        </div>
      </div>
    </section>
  );
}

function SortableItem({
  section,
  onToggle,
}: {
  section: (typeof INITIAL_SECTIONS)[0];
  onToggle: () => void;
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
      className={`flex items-center gap-3 border border-transparent hover:border-border hover:bg-secondary/50 px-3 py-2.5 transition-colors group relative ${
        isDragging ? "bg-secondary border-neon/50 z-50 shadow-glow-neon" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/40 hover:text-foreground transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm">
          <span className="text-neon">$</span> {section.name}
        </p>
        <p className="text-xs font-mono text-muted-foreground">{section.desc}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border transition-all hover:scale-105 active:scale-95 ${
          section.on
            ? "border-neon text-neon bg-neon/5 shadow-glow-neon"
            : "border-border text-muted-foreground hover:border-foreground"
        }`}
      >
        {section.on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {section.on ? "on" : "off"}
      </button>
    </div>
  );
}

