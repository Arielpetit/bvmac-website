import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered pages ship inside the deployment, so a deploy needs no writes to key-value storage
// (the free plan allows only 1,000 a day). Pages are served as built; content edited in the admin
// is read from Supabase on each request that needs it.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
