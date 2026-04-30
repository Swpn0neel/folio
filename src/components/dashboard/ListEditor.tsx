import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

type Props<T> = {
  title: string;
  accent?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  getId: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  addLabel?: string;
};

export function ListEditor<T>({
  title,
  accent = "text-neon",
  items,
  onAdd,
  onRemove,
  getId,
  renderItem,
  addLabel = "add",
}: Props<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${accent}`}>
          {">"} {title}
        </h3>
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
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={getId(item)} className="relative border border-border bg-background/50 p-3 pr-10">
              <span className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => onRemove(getId(item))}
                  className="h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive border border-transparent transition-colors"
                  aria-label="remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
              <div className="font-mono text-[10px] text-muted-foreground mb-2">
                [{String(i + 1).padStart(2, "0")}]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{renderItem(item, i)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
