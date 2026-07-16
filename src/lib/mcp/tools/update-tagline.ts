import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "update_tagline",
  title: "Update site tagline",
  description:
    "Update the site-wide tagline shown under the MY LIBERAL PONY heading. Requires an admin-authorized session; RLS enforces write permission.",
  inputSchema: { tagline: z.string().trim().min(1).max(200).describe("New tagline text.") },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ tagline }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
    const { data: existing, error: readErr } = await supabase
      .from("mlp_site_config")
      .select("id, branding")
      .limit(1)
      .maybeSingle();
    if (readErr) return { content: [{ type: "text", text: readErr.message }], isError: true };
    if (!existing) return { content: [{ type: "text", text: "No site config row exists." }], isError: true };
    const branding = { ...(existing.branding as Record<string, unknown>), tagline };
    const { error } = await supabase
      .from("mlp_site_config")
      .update({ branding })
      .eq("id", existing.id);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Tagline updated to: ${tagline}` }],
      structuredContent: { tagline },
    };
  },
});