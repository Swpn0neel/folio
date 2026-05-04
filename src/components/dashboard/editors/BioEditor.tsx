import { type Portfolio } from "@/lib/portfolio";
import { TextField } from "@/components/dashboard/Field";
import { Card } from "@/components/dashboard/Card";

interface BioEditorProps {
  portfolio: Portfolio;
  update: <K extends keyof Portfolio>(key: K, value: Portfolio[K]) => void;
  shadowCss?: string;
}

export function BioEditor({ portfolio, update, shadowCss }: BioEditorProps) {
  return (
    <Card title="bio" subtitle="tell visitors who you are" shadowCss={shadowCss}>
      <TextField
        label="about"
        hint={`${(portfolio.bio || "").length}/2000 · optional`}
        maxLength={2000}
        value={portfolio.bio}
        onChange={(e) => update("bio", e.target.value)}
        placeholder={"// what do you build?\n// what do you care about?\n// what makes you, you?"}
        rows={5}
      />
    </Card>
  );
}
