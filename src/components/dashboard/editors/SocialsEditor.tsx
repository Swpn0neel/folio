import { type Portfolio, type Social } from "@/lib/portfolio";
import { Field } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { getSocialIcon } from "@/lib/social-icons";
import { uid } from "@/utils/id";

interface SocialsEditorProps {
  socials: Social[];
  onAdd: (item: Social) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Social>) => void;
  onReorder: (next: Social[]) => void;
  shadowCss?: string;
}

export function SocialsEditor({
  socials,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  shadowCss,
}: SocialsEditorProps) {
  return (
    <Card title="socials" subtitle="links visitors should follow" shadowCss={shadowCss}>
      <ListEditor
        title="links"
        accent="text-cyan"
        items={socials}
        getId={(s) => s.id}
        onAdd={() => onAdd({ id: uid(), label: "", url: "" })}
        onRemove={onRemove}
        onReorder={onReorder}
        renderItem={(s) => {
          const Icon = getSocialIcon(s.label);
          return (
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-[180px] shrink-0">
                <Field
                  icon={<Icon className="h-4 w-4" />}
                  label="platform"
                  value={s.label}
                  onChange={(e) => onUpdate(s.id, { label: e.target.value })}
                  placeholder="github"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Field
                  label="url"
                  value={s.url}
                  onChange={(e) => onUpdate(s.id, { url: e.target.value })}
                  placeholder="https://github.com/you"
                />
              </div>
            </div>
          );
        }}
      />
    </Card>
  );
}
