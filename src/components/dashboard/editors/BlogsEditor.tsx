import { type Blog } from "@/lib/portfolio";
import { Field } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { uid } from "@/utils/id";

interface BlogsEditorProps {
  blogs: Blog[];
  onAdd: (item: Blog) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Blog>) => void;
  onReorder: (next: Blog[]) => void;
  shadowCss?: string;
}

export function BlogsEditor({
  blogs,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  shadowCss,
}: BlogsEditorProps) {
  return (
    <Card title="blogs" subtitle="featured writing" shadowCss={shadowCss}>
      <ListEditor
        title="posts"
        accent="text-magenta"
        items={blogs}
        getId={(b) => b.id}
        onAdd={() => onAdd({ id: uid(), title: "", url: "", meta: "" })}
        onRemove={onRemove}
        onReorder={onReorder}
        renderItem={(b) => (
          <>
            <div className="sm:col-span-2">
              <Field
                label="title"
                value={b.title}
                onChange={(e) => onUpdate(b.id, { title: e.target.value })}
                placeholder="why edge functions changed my stack"
              />
            </div>
            <Field
              label="url"
              value={b.url}
              onChange={(e) => onUpdate(b.id, { url: e.target.value })}
              placeholder="https://..."
            />
            <Field
              label="meta"
              hint="optional"
              value={b.meta ?? ""}
              onChange={(e) => onUpdate(b.id, { meta: e.target.value })}
              placeholder="12 min · 18k reads"
            />
          </>
        )}
      />
    </Card>
  );
}
