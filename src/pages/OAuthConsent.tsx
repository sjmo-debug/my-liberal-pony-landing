import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthResult = { data?: any; error?: { message: string } | null };
interface OAuthApi {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
}
const oauthApi = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauthApi.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthApi.approveAuthorization(authorizationId)
      : await oauthApi.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an application";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <SEO title="Authorize" description="Authorize an application" path="/.lovable/oauth/consent" noindex />
      <main className="w-full max-w-lg border-2 border-foreground p-8 space-y-6">
        {error && (
          <p className="text-destructive-foreground text-sm uppercase tracking-wider border-2 border-foreground p-3">
            {error}
          </p>
        )}
        {!details && !error && (
          <p className="font-heading uppercase tracking-widest text-sm">Loading…</p>
        )}
        {details && (
          <>
            <h1 className="font-heading text-2xl uppercase tracking-widest">
              Connect {clientName} to MY LIBERAL PONY
            </h1>
            <p className="font-body text-sm uppercase tracking-wider">
              This lets {clientName} use this app as you.
            </p>
            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">
              App permissions and backend policies still decide what data is accessible.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => decide(true)}
                className="flex-1 font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors disabled:opacity-50"
              >
                {busy ? "Working…" : "Approve"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1 font-heading uppercase tracking-widest text-sm px-4 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                Cancel connection
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}