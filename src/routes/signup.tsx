import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { TerminalField } from "@/components/auth/TerminalField";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({
    handle: z.string().optional(),
  }),
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
  const search = Route.useSearch();
  const [handle, setHandle] = useState(search.handle ?? "");
  const [email, setEmail] = useState("");
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
      // 1. Check handle uniqueness
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }
      if (existingProfile) {
        setError("handle is already taken.");
        setIsLoading(false);
        return;
      }

      // 2. Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            handle: handle, // The database trigger will pick this up
          },
        },
      });

      if (authError) throw authError;

      // Check if email confirmation is required
      if (!authData.session) {
        setError("Please check your email to verify your account.");
        setIsLoading(false);
        return;
      }

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive font-mono text-xs">
            {error}
          </div>
        )}

        <TerminalField
          label="handle"
          prefix="fo1io.vercel.app/u/"
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
          placeholder="you@gmail.com"
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
          disabled={isLoading}
          className="w-full h-10 bg-neon text-background font-mono font-bold text-sm hover:shadow-glow-neon transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "$ processing..." : "$ init --portfolio"}
        </button>
      </form>
    </AuthShell>
  );
}
