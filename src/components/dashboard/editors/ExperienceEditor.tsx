import { type Experience } from "@/lib/portfolio";
import { Field, TextField } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { Checkbox } from "@/components/ui/checkbox";
import { uid } from "@/utils/id";

interface ExperienceEditorProps {
  experience: Experience[];
  onAdd: (item: Experience) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Experience>) => void;
  onReorder: (next: Experience[]) => void;
  shadowCss?: string;
}

export function ExperienceEditor({
  experience,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  shadowCss,
}: ExperienceEditorProps) {
  return (
    <Card
      title="experience"
      subtitle="where you've worked"
      shadowCss={shadowCss}
    >
      <ListEditor
        title="roles"
        accent="text-cyan"
        items={experience}
        getId={(e) => e.id}
        onAdd={() =>
          onAdd({
            id: uid(),
            role: "",
            company: "",
            startDate: "",
            endDate: "",
            isCurrent: true,
            description: "",
          })
        }
        onRemove={onRemove}
        onReorder={onReorder}
        renderItem={(e) => (
          <>
            <Field
              label="role"
              value={e.role}
              onChange={(ev) => onUpdate(e.id, { role: ev.target.value })}
              placeholder="staff engineer"
            />
            <Field
              label="company"
              value={e.company}
              onChange={(ev) => onUpdate(e.id, { company: ev.target.value })}
              placeholder="vercel"
            />
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Field
                label="start date"
                value={e.startDate ?? ""}
                onChange={(ev) => onUpdate(e.id, { startDate: ev.target.value })}
                placeholder="Jan 2023"
              />
              <Field
                label="end date"
                hint={
                  <div className="flex items-center gap-1.5">
                    <Checkbox
                      id={`current-${e.id}`}
                      checked={e.isCurrent ?? true}
                      onCheckedChange={(checked) =>
                        onUpdate(e.id, { isCurrent: !!checked })
                      }
                      className="h-3 w-3 border-border data-[state=checked]:bg-neon data-[state=checked]:text-background shrink-0"
                    />
                    <label
                      htmlFor={`current-${e.id}`}
                      className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground cursor-pointer select-none leading-none"
                    >
                      still working
                    </label>
                  </div>
                }
                value={e.endDate ?? ""}
                onChange={(ev) => onUpdate(e.id, { endDate: ev.target.value })}
                placeholder="Present"
                disabled={e.isCurrent ?? true}
                className={(e.isCurrent ?? true) ? "opacity-40" : ""}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="description"
                hint="optional"
                value={e.description ?? ""}
                onChange={(ev) =>
                  onUpdate(e.id, { description: ev.target.value })
                }
                placeholder="led platform team"
              />
            </div>
          </>
        )}
      />
    </Card>
  );
}
