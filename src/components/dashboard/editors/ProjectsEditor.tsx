import { type Project } from "@/lib/portfolio";
import { Field, TextField } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { uid } from "@/utils/id";

interface ProjectsEditorProps {
  projects: Project[];
  onAdd: (item: Project) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Project>) => void;
  onReorder: (next: Project[]) => void;
  shadowCss?: string;
}

export function ProjectsEditor({
  projects,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  shadowCss,
}: ProjectsEditorProps) {
  return (
    <Card title="projects" subtitle="what you've shipped" shadowCss={shadowCss}>
      <ListEditor
        title="projects"
        accent="text-neon"
        items={projects}
        getId={(p) => p.id}
        onAdd={() =>
          onAdd({ id: uid(), name: "", description: "", url: "", tech: "" })
        }
        onRemove={onRemove}
        onReorder={onReorder}
        renderItem={(pr) => (
          <>
            <Field
              label="name"
              value={pr.name}
              onChange={(e) => onUpdate(pr.id, { name: e.target.value })}
              placeholder="next-edge-cache"
            />
            <Field
              label="tech"
              value={pr.tech ?? ""}
              onChange={(e) => onUpdate(pr.id, { tech: e.target.value })}
              placeholder="typescript · react"
            />
            <div className="sm:col-span-2">
              <TextField
                label="description"
                value={pr.description}
                onChange={(e) =>
                  onUpdate(pr.id, { description: e.target.value })
                }
                placeholder="what does it do, why does it matter"
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="url"
                value={pr.url ?? ""}
                onChange={(e) => onUpdate(pr.id, { url: e.target.value })}
                placeholder="https://github.com/you/repo"
              />
            </div>
          </>
        )}
      />
    </Card>
  );
}
