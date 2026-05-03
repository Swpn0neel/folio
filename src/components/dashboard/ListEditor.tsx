import type { ReactNode } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
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

type Props<T> = {
  title: string;
  subtitle?: string;
  accent?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onReorder?: (items: T[]) => void;
  getId: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  addLabel?: string;
};

export function ListEditor<T>({
  title,
  subtitle,
  accent = "text-neon",
  items,
  onAdd,
  onRemove,
  onReorder,
  getId,
  renderItem,
  addLabel = "add",
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const listContent = (
    <div className="space-y-3">
      {items.map((item, i) => {
        const id = getId(item);
        if (onReorder) {
          return (
            <SortableItem
              key={id}
              id={id}
              index={i}
              onRemove={() => onRemove(id)}
              renderItem={() => renderItem(item, i)}
            />
          );
        }
        return (
          <div key={id} className="border border-border bg-background/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-[10px] text-muted-foreground">
                [{String(i + 1).padStart(2, "0")}]
              </div>
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive border border-transparent transition-colors"
                aria-label="remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{renderItem(item, i)}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${accent}`}>
            {">"} {title}
          </h3>
          {subtitle && <p className="font-mono text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 border border-border hover:border-neon hover:text-neon transition-colors"
        >
          <Plus className="h-3 w-3" /> {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="font-mono text-[11px] text-muted-foreground border border-dashed border-border px-3 py-4">
          <span className="text-amber">// </span>empty. click {addLabel} to add one.
        </p>
      ) : onReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
            {listContent}
          </SortableContext>
        </DndContext>
      ) : (
        listContent
      )}
    </div>
  );
}

function SortableItem({
  id,
  index,
  onRemove,
  renderItem,
}: {
  id: string;
  index: number;
  onRemove: () => void;
  renderItem: () => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-border bg-background/50 p-3 ${
        isDragging ? "border-neon shadow-glow-neon z-50 bg-secondary/80" : "hover:border-border/80"
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
          <span className="opacity-50">[{String(index + 1).padStart(2, "0")}]</span>
          {isDragging && (
            <span className="text-neon animate-pulse text-[8px] uppercase tracking-widest font-bold">
              moving_item...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive border border-transparent transition-colors"
            aria-label="remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-neon cursor-grab active:cursor-grabbing border border-transparent transition-colors"
            aria-label="reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{renderItem()}</div>
    </div>
  );
}
