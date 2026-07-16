import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getSiteConfig from "./tools/get-site-config";
import listReleases from "./tools/list-releases";
import updateTagline from "./tools/update-tagline";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "my-liberal-pony-mcp",
  title: "MY LIBERAL PONY",
  version: "0.1.0",
  instructions:
    "Tools for the MY LIBERAL PONY website. Read site configuration and releases, and (as an authorized admin) update the site tagline. Calls act as the signed-in Supabase user; write access is enforced by Row-Level Security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getSiteConfig, listReleases, updateTagline],
});