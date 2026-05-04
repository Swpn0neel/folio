import { type Achievement } from "@/lib/portfolio";
import { Field } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { uid } from "@/utils/id";

interface AchievementsEditorProps {
  achievements: Achievement[];
  onAdd: (item: Achievement) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Achievement>) => void;
  onReorder: (next: Achievement[]) => void;
  shadowCss?: string;
}

export function AchievementsEditor({
  achievements,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  shadowCss,
}: AchievementsEditorProps) {
  return (
    <Card
      title="achievements"
      subtitle="talks · awards · milestones"
      shadowCss={shadowCss}
    >
      <ListEditor
        title="achievements"
        accent="text-amber"
        items={achievements}
        getId={(a) => a.id}
        onAdd={() => onAdd({ id: uid(), title: "", meta: "" })}
        onRemove={onRemove}
        onReorder={onReorder}
        renderItem={(a) => (
          <>
            <Field
              label="title"
              value={a.title}
              onChange={(e) => onUpdate(a.id, { title: e.target.value })}
              placeholder="github star, 2024"
            />
            <Field
              label="meta"
              hint="optional"
              value={a.meta ?? ""}
              onChange={(e) => onUpdate(a.id, { meta: e.target.value })}
              placeholder="open source recognition"
            />
          </>
        )}
      />
    </Card>
  );
}
