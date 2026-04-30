import { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { SECTION_META, type SectionId } from "@/lib/portfolio";

type Props = {
  order: SectionId[];
  enabled: Record<SectionId, boolean>;
  onReorder: (next: SectionId[]) => void;
  onToggle: (id: SectionId) => void;
};

export function SectionsManager({ order, enabled, onReorder, onToggle }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
    // SSR-safe static render — hydration matches, then DnD takes over on client.
    return (
      <div className="space-y-1">
        {order.map((id) => {
          const meta = SECTION_META[id];
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
                <p className="text-[11px] font-mono text-muted-foreground truncate">{meta.desc}</p>
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {order.map((id) => (
            <SortableRow key={id} id={id} on={enabled[id]} onToggle={() => onToggle(id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, on, onToggle }: { id: SectionId; on: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const meta = SECTION_META[id];
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined };
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
        <p className="text-[11px] font-mono text-muted-foreground truncate">{meta.desc}</p>
      </div>
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
