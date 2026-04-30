import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TerminalField } from "@/components/auth/TerminalField";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "signup — folio" },
      { name: "description", content: "Claim your folio handle." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle) {
      try {
        localStorage.setItem("folio:handle", handle);
      } catch {
        // ignore (SSR / privacy mode)
      }
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      title="signup"
      subtitle="claim your handle in <60s"
      footer={
        <>
          got an account?{" "}
          <Link to="/login" className="text-neon hover:underline">
            ./login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 h-10 border border-border hover:border-neon hover:text-neon transition-colors font-mono text-sm"
        >
          <Github className="h-4 w-4" /> signup --provider github
        </button>

        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <span className="flex-1 h-px bg-border" />
          OR
          <span className="flex-1 h-px bg-border" />
        </div>

        <TerminalField
          label="handle"
          prefix="folio.dev/u/"
          required
          pattern="[a-zA-Z0-9_-]+"
          placeholder="yourhandle"
          value={handle}
          onChange={(e) => setHandle(e.target.value.replace(/\s+/g, ""))}
        />
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
          minLength={8}
          placeholder="min 8 chars"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full h-10 bg-neon text-background font-mono font-bold text-sm hover:shadow-glow-neon transition-shadow"
        >
          $ init --portfolio
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
