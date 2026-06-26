import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minify the server bundle so the Worker stays under Cloudflare's size limit.
export default defineCloudflareConfig({
    minify: true,
      });
