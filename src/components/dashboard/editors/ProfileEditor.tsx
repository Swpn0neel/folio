import { type Portfolio } from "@/lib/portfolio";
import { Field, ImageUploadField } from "@/components/dashboard/Field";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/dashboard/Card";

interface ProfileEditorProps {
  portfolio: Portfolio;
  update: <K extends keyof Portfolio>(key: K, value: Portfolio[K]) => void;
  shadowCss?: string;
}

export function ProfileEditor({ portfolio, update, shadowCss }: ProfileEditorProps) {
  return (
    <Card title="profile" subtitle="who are you?" shadowCss={shadowCss}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="full name"
          value={portfolio.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Alex Rivera"
        />
        <ImageUploadField
          label="avatar"
          hint="upload or paste URL"
          value={portfolio.avatarUrl}
          onChange={(val) => update("avatarUrl", val)}
          placeholder="https://..."
        />
      </div>
      <Field
        label="tagline"
        hint={
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="show-handle"
              checked={portfolio.showHandle ?? true}
              onCheckedChange={(checked) => update("showHandle", !!checked)}
              className="h-3 w-3 border-border data-[state=checked]:bg-neon data-[state=checked]:text-background shrink-0"
            />
            <label
              htmlFor="show-handle"
              className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground cursor-pointer select-none leading-none"
            >
              show @tag
            </label>
          </div>
        }
        value={portfolio.tagline}
        onChange={(e) => update("tagline", e.target.value)}
        placeholder="staff engineer @ vercel"
      />
    </Card>
  );
}
