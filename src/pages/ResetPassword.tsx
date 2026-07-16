import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const inputClass =
  "w-full bg-background text-foreground border-2 border-foreground px-3 py-2 font-body text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground uppercase tracking-wider";

// Two modes: "request" emails a recovery link; "update" (entered when the
// emailed link lands here with a recovery session) sets the new password.
export default function ResetPassword() {
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Recovery links can arrive with an error in the hash (expired/used link).
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const hashError = hash.get("error_description");
    if (hashError) setError(hashError.replace(/\+/g, " "));

    // supabase-js consumes a valid recovery hash automatically and starts a
    // temporary session, emitting PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("update");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setMode("update");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setMessage("Check your email for the reset link. Open it promptly — links expire.");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    setMessage("Password updated. You are signed in.");
    setTimeout(() => window.location.replace("/admin"), 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <SEO title="Reset Password" description="Reset your password" path="/reset-password" noindex />
      {mode === "request" ? (
        <form onSubmit={requestReset} className="w-full max-w-md border-2 border-foreground p-8">
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">
            Reset Password
          </h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className={inputClass}
            required
          />
          {error && (
            <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">{error}</p>
          )}
          {message && <p className="mt-2 text-sm uppercase tracking-wider">{message}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send Reset Link"}
          </button>
          <p className="mt-4 text-center text-sm uppercase tracking-wider">
            <Link to="/login" className="underline hover:no-underline">Back to sign in</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={updatePassword} className="w-full max-w-md border-2 border-foreground p-8">
          <h1 className="font-heading text-2xl uppercase tracking-widest text-center mb-8">
            New Password
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className={`${inputClass} mb-3`}
            required
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className={inputClass}
            required
          />
          {error && (
            <p className="text-destructive-foreground mt-2 text-sm uppercase tracking-wider">{error}</p>
          )}
          {message && <p className="mt-2 text-sm uppercase tracking-wider">{message}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {busy ? "Saving…" : "Set New Password"}
          </button>
        </form>
      )}
    </div>
  );
}
