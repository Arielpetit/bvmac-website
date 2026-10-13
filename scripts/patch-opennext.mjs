// Next.js 16.4 writes .next/server/preview-props.json, which the Cloudflare adapter
// (1.20.x) does not inline yet. Without this, every request fails with
// "Unexpected loadManifest(/.next/server/preview-props.json) call!".
import { readFileSync, writeFileSync } from "node:fs";

const file = "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js";
const from = "{*-manifest,required-server-files,prefetch-hints}.json";
const to = "{*-manifest,required-server-files,prefetch-hints,preview-props}.json";
const src = readFileSync(file, "utf8");
if (src.includes(to)) process.exit(0);
if (!src.includes(from)) {
  console.warn("patch-opennext: adapter changed, check whether this patch is still needed");
  process.exit(0);
}
writeFileSync(file, src.replace(from, to));
console.log("patch-opennext: preview-props.json is now inlined");
