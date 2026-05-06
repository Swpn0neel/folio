import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthShell } from "@/components/auth/AuthShell";
import { TerminalField } from "@/components/auth/TerminalField";
import { supabase } from "@/lib/supabase";

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
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, isAuthLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let emailToUse = loginId;

      // If it doesn't look like an email, assume it's a handle
      if (!loginId.includes("@")) {
        const { data, error: rpcError } = await supabase.rpc("get_email_by_handle", {
          p_handle: loginId,
        });

        if (rpcError) throw rpcError;
        if (!data) {
          setError("handle not found.");
          setIsLoading(false);
          return;
        }
        emailToUse = data;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (authError) throw authError;

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive font-mono text-xs">
            {error}
          </div>
        )}

        <TerminalField
          label="email or handle"
          type="text"
          required
          placeholder="you@gmail.com or handle"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value.replace(/\s+/g, ""))}
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
          disabled={isLoading}
          className="w-full h-10 bg-neon text-background font-mono font-bold text-sm hover:shadow-glow-neon transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "$ processing..." : "$ login --execute"}
        </button>
      </form>
    </AuthShell>
  );
}
