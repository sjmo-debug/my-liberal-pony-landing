import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const inputClass =
  "w-full bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground uppercase tracking-wider";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(next);
    });
  }, [next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError(error.message);
    // Full navigation so any consent redirect handler re-runs on target route
    window.location.replace(next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <SEO title="Sign In" description="Sign in" path="/login" noindex />
      <form onSubmit={submit} className="w-full max-w-md border-2 border-foreground p-8">
        <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">Sign In</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          className={`${inputClass} mb-3`}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className={inputClass}
          required
        />
        {error && (
          <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}