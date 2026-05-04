import {
  type CustomSection,
  type CustomSectionItem,
  type CustomSectionTemplate,
  getCustomSectionTemplateMeta,
} from "@/lib/portfolio";
import { Field, TextField, ImageUploadField } from "@/components/dashboard/Field";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { Card } from "@/components/dashboard/Card";
import { TemplateSelect } from "@/components/dashboard/TemplateSelect";

interface CustomSectionEditorProps {
  section: CustomSection;
  onUpdateSection: (sectionId: string, patch: Partial<CustomSection>) => void;
  onAddItem: (sectionId: string) => void;
  onUpdateItem: (
    sectionId: string,
    itemId: string,
    patch: Partial<CustomSectionItem>
  ) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
  onReorderItems: (sectionId: string, next: CustomSectionItem[]) => void;
  shadowCss?: string;
}

export function CustomSectionEditor({
  section,
  onUpdateSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItems,
  shadowCss,
}: CustomSectionEditorProps) {
  const templateMeta = getCustomSectionTemplateMeta(section.template ?? "simple");

  return (
    <Card
      key={section.id}
      title={section.title || "untitled section"}
      subtitle="custom section"
      shadowCss={shadowCss}
    >
      <div className="space-y-4">
        {/* Section title */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_220px] gap-3">
          <Field
            label="section title"
            value={section.title}
            onChange={(e) =>
              onUpdateSection(section.id, { title: e.target.value })
            }
            placeholder="e.g. certifications, publications, volunteer…"
          />
          <TemplateSelect
            value={section.template ?? "simple"}
            onChange={(template) =>
              onUpdateSection(section.id, { template })
            }
          />
        </div>

        {/* Items */}
        <ListEditor
          title={templateMeta.label}
          subtitle={templateMeta.desc}
          accent="text-magenta"
          items={section.items}
          getId={(it) => it.id}
          onAdd={() => onAddItem(section.id)}
          onRemove={(itemId) => onRemoveItem(section.id, itemId)}
          onReorder={(next) => onReorderItems(section.id, next)}
          addLabel="add item"
          renderItem={(item) => (
            <div className="sm:col-span-2">
              <CustomItemFields
                template={section.template ?? "simple"}
                item={item}
                onChange={(patch) => onUpdateItem(section.id, item.id, patch)}
              />
            </div>
          )}
        />
      </div>
    </Card>
  );
}

function CustomItemFields({
  template,
  item,
  onChange,
}: {
  template: CustomSectionTemplate;
  item: CustomSectionItem;
  onChange: (patch: Partial<CustomSectionItem>) => void;
}) {
  const metaValue = item.meta ?? item.subheading ?? "";
  const updateMeta = (meta: string) => onChange({ meta, subheading: meta });

  if (template === "linkCards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Open source starter"
        />
        <Field
          label="url"
          hint="required for click"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="why this link is useful"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="meta"
            hint="optional"
            value={metaValue}
            onChange={(e) => updateMeta(e.target.value)}
            placeholder="github · docs · case study"
          />
        </div>
      </div>
    );
  }

  if (template === "timeline") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. launched v2"
        />
        <Field
          label="date / period"
          value={item.date ?? metaValue}
          onChange={(e) => onChange({ date: e.target.value, meta: e.target.value })}
          placeholder="2024 · Jan-Mar"
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="what happened and why it mattered"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="link"
            hint="optional"
            value={item.link ?? ""}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (template === "gallery") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="title"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. brand refresh"
        />
        <ImageUploadField
          label="image"
          hint="upload or paste URL"
          value={item.imageUrl ?? ""}
          onChange={(val) => onChange({ imageUrl: val })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="caption or context"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="link"
            hint="optional"
            value={item.link ?? ""}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (template === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="label"
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. users"
        />
        <Field
          label="value"
          value={item.value ?? ""}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="10k+"
        />
        <Field
          label="meta"
          hint="optional"
          value={metaValue}
          onChange={(e) => updateMeta(e.target.value)}
          placeholder="monthly active"
        />
        <Field
          label="link"
          hint="optional"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
        <div className="sm:col-span-2">
          <TextField
            label="description"
            hint="optional"
            value={item.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="extra context for the number"
          />
        </div>
      </div>
    );
  }

  if (template === "textBox") {
    return (
      <div className="sm:col-span-2">
        <TextField
          label="text content"
          hint="multi-line supported"
          value={item.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="// write something here..."
          rows={6}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        label="title"
        value={item.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g. AWS Solutions Architect"
      />
      <Field
        label="meta"
        hint="optional"
        value={metaValue}
        onChange={(e) => updateMeta(e.target.value)}
        placeholder="e.g. Amazon Web Services · 2024"
      />
      <div className="sm:col-span-2">
        <Field
          label="link"
          hint="optional"
          value={item.link ?? ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          label="description"
          hint="optional"
          value={item.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="a short description of this item…"
        />
      </div>
    </div>
  );
}
