import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TerminalField } from "@/components/auth/TerminalField";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "login — folio" },
      { name: "description", content: "Sign in to your folio account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend auth wired up later; for now just go to dashboard.
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      title="login"
      subtitle="welcome back, ship something today"
      footer={
        <>
          new here?{" "}
          <Link to="/signup" className="text-neon hover:underline">
            ./signup
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 h-10 border border-border hover:border-neon hover:text-neon transition-colors font-mono text-sm"
        >
          <Github className="h-4 w-4" /> auth --provider github
        </button>

        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <span className="flex-1 h-px bg-border" />
          OR
          <span className="flex-1 h-px bg-border" />
        </div>

        <TerminalField
          label="email"
          type="email"
          required
          placeholder="you@domain.dev"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TerminalField
          label="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full h-10 bg-neon text-background font-mono font-bold text-sm hover:shadow-glow-neon transition-shadow"
        >
          $ login --execute
        </button>

        <div className="text-center">
          <Link to="/dashboard" className="font-mono text-[11px] text-muted-foreground hover:text-neon">
            // skip auth → try dashboard
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
